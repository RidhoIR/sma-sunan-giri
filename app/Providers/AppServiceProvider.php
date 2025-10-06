<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        App::setLocale('id');
        Carbon::setLocale('id');

        Inertia::share('notifications', function () {
            $user = auth()->user();
            if (!$user) return [];
            return $user->notifications->map(fn($n) => [
                'id' => $n->id,
                'title' => $n->data['title'],
                'description' => $n->data['message'],
                'time' => $n->created_at->diffForHumans(),
                'read' => $n->read_at !== null,
                'url' => $n->data['url'],
            ]);
        });
    }
}
