<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Free UPI Payment (WordPress-style manual UPI)
    |--------------------------------------------------------------------------
    |
    | No paid gateway needed. Customer pays to your UPI ID / QR, then submits
    | UTR. Admin verifies payment in the panel.
    |
    */

    'id' => env('UPI_ID', 'dgadspace@upi'),

    'name' => env('UPI_NAME', 'DG Ad Space'),

    // Optional custom QR image in public/ (leave empty to auto-generate from UPI link)
    'qr_image' => env('UPI_QR_IMAGE', ''),

    'note' => env('UPI_NOTE', 'Pay the exact amount and enter UTR / Transaction ID.'),

];
