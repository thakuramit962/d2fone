import { PermissionStatus } from '@/hooks/usePermissions'
import LottieView from 'lottie-react-native'
import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import BottomSheet from '../bottomSheet'
import ActionText from '../text/ActionText'
import ThemeText from '../text/ThemeText'
import ThemeButton from '../ThemeButton'
import ThemeDivider from '../ThemeDivider'

import illus from '@/assets/lottie/notification-bell.json'
import { usePermissions } from '@/hooks/usePermissions'

const NotificationCta = memo(() => {
    const { t } = useTranslation()
    const {
        isLoading,
        openSettings,
        permissions,
        requestNotifications,
    } = usePermissions()
    const status = permissions.notifications as PermissionStatus

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Wait for the initial permission check to resolve before deciding
        // whether to show the sheet — otherwise every launch briefly shows
        // it while `status` is still 'undetermined'.
        if (isLoading) return

        setIsVisible(status !== 'granted')
    }, [status, isLoading])

    const handleClose = useCallback(() => {
        setIsVisible(false)
    }, [])

    const handleRequestPermission = useCallback(async () => {
        try {
            if (status === 'blocked') {
                // Permanently denied — the OS won't show the prompt again,
                // only Settings can change it.
                openSettings()
            } else {
                await requestNotifications()
            }
            setIsVisible(false)
        } catch (error) {
            console.warn('[NotificationCta] Permission request failed:', error)
        }
    }, [status, openSettings, requestNotifications])

    return (
        <BottomSheet height={540} visible={isVisible} onClose={handleClose}>
            <View style={styles.container}>
                <View style={styles.lottieWrapper}>
                    <LottieView source={illus} speed={1.2} autoPlay loop={false} style={styles.lottie} resizeMode="contain" />
                </View>

                <View style={styles.textContent}>
                    <ThemeText content={t('notificationCta.title')} fontFamily="MontserratBold" variant="lg" style={styles.title} />
                    <ThemeText severity="secondary" content={t('notificationCta.description')} variant="sm" style={styles.description} />
                </View>

                <ThemeDivider size={32} />

                <ThemeButton label={t('notificationCta.allow')} variant="md" onPress={handleRequestPermission} style={styles.primaryButton} />

                <ThemeDivider size={16} />

                <ActionText label={t('notificationCta.maybeLater')} action={handleClose} severity="main" withIcon={false} />
            </View>
        </BottomSheet>
    )
})

const styles = StyleSheet.create({
    container: { alignItems: 'center', flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
    lottieWrapper: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
    lottie: { height: 180, width: 180 },
    textContent: { alignItems: 'center', gap: 8 },
    title: { textAlign: 'center' },
    description: { textAlign: 'center', lineHeight: 20, opacity: 0.8 },
    primaryButton: { width: '100%', maxWidth: 280 },
})

NotificationCta.displayName = 'NotificationCta'
export default NotificationCta