import { useEffect, useState } from "react";
import PermissionsLayout from "./permissionLayout";
import { getPermissionsAsync, PermissionResponse, requestPermissionsAsync } from "expo-contacts";

export default function ContactsPermission() {

    const [permission, setPermission] = useState<PermissionResponse| undefined>(undefined);

    const requestPermission = ()=>{
        requestPermissionsAsync()
        .then((result)=>{
            setPermission(result);
        }
        )
    }
    // verifiar el estatus del permiso de contactos
    useEffect(()=>{
        getPermissionsAsync()
        .then((result)=>{
            setPermission(result);
        })
    }
    ,[]);
    return(
        <PermissionsLayout
            icon="people-sharp"
            title="Contacts"
            granted={permission?.granted || false} 
            requestPermission={requestPermission}
        />
    )
}   