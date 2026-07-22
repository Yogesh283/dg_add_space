<?php

namespace App\Filament\Pages;

use App\Models\User;
use App\Services\PurchaseService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Route;
use UnitEnum;

/**
 * @property-read Schema $form
 */
class RunLevelIncome extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCurrencyRupee;

    protected static ?string $navigationLabel = 'Run Level Income';

    protected static ?string $title = 'Run 6-Level Income';

    protected static string|UnitEnum|null $navigationGroup = 'Income';

    protected static ?int $navigationSort = 4;

    protected static ?string $slug = 'run-level-income';

    public static function shouldRegisterNavigation(): bool
    {
        // Avoid crashing the whole admin sidebar if route cache is stale.
        return parent::shouldRegisterNavigation()
            && Route::has(static::getRouteName());
    }

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'product_name' => 'Company Product Sale',
        ]);
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Company sale → 6 level income')
                ->description('Enter the buyer user (who purchased from company) and amount. Level 1 = 10%, Level 2–6 = 2% each. If the user has no referral, no income will be paid.')
                ->schema([
                    Select::make('user_id')
                        ->label('Buyer User')
                        ->helperText('User who bought the product (company / offline sale).')
                        ->searchable()
                        ->preload()
                        ->required()
                        ->getSearchResultsUsing(function (string $search): array {
                            return User::query()
                                ->where(function ($query) use ($search) {
                                    $query->where('id', $search)
                                        ->orWhere('name', 'like', "%{$search}%")
                                        ->orWhere('email', 'like', "%{$search}%")
                                        ->orWhere('phone', 'like', "%{$search}%")
                                        ->orWhere('referral_code', 'like', "%{$search}%");
                                })
                                ->orderBy('id')
                                ->limit(30)
                                ->get()
                                ->mapWithKeys(fn (User $user): array => [
                                    $user->id => "#{$user->id} — {$user->name} ({$user->email})",
                                ])
                                ->all();
                        })
                        ->getOptionLabelUsing(function ($value): ?string {
                            $user = User::find($value);
                            if (! $user) {
                                return null;
                            }

                            $ref = $user->referred_by
                                ? 'Has referral'
                                : 'NO REFERRAL';

                            return "#{$user->id} — {$user->name} ({$user->email}) [{$ref}]";
                        }),
                    TextInput::make('amount')
                        ->label('Purchase Amount (₹)')
                        ->numeric()
                        ->minValue(1)
                        ->required()
                        ->prefix('₹'),
                    TextInput::make('product_name')
                        ->label('Product / Game Name')
                        ->maxLength(120)
                        ->required(),
                    Textarea::make('notes')
                        ->label('Notes (optional)')
                        ->rows(3),
                    Text::make('Levels: L1 10% · L2 2% · L3 2% · L4 2% · L5 2% · L6 2% (total up to 20% if full chain)')
                        ->color('gray'),
                ]),
        ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema->components([
            $this->getFormContentComponent(),
        ]);
    }

    public function getFormContentComponent(): Component
    {
        return Form::make([EmbeddedSchema::make('form')])
            ->id('form')
            ->livewireSubmitHandler('run')
            ->footer([
                Actions::make([
                    Action::make('run')
                        ->label('Run Level Income')
                        ->color('primary')
                        ->submit('run'),
                ])->key('form-actions'),
            ]);
    }

    public function run(PurchaseService $purchaseService): void
    {
        $data = $this->form->getState();

        /** @var User $buyer */
        $buyer = User::query()->with('sponsor')->findOrFail($data['user_id']);

        $result = $purchaseService->runCompanySaleLevelIncome(
            $buyer,
            (float) $data['amount'],
            $data['product_name'] ?? null,
            $data['notes'] ?? null
        );

        if ($result['skipped_no_referral']) {
            Notification::make()
                ->title('Order saved — no level income')
                ->body("User #{$buyer->id} has no referral. Order {$result['purchase']->order_id} created, but nothing was credited to upline.")
                ->warning()
                ->persistent()
                ->send();

            $this->form->fill([
                'product_name' => 'Company Product Sale',
            ]);

            return;
        }

        Notification::make()
            ->title('Level income credited')
            ->body("Order {$result['purchase']->order_id}: ₹{$data['amount']} — {$result['incomes_count']} level income row(s) credited to upline wallets.")
            ->success()
            ->send();

        $this->form->fill([
            'product_name' => 'Company Product Sale',
        ]);
    }
}
