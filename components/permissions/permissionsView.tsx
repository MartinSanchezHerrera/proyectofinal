import { StyleSheet, Text, View } from "react-native";
import CameraPermissions from "./cmaeraPermission";
import GaleriPermissions from "./galeriPermission";
import MicrophonePermission from "./microphonePermission";
import GpsPermission from "./gpsPermission";
import ContactsPermission from "./contactsPermission";
import CalendarPermission from "./calendarPermission";

export default function PermissionsView() {
  
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Permissions</Text>
            <View>
                <CameraPermissions />
                <GaleriPermissions /> 
                <MicrophonePermission />
                <GpsPermission />
                <ContactsPermission />
                <CalendarPermission />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'black',
        marginVertical: 20,
        marginHorizontal: 10,
        
        
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        color:'white',
    },
})