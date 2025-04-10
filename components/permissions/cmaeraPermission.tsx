import { useCameraPermissions } from "expo-camera";
import PermissionsLayout from "./permissionLayout";


export default function CameraPermissions() {

    const [permission, requestPermission] = useCameraPermissions();

    return(
        <PermissionsLayout
            icon="camera"
            title="Camera"
            granted={permission?.granted || false} 
            requestPermission={requestPermission}
        />
    )
}