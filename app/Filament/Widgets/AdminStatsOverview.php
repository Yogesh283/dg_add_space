<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\GamePurchases\GamePurchaseResource;
use App\Filament\Resources\LevelIncomes\LevelIncomeResource;
use App\Filament\Resources\SupportTickets\SupportTicketResource;
use App\Filament\Resources\Users\UserResource;
use App\Models\GamePurchase;
use App\Models\LevelIncome;
use App\Models\Payment;
use App\Models\SupportTicket;
use App\Models\User;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Number;

class AdminStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $productBuyers = User::query()
            ->whereHas('purchases', fn ($q) => $q->where('status', 'paid'))
            ->count();

        $paidOrders = GamePurchase::query()->where('status', 'paid')->count();
        $pendingOrders = GamePurchase::query()->where('status', 'pending_payment')->count();

        $depositTotal = (float) GamePurchase::query()->where('status', 'paid')->sum('amount');
        $depositToday = (float) GamePurchase::query()
            ->where('status', 'paid')
            ->where(function ($q) {
                $q->whereDate('paid_at', today())
                    ->orWhere(function ($q2) {
                        $q2->whereNull('paid_at')->whereDate('updated_at', today());
                    });
            })
            ->sum('amount');

        $incomeTotal = (float) LevelIncome::query()->sum('income_amount');
        $incomeToday = (float) LevelIncome::query()->whereDate('created_at', today())->sum('income_amount');

        $members = User::query()->where('is_admin', false)->count();
        $membersToday = User::query()->whereDate('created_at', today())->count();
        $walletTotal = (float) User::query()->sum('wallet_balance');
        $openTickets = SupportTicket::query()->whereIn('status', ['open', 'answered'])->count();
        $paymentsSuccess = (float) Payment::query()->where('status', 'success')->sum('amount');

        $inr = fn (float $n): string => '₹'.Number::format($n, maxPrecision: 2, locale: 'en_IN');

        return [
            Stat::make('Product Buyers', (string) $productBuyers)
                ->description('Users who bought — click for list')
                ->descriptionIcon(Heroicon::OutlinedUsers)
                ->color('success')
                ->url(UserResource::getUrl('index', [
                    'tableFilters' => [
                        'bought_product' => ['isActive' => true],
                    ],
                ]))
                ->icon(Heroicon::OutlinedShoppingBag),

            Stat::make('Paid Orders', (string) $paidOrders)
                ->description($pendingOrders.' pending payment')
                ->descriptionIcon(Heroicon::OutlinedClock)
                ->color('primary')
                ->url(GamePurchaseResource::getUrl('index', [
                    'tableFilters' => [
                        'status' => ['value' => 'paid'],
                    ],
                ]))
                ->icon(Heroicon::OutlinedClipboardDocumentList),

            Stat::make('Deposit Today', $inr($depositToday))
                ->description('Total deposit: '.$inr($depositTotal))
                ->descriptionIcon(Heroicon::OutlinedBanknotes)
                ->color('warning')
                ->url(GamePurchaseResource::getUrl('index', [
                    'tableFilters' => [
                        'status' => ['value' => 'paid'],
                        'today' => ['isActive' => true],
                    ],
                ]))
                ->icon(Heroicon::OutlinedCurrencyRupee),

            Stat::make('Level Income Today', $inr($incomeToday))
                ->description('Total level income: '.$inr($incomeTotal))
                ->descriptionIcon(Heroicon::OutlinedChartBar)
                ->color('danger')
                ->url(LevelIncomeResource::getUrl('index', [
                    'tableFilters' => [
                        'today' => ['isActive' => true],
                    ],
                ]))
                ->icon(Heroicon::OutlinedArrowTrendingUp),

            Stat::make('Total Level Income', $inr($incomeTotal))
                ->description('All credited upline income')
                ->color('danger')
                ->url(LevelIncomeResource::getUrl('index'))
                ->icon(Heroicon::OutlinedChartPie),

            Stat::make('Members', (string) $members)
                ->description($membersToday.' registered today')
                ->color('info')
                ->url(UserResource::getUrl('index'))
                ->icon(Heroicon::OutlinedUserGroup),

            Stat::make('Wallet Balance', $inr($walletTotal))
                ->description('All members wallet total')
                ->color('gray')
                ->url(UserResource::getUrl('index'))
                ->icon(Heroicon::OutlinedWallet),

            Stat::make('Successful Payments', $inr($paymentsSuccess))
                ->description('Gateway + company admin payments')
                ->color('success')
                ->url(GamePurchaseResource::getUrl('index', [
                    'tableFilters' => [
                        'status' => ['value' => 'paid'],
                    ],
                ]))
                ->icon(Heroicon::OutlinedCreditCard),

            Stat::make('Open Tickets', (string) $openTickets)
                ->description('Open + answered support')
                ->color('warning')
                ->url(SupportTicketResource::getUrl('index'))
                ->icon(Heroicon::OutlinedChatBubbleLeftRight),
        ];
    }
}
