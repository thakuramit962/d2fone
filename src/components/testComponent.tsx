import { usePermissions } from '@/hooks/usePermissions'
import { Text, View } from 'react-native'
import ActionText from './basic/text/ActionText'

const TestComponent = () => {

    const {
        hasRequiredPermissions,
        isLoading,
        openSettings,
        permissions,
        refreshPermissions,
        requestCamera,
        requestGallery,
        requestLocation,
        requestMicrophone,
        requestNotifications,
        requestPermission,
        syncPushTokenToServer
    } = usePermissions()
    return (
        <View>
            <ActionText label='syncPushTokenToServer' action={syncPushTokenToServer} />
            <ActionText label='requestCamera' action={requestCamera} />
            <ActionText label='requestGallery' action={requestGallery} />
            <ActionText label='requestLocation' action={requestLocation} />
            <ActionText label='requestMicrophone' action={requestMicrophone} />
            <ActionText label='requestNotifications' action={requestNotifications} />
            <ActionText label='requestPermission' action={() => requestPermission('notifications')} />
            <ActionText label='openSettings' action={openSettings} />
            <ActionText label='refreshPermissions' action={refreshPermissions} />
            <Text>{isLoading ? 'Loading' : 'No'}</Text>
            <Text>{permissions.location}</Text>
            <Text>{permissions.notifications}</Text>
            <Text>{permissions.gallery}</Text>
            <Text>{permissions.microphone}</Text>
            <Text>{permissions.camera}</Text>
        </View>
    )
}

export default TestComponent