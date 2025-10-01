<?php

namespace App\Services\GlobalDataServices;

use App\Enums\CollectionStatusEnum;
use App\Repositories\All\User\UserInterface;
use App\Repositories\Eloquent\Catalog\CollectionRepository;

class GlobalDataService
{
    public function __construct(
        protected UserInterface $userInterface,
    ) {}

    /**
     * Method getFooterCategoryCollection
     *
     * @return void
     */
    // public function getFooterCategoryCollection()
    // {
    //     $array = session()->get('footer-category-collection');
    //     if (!$array) {
    //         $collectionRepository = app()->make(CollectionRepository::class);
    //         $collection = $collectionRepository->findByColumn(['slug' => 'footer-collection', 'status' => CollectionStatusEnum::Active->value]);
    //         if ($collection) {
    //             foreach ($collection->categories as $key => $category) {
    //                 $array[$key]['name'] = $category->name;
    //                 $array[$key]['slug'] = $category->slug;
    //             }
    //         }

    //         session()->put('footer-category-collection', $array);
    //     }
    //     return $array;
    // }

    public function getNotificationData()
    {
        $user = auth()->user();
        if (! $user) {
            return [];
        }

        $notifications = $user->notifications;
        $unreadNotifications = $user->unreadNotifications;
        $unreadNotificationsCount = $unreadNotifications->count();
        $notificationsCount = $notifications->count();
        $notificationData = [
            'notifications' => $notifications,
            'unreadNotifications' => $unreadNotifications,
            'unreadNotificationsCount' => $unreadNotificationsCount,
            'notificationsCount' => $notificationsCount,
        ];

        // dd($notificationData);
        return $notificationData;
    }

    // delete notifications
    public function deleteNotification($notificationId)
    {
        $user = auth()->user();
        if (! $user) {
            return [];
        }
        $notifications = $user->notifications;
        $notification = $notifications->where('id', $notificationId)->first();
        if ($notification) {
            $notification->delete();
        }

    }

    public function getUserCount()
    {
        $userCount = $this->userInterface->all()->count();

        return $userCount;
    }
}
