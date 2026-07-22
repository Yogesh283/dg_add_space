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
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Throwable;

class AdminStatsOverview extends StatsOverviewWidget
{
    protected static bool $isLazy = false;

    protected static ?int $sort = 1;

    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        try {
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
        } catch (Throwable) {
            return [
                Stat::make('Dashboard Stats', 'Unavailable')
                    ->description('Check database / migrations on server')
                    ->color('danger'),
            ];
        }

        $inr = fn (float $n): string => '₹'.number_format($n, 2);

        $usersUrl = UserResource::getUrl('index');
        $ordersUrl = GamePurchaseResource::getUrl('index');
        $incomesUrl = LevelIncomeResource::getUrl('index');
        $ticketsUrl = SupportTicketResource::getUrl('index');

        return [
            Stat::make('Product Buyers', (string) $productBuyers)
                ->description('Users who bought — click list')
                ->color('success')
                ->url($usersUrl.'?tableFilters[bought_product][isActive]=true'),

            Stat::make('Paid Orders', (string) $paidOrders)
                ->description($pendingOrders.' pending payment')
                ->color('primary')
                ->url($ordersUrl.'?tableFilters[status][value]=paid'),

            Stat::make('Deposit Today', $inr($depositToday))
                ->description('Total deposit: '.$inr($depositTotal))
                ->color('warning')
                ->url($ordersUrl.'?tableFilters[status][value]=paid&tableFilters[today][isActive]=true'),

            Stat::make('Level Income Today', $inr($incomeToday))
                ->description('Total level income: '.$inr($incomeTotal))
                ->color('danger')
                ->url($incomesUrl.'?tableFilters[today][isActive]=true'),

            Stat::make('Total Level Income', $inr($incomeTotal))
                ->description('All credited upline income')
                ->color('danger')
                ->url($incomesUrl),

            Stat::make('Members', (string) $members)
                ->description($membersToday.' registered today')
                ->color('info')
                ->url($usersUrl),

            Stat::make('Wallet Balance', $inr($walletTotal))
                ->description('All members wallet total')
                ->color('gray')
                ->url($usersUrl),

            Stat::make('Successful Payments', $inr($paymentsSuccess))
                ->description('Gateway + company payments')
                ->color('success')
                ->url($ordersUrl.'?tableFilters[status][value]=paid'),

            Stat::make('Open Tickets', (string) $openTickets)
                ->description('Open + answered support')
                ->color('warning')
                ->url($ticketsUrl),
        ];
    }
}
