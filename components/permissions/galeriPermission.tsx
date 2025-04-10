import PermissionsLayout from "./permissionLayout";
import * as MediaLibrary from 'expo-media-library';



export default function GaleriPermissions() {

    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    return(
        <PermissionsLayout
            icon="image"
            title="Galeri"
            granted={permissionResponse?.granted || false} 
            requestPermission={requestPermission}
        />
    )
}