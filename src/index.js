import '@capacitor/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';




export function Capacitor() {
    return {
        "Camera" : Camera,
        "CameraResultType" : CameraResultType,
        "LocalNotifications": LocalNotifications,
        "Preferences": Preferences,
    }
}