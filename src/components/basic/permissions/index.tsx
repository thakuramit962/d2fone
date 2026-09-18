import { CameraIcon, LocationIcon, MicrophoneIcon, NotificationIcon, StorageDiskIcon } from "@/components/icons"
import { useTheme } from "@/hooks/use-theme"
import { PermissionKey, PermissionStatus, usePermissions } from "@/hooks/usePermissions"
import { useMemo } from "react"
import { Platform, ScrollView, StyleSheet, Switch, View } from "react-native"
import { SvgProps } from "react-native-svg"
import ThemeText from "../text/ThemeText"

interface RowConfig {
    key: PermissionKey
    title: string
    description: string
    icon: React.FC<SvgProps>
    status: PermissionStatus
    onPress: () => void
}

const PermissionRowItem = ({ config }: { config: RowConfig }) => {
    const theme = useTheme()
    const isGranted = config.status === 'granted'
    const Icon = config.icon

    return (
        <View style={styles.row}>
            <View
                style={[
                    styles.iconWrapper,
                    { backgroundColor: `${isGranted ? theme.success : theme.text.disabled}10` },
                ]}
            >
                <Icon
                    height={28}
                    width={28}
                    color={isGranted ? theme.success : theme.text.disabled}
                    strokeWidth={1.25}
                />
            </View>
            <View style={{ flex: 1 }}>
                <ThemeText content={config.title} fontFamily="MontserratSemiBold" variant="xs" />
                <ThemeText content={config.description} variant="xxs" severity="secondary" />
            </View>
            <View style={styles.switchWrapper}>
                <Switch
                    value={isGranted}
                    // Tapping the switch never toggles state directly — the
                    // OS is the source of truth. `onPress` either opens the
                    // permission prompt or, if it's been permanently
                    // denied, routes to Settings. The switch will flip on
                    // its own once `permissions` updates from that flow.
                    onValueChange={config.onPress}
                    trackColor={{
                        false: Platform.OS === 'android' ? '#d3d3d3' : theme?.text.disabled ?? '#e0e0e0',
                        true: theme?.success ?? '#4cd964',
                    }}
                    thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
                    ios_backgroundColor={theme?.text.disabled ?? '#e0e0e0'}
                    accessibilityRole="switch"
                    accessibilityLabel={config.title}
                    accessibilityState={{ checked: isGranted }}
                />
            </View>
        </View>
    )
}

const Permissions = () => {
    const theme = useTheme()
    const {
        permissions,
        isLoading,
        openSettings,
        requestLocation,
        requestNotifications,
        requestCamera,
        requestMicrophone,
        requestGallery,
    } = usePermissions()

    // One handler per permission key. Each request<X> function already
    // de-dupes concurrent calls internally (see usePermissions), so wiring
    // these straight into onValueChange is safe even under fast repeat taps.
    // 'blocked' means the OS won't show the prompt again — only Settings
    // can change it from there.
    const handlers = useMemo<Record<PermissionKey, () => void>>(
        () => ({
            location: () => {
                if (['blocked', 'granted'].includes(permissions.location)) openSettings()
                else void requestLocation()
            },
            notifications: () => {
                if (['blocked', 'granted'].includes(permissions.notifications)) openSettings()
                else void requestNotifications()
            },
            camera: () => {
                if (['blocked', 'granted'].includes(permissions.camera)) openSettings()
                else void requestCamera()
            },
            microphone: () => {
                if (['blocked', 'granted'].includes(permissions.microphone)) openSettings()
                else void requestMicrophone()
            },
            gallery: () => {
                if (['blocked', 'granted'].includes(permissions.gallery)) openSettings()
                else void requestGallery()
            },
        }),
        [
            permissions,
            openSettings,
            requestLocation,
            requestNotifications,
            requestCamera,
            requestMicrophone,
            requestGallery,
        ],
    )

    const rows: RowConfig[] = useMemo(
        () => [
            {
                key: 'location',
                title: 'Location',
                description: 'Shows nearby results and keeps your address up to date.',
                icon: LocationIcon,
                status: permissions.location,
                onPress: handlers.location,
            },
            {
                key: 'notifications',
                title: 'Notifications',
                description: "Lets you know when there's something that needs your attention.",
                icon: NotificationIcon,
                status: permissions.notifications,
                onPress: handlers.notifications,
            },
            {
                key: 'camera',
                title: 'Camera',
                description: 'Lets you take and attach photos of crop data.',
                icon: CameraIcon,
                status: permissions.camera,
                onPress: handlers.camera,
            },
            {
                key: 'microphone',
                title: 'Microphone',
                description: 'Lets you record audio alongside photos and videos.',
                icon: MicrophoneIcon,
                status: permissions.microphone,
                onPress: handlers.microphone,
            },
            {
                key: 'gallery',
                title: 'Media',
                description: 'Lets you pick existing photos and videos from your library.',
                icon: StorageDiskIcon,
                status: permissions.gallery,
                onPress: handlers.gallery,
            },
        ],
        [permissions, handlers],
    )

    if (isLoading) {
        // Avoid flashing every switch as "off" before the initial OS check
        // resolves. Swap this for a skeleton/shimmer matching your design
        // system if a blank screen reads as broken during the ~1 frame wait.
        return <View style={{ flex: 1, backgroundColor: theme?.background.main }} />
    }

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: theme?.background.main }}>
            {rows.map((config, i) => (
                <View key={config.key}>
                    <PermissionRowItem config={config} />
                    {i !== rows.length - 1 && (
                        <View style={[styles.divider, { borderColor: `${theme.text.primary}25` }]} />
                    )}
                </View>
            ))}
        </ScrollView>
    )
}

export default Permissions

const styles = StyleSheet.create({
    row: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingVertical: 12 },
    iconWrapper: { alignItems: 'center', justifyContent: 'center', height: 48, width: 48, borderRadius: 16 },
    switchWrapper: { alignItems: 'center', width: 56, alignSelf: 'flex-start' },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth },
})