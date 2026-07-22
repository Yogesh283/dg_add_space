<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Dashboard;
use App\Filament\Pages\RunLevelIncome;
use App\Filament\Resources\GameAddons\GameAddonResource;
use App\Filament\Resources\GamePurchases\GamePurchaseResource;
use App\Filament\Resources\Games\GameResource;
use App\Filament\Resources\Inquiries\InquiryResource;
use App\Filament\Resources\LevelIncomes\LevelIncomeResource;
use App\Filament\Resources\Payments\PaymentResource;
use App\Filament\Resources\SupportTickets\SupportTicketResource;
use App\Filament\Resources\Users\UserResource;
use App\Filament\Widgets\AdminStatsOverview;
use App\Filament\Widgets\LatestLevelIncomes;
use App\Filament\Widgets\LatestPaidOrders;
use Filament\Enums\ThemeMode;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationBuilder;
use Filament\Navigation\NavigationItem;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Enums\Width;
use Filament\Support\Icons\Heroicon;
use Filament\View\PanelsRenderHook;
use Filament\Widgets\AccountWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\HtmlString;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('vijay')
            ->login()
            ->brandName('DG AD SPACE')
            ->brandLogo(asset('img/logo.png'))
            ->darkModeBrandLogo(asset('img/logo.png'))
            ->favicon(asset('img/app.icon.png'))
            ->brandLogoHeight('3.25rem')
            ->colors([
                'primary' => Color::hex('#ff5c1a'),
                'danger' => Color::Rose,
                'gray' => Color::Slate,
                'info' => Color::Sky,
                'success' => Color::Emerald,
                'warning' => Color::Amber,
            ])
            ->font(
                'Plus Jakarta Sans',
                'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
            )
            ->darkMode(true)
            ->defaultThemeMode(ThemeMode::Dark)
            ->sidebarCollapsibleOnDesktop()
            ->sidebarWidth('17.5rem')
            ->collapsedSidebarWidth('4.5rem')
            ->maxContentWidth(Width::Full)
            ->spa()
            ->navigation(function (NavigationBuilder $builder): NavigationBuilder {
                return $builder->items([
                    NavigationItem::make('Dashboard')
                        ->icon(Heroicon::OutlinedHome)
                        ->url(fn (): string => Dashboard::getUrl())
                        ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.pages.dashboard'))
                        ->sort(1),
                    NavigationItem::make('Games Store')
                        ->icon(Heroicon::OutlinedPuzzlePiece)
                        ->url(fn (): string => GameResource::getUrl('index'))
                        ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.resources.games.*'))
                        ->sort(2),
                    NavigationItem::make('Game Options')
                        ->icon(Heroicon::OutlinedSquaresPlus)
                        ->url(fn (): string => GameAddonResource::getUrl('index'))
                        ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.resources.game-addons.*'))
                        ->sort(3),
                    NavigationItem::make('Users')
                        ->icon(Heroicon::OutlinedUsers)
                        ->url(fn (): string => UserResource::getUrl('index'))
                        ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.resources.users.*'))
                        ->sort(4),
                    NavigationItem::make('Orders')
                        ->icon(Heroicon::OutlinedBanknotes)
                        ->url(fn (): string => GamePurchaseResource::getUrl('index'))
                        ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.resources.game-purchases.*'))
                        ->sort(5),
                    NavigationItem::make('Payments')
                        ->icon(Heroicon::OutlinedCreditCard)
                        ->url(fn (): string => PaymentResource::getUrl('index'))
                        ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.resources.payments.*'))
                        ->sort(6),
                    NavigationItem::make('Run Level Income')
                        ->icon(Heroicon::OutlinedCurrencyRupee)
                        ->url(fn (): string => RunLevelIncome::getUrl())
                        ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.pages.run-level-income'))
                        ->sort(7),
                    NavigationItem::make('Level Incomes')
                        ->icon(Heroicon::OutlinedChartBar)
                        ->url(fn (): string => LevelIncomeResource::getUrl('index'))
                        ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.resources.level-incomes.*'))
                        ->sort(8),
                    NavigationItem::make('Support Tickets')
                        ->icon(Heroicon::OutlinedChatBubbleLeftRight)
                        ->url(fn (): string => SupportTicketResource::getUrl('index'))
                        ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.resources.support-tickets.*'))
                        ->sort(9),
                    NavigationItem::make('Project Inquiries')
                        ->icon(Heroicon::OutlinedRectangleStack)
                        ->url(fn (): string => InquiryResource::getUrl('index'))
                        ->isActiveWhen(fn (): bool => request()->routeIs('filament.admin.resources.inquiries.*'))
                        ->sort(10),
                ]);
            })
            ->renderHook(
                PanelsRenderHook::HEAD_END,
                fn (): HtmlString => new HtmlString(
                    '<link rel="stylesheet" href="'.e(asset('css/filament-premium.css')).'?v=4">'
                    .'<script>try{Object.keys(localStorage).filter(k=>k.toLowerCase().includes("collapsed")||k.toLowerCase().includes("filament")).forEach(k=>localStorage.removeItem(k))}catch(e){}</script>'
                )
            )
            ->renderHook(
                PanelsRenderHook::FOOTER,
                fn (): HtmlString => new HtmlString(
                    '<div style="padding:10px 16px;text-align:center;font-size:12px;color:#94a3b8;">DG AD SPACE Premium Admin • Secure Panel</div>'
                )
            )
            ->resources([
                GameResource::class,
                GameAddonResource::class,
                UserResource::class,
                GamePurchaseResource::class,
                PaymentResource::class,
                LevelIncomeResource::class,
                SupportTicketResource::class,
                InquiryResource::class,
            ])
            ->pages([
                Dashboard::class,
                RunLevelIncome::class,
            ])
            ->widgets([
                AdminStatsOverview::class,
                LatestPaidOrders::class,
                LatestLevelIncomes::class,
                AccountWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
