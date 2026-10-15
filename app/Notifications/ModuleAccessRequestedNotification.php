<?php

namespace App\Notifications;

use App\Models\Module;
use App\Models\ModuleAccessRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ModuleAccessRequestedNotification extends Notification
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
            'kind' => 'module_access_requested',
            'module_id' => $this->module->id,
            'module_title' => $this->module->title,
            'request_id' => $this->accessRequest->id,
            'student_name' => $this->accessRequest->student?->name,
            'message' => ($this->accessRequest->student?->name ?? 'A student') . ' requested access to “' . $this->module->title . '”.',
        ];
    }

}
