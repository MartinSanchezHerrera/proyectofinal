import { useMicrophonePermissions } from "expo-camera";
import PermissionsLayout from "./permissionLayout"


export default function MicrophonePermission() {

     const [permission, requestPermission] = useMicrophonePermissions();

    return(
        <PermissionsLayout
            icon="mic"
            title="Microphone"
            granted={permission?.granted || false} 
            requestPermission={requestPermission}
        />
    )
}