<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class GeoIpService
{
    /**
     * @return array{country: ?string, country_code: ?string}
     */
    public function resolve(Request $request, ?string $ip = null): array
    {
        $ip = $ip ?: $request->ip();

        $cfCode = strtoupper((string) $request->header('CF-IPCountry', ''));
        if ($cfCode !== '' && $cfCode !== 'XX' && $cfCode !== 'T1') {
            return [
                'country' => $this->countryNameFromCode($cfCode) ?? $cfCode,
                'country_code' => $cfCode,
            ];
        }

        if (! $ip || $this->isPrivateIp($ip)) {
            return ['country' => null, 'country_code' => null];
        }

        try {
            $response = Http::timeout(2)
                ->get("http://ip-api.com/json/{$ip}", [
                    'fields' => 'status,country,countryCode',
                ]);

            if ($response->successful() && $response->json('status') === 'success') {
                $code = strtoupper((string) $response->json('countryCode'));

                return [
                    'country' => $response->json('country') ?: null,
                    'country_code' => $code !== '' ? $code : null,
                ];
            }
        } catch (Throwable $e) {
            Log::warning('GeoIP lookup failed', [
                'ip' => $ip,
                'error' => $e->getMessage(),
            ]);
        }

        return ['country' => null, 'country_code' => null];
    }

    private function isPrivateIp(string $ip): bool
    {
        return filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) === false;
    }

    private function countryNameFromCode(string $code): ?string
    {
        $names = [
            'IN' => 'India',
            'US' => 'United States',
            'GB' => 'United Kingdom',
            'AE' => 'United Arab Emirates',
            'SA' => 'Saudi Arabia',
            'PK' => 'Pakistan',
            'BD' => 'Bangladesh',
            'NP' => 'Nepal',
            'LK' => 'Sri Lanka',
            'CA' => 'Canada',
            'AU' => 'Australia',
            'DE' => 'Germany',
            'FR' => 'France',
            'SG' => 'Singapore',
            'MY' => 'Malaysia',
            'ID' => 'Indonesia',
            'PH' => 'Philippines',
            'TH' => 'Thailand',
            'VN' => 'Vietnam',
            'JP' => 'Japan',
            'KR' => 'South Korea',
            'CN' => 'China',
            'BR' => 'Brazil',
            'ZA' => 'South Africa',
            'NG' => 'Nigeria',
            'EG' => 'Egypt',
            'TR' => 'Turkey',
            'RU' => 'Russia',
            'NL' => 'Netherlands',
            'IT' => 'Italy',
            'ES' => 'Spain',
        ];

        return $names[$code] ?? null;
    }
}
