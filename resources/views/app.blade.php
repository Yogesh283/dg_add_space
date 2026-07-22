<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>DG AD SPACE</title>

        <link rel="icon" type="image/png" href="{{ asset('img/app.icon.png') }}">
        <link rel="shortcut icon" type="image/png" href="{{ asset('img/app.icon.png') }}">
        <link rel="apple-touch-icon" href="{{ asset('img/app.icon.png') }}">

        <meta name="robots" content="index,follow" />
        <meta name="application-name" content="DG AD SPACE" />

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-[#0a0a0a] text-neutral-100">
        @inertia
    </body>
</html>
