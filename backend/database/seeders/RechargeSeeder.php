<?php

namespace Database\Seeders;

use App\Models\Recharge;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class RechargeSeeder extends Seeder
{
    public function run(): void
    {
        $operators = ['Airtel', 'Jio', 'Vi', 'BSNL'];
        $statuses = ['success', 'success', 'success', 'failed', 'pending'];
        $retailers = [101, 102, 103, 104];

        for ($i = 0; $i < 50; $i++) {
            Recharge::create([
                'retailer_id' => $retailers[array_rand($retailers)],
                'mobile_number' => '98' . rand(10000000, 99999999),
                'operator' => $operators[array_rand($operators)],
                'amount' => rand(1, 10) * 100 + 99,
                'status' => $statuses[array_rand($statuses)],
                'created_at' => Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
            ]);
        }
    }
}