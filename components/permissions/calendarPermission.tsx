import { getCalendarPermissionsAsync, PermissionResponse, requestCalendarPermissionsAsync } from "expo-calendar";
import PermissionsLayout from "./permissionLayout";
import { useEffect, useState } from "react";

export default function CalendarPermission() {

    const [permission, setPermission] = useState<PermissionResponse| undefined>(undefined);
    
        const requestPermission = ()=>{
            requestCalendarPermissionsAsync()
            .then((result)=>{
                setPermission(result);
            }
            )
        }
        // verifiar el estatus del permiso de contactos
        useEffect(()=>{
            getCalendarPermissionsAsync()
            .then((result)=>{
                setPermission(result);
            })
        }
        ,[]);

    return(
        <PermissionsLayout
            icon="calendar"
            title="Calendar"
            granted={permission?.granted || false} 
            requestPermission={requestPermission}
        />
    )
}     