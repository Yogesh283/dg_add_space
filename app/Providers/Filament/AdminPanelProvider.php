<?php

namespace App\Providers\Filament;

use App\Filament\Widgets\AdminStatsOverview;
use App\Filament\Widgets\LatestLevelIncomes;
use App\Filament\Widgets\LatestPaidOrders;
use Filament\Enums\ThemeMode;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Enums\Width;
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
            ->renderHook(
                PanelsRenderHook::HEAD_END,
                fn (): HtmlString => new HtmlString(
                    '<link rel="stylesheet" href="'.e(asset('css/filament-premium.css')).'?v=1">'
                )
            )
            ->renderHook(
                PanelsRenderHook::FOOTER,
                fn (): HtmlString => new HtmlString(
                    '<div style="padding:10px 16px;text-align:center;font-size:12px;color:#94a3b8;">DG AD SPACE Premium Admin • Secure Panel</div>'
                )
            )
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
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
