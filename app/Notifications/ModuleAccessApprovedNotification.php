<?php

namespace App\Notifications;

use App\Models\Module;
use App\Models\ModuleAccessRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ModuleAccessApprovedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Module $module,
        public ModuleAccessRequest $accessRequest,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'kind' => 'module_access_approved',
            'module_id' => $this->module->id,
            'module_title' => $this->module->title,
            'request_id' => $this->accessRequest->id,
            'access_code' => $this->accessRequest->access_code,
            'message' => 'Your access request for “' . $this->module->title . '” was approved. Your access code is ' . $this->accessRequest->access_code . '.',
        ];
    }

}
