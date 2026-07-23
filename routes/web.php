<?php

use App\Http\Controllers\Auth\MemberAuthController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\MemberDashboardController;
use App\Http\Controllers\ProfileController;
use App\Models\Game;
use App\Models\GameAddon;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/gi/{token}', [MediaController::class, 'gameImage'])
    ->where('token', '[A-Za-z0-9]+')
    ->name('game.image');

Route::get('/', function () {
    $featuredGame = Game::query()
        ->where('is_active', true)
        ->where(function ($query) {
            $query->where('name', 'Ludo Game')
                ->orWhere('name', 'like', '%Ludo%')
                ->orWhere('slug', 'like', '%ludo%');
        })
        ->orderBy('sort_order')
        ->first();

    return Inertia::render('Welcome', [
        'featuredGame' => $featuredGame?->toStoreArray(),
    ]);
});

Route::get('/services', function () {
    $addons = GameAddon::query()
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->orderBy('name')
        ->get()
        ->map(fn (GameAddon $addon) => $addon->toStoreArray())
        ->values();

    return Inertia::render('Services', [
        'addons' => $addons,
    ]);
})->name('services');

Route::get('/game-store', function () {
    $games = Game::query()
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->orderBy('name')
        ->get()
        ->map(fn (Game $game) => $game->toStoreArray())
        ->values();

    return Inertia::render('GameStore', [
        'games' => $games,
    ]);
})->name('game-store');

Route::get('/game-store/{game:slug}', function (Game $game) {
    abort_unless($game->is_active, 404);

    $addons = GameAddon::query()
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->orderBy('name')
        ->get()
        ->map(fn (GameAddon $addon) => $addon->toStoreArray())
        ->values();

    $related = Game::query()
        ->where('is_active', true)
        ->where('id', '!=', $game->id)
        ->orderBy('sort_order')
        ->limit(4)
        ->get()
        ->map(fn (Game $item) => $item->toStoreArray())
        ->values();

    return Inertia::render('GameProduct', [
        'game' => $game->toStoreArray(),
        'addons' => $addons,
        'related' => $related,
    ]);
})->name('game-store.show');

Route::post('/inquiries', [InquiryController::class, 'store'])->name('inquiries.store');

Route::middleware('guest')->group(function () {
    Route::get('/login', [MemberAuthController::class, 'showLogin'])->name('login');
    Route::post('/login/otp', [MemberAuthController::class, 'sendOtp'])->name('login.otp.send');
    Route::post('/login/verify', [MemberAuthController::class, 'verifyOtp'])->name('login.otp.verify');

    Route::get('/register', [MemberAuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [MemberAuthController::class, 'register']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [MemberDashboardController::class, 'index'])->name('dashboard');
    Route::get('/member', [MemberDashboardController::class, 'index'])->name('member.dashboard');
    Route::get('/member/purchases', [MemberDashboardController::class, 'purchases'])->name('member.purchases');
    Route::get('/member/payments', [MemberDashboardController::class, 'payments'])->name('member.payments');
    Route::get('/member/incomes', [MemberDashboardController::class, 'incomes'])->name('member.incomes');
    Route::get('/member/tickets', [MemberDashboardController::class, 'tickets'])->name('member.tickets');
    Route::post('/member/tickets', [MemberDashboardController::class, 'storeTicket'])->name('member.tickets.store');
    Route::get('/member/tickets/{ticket}', [MemberDashboardController::class, 'showTicket'])->name('member.tickets.show');
    Route::post('/member/tickets/{ticket}/reply', [MemberDashboardController::class, 'replyTicket'])->name('member.tickets.reply');
    Route::post('/member/buy-game', [MemberDashboardController::class, 'buyGame'])->name('member.buy-game');
    Route::get('/member/pay/{purchase}', [MemberDashboardController::class, 'showPay'])->name('member.pay');
    Route::post('/member/pay/{purchase}/razorpay', [MemberDashboardController::class, 'verifyRazorpay'])->name('member.pay.razorpay');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
