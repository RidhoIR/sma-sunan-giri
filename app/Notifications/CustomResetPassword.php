<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;

class CustomResetPassword extends Notification implements ShouldQueue
{
    use Queueable;

    public string $token;

    public function __construct(string $token)
    {
        $this->token = $token;
        // Optional: set queue connection / name if perlu
        // $this->connection = 'database';
        // $this->queue = 'default';
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Reset Kata Sandi Kamu')
            ->greeting('Halo ' . ($notifiable->name ?? 'Pengguna') . ',')
            ->line('Kamu menerima email ini karena ada permintaan reset kata sandi untuk akunmu.')
            ->action(
                'Reset Kata Sandi',
                url(route('password.reset', ['token' => $this->token], false) . '?email=' . urlencode($notifiable->getEmailForPasswordReset()))
            )
            ->line('Link ini akan kadaluarsa dalam ' . config('auth.passwords.users.expire') . ' menit.')
            ->line('Jika kamu tidak meminta reset, abaikan saja email ini.');
    }
}
