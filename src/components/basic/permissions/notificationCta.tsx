import AsyncStorage from '@react-native-async-storage/async-storage'
import LottieView from 'lottie-react-native'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import BottomSheet from '../bottomSheet'
import ActionText from '../text/ActionText'
import ThemeText from '../text/ThemeText'
import ThemeButton from '../ThemeButton'
import ThemeDivider from '../ThemeDivider'

import illus from '@/assets/lottie/notification-bell.json'
import API from '@/constants/api'
import { registerForPushNotificationsAsync } from '@/hooks/usePushNotifications'
import { useToast } from '@/hooks/useToast'
import { getAsyncStorageData, setAsyncStorageData } from '@/utils/app-helper'
import { deviceName } from 'expo-device'

const FCM_TOKEN_KEY = 'fcmToken'
const MAX_SHEET_HEIGHT = 540
const SHEET_HEIGHT_RATIO = 0.7

/**
 * checking → reading persisted token (sheet stays hidden, avoids a flash)
 * idle     → no token, ready to prompt
 * loading  → registration request in flight
 * enabled  → token registered
 */
type OptInStatus = 'checking' | 'idle' | 'loading' | 'enabled'

function useNotificationOptIn() {
    const { t } = useTranslation()
    const { showToast } = useToast()
    const [status, setStatus] = useState<OptInStatus>('checking')
    const inFlightRef = useRef(false)

    // Hydrate from storage once.
    useEffect(() => {
        let cancelled = false
        getAsyncStorageData(FCM_TOKEN_KEY)
            .then((stored) => {
                if (!cancelled) setStatus(stored ? 'enabled' : 'idle')
            })
            .catch(() => {
                if (!cancelled) setStatus('idle')
            })
        return () => {
            cancelled = true
        }
    }, [])

    const enable = useCallback(async () => {
        // Synchronous guard: state updates are async, so a fast double tap could slip through.
        if (inFlightRef.current) return
        inFlightRef.current = true
        setStatus('loading')
        let stage = 'register'

        try {
            const token = await registerForPushNotificationsAsync()

            if (!token) {
                showToast("Notification Denied", "Notification access was denied.", 'error')
                setStatus('idle')
                return
            }

            stage = 'api'
            await API.post('/save-fcm-token', {
                device_token: token,
                device_type: Platform.OS,
                deviceName: deviceName,
                deviceId: deviceName
            })
            stage = 'storage'
            await setAsyncStorageData(FCM_TOKEN_KEY, token)

            showToast("Notification Enabled", "You will now receive notifications.", 'success')
            setStatus('enabled')
        } catch (error) {
            if (__DEV__) console.error('[NotificationCta] registration failed:', error)
            // Don't keep a token the server never acknowledged.
            AsyncStorage.removeItem(FCM_TOKEN_KEY).catch(() => { })
            showToast("Notification Error", "Failed to enable notifications.", 'error')
            setStatus('idle')
        } finally {
            inFlightRef.current = false
        }
    }, [showToast, t])

    return { status, enable }
}

const NotificationCta = memo(function NotificationCta() {
    const { t } = useTranslation()
    const { height: windowHeight } = useWindowDimensions()
    const { status, enable } = useNotificationOptIn()
    const [dismissed, setDismissed] = useState(false)

    const isLoading = status === 'loading'
    const visible = !dismissed && (status === 'idle' || isLoading)

    const sheetHeight = useMemo(
        () => Math.min(Math.round(windowHeight * SHEET_HEIGHT_RATIO), MAX_SHEET_HEIGHT),
        [windowHeight],
    )

    const handleClose = useCallback(() => setDismissed(true), [])
    const handleMaybeLater = useCallback(() => {
        if (!isLoading) setDismissed(true)
    }, [isLoading])

    const a11yLabel = useMemo(
        () => `${t('notificationCta.title')}. ${t('notificationCta.description')}`,
        [t],
    )

    return (
        <BottomSheet height={sheetHeight} visible={visible} onClose={handleClose}>
            <View style={styles.container} testID="notification-cta">
                <View style={styles.lottieWrapper}>
                    {/* Mounted only while visible so the animation replays on every presentation. */}
                    {visible ? (
                        <LottieView
                            source={illus}
                            speed={1.2}
                            autoPlay
                            loop={false}
                            style={styles.lottie}
                            resizeMode="contain"
                        />
                    ) : null}
                </View>

                <View style={styles.textContent} accessible accessibilityRole="header" accessibilityLabel={a11yLabel}>
                    <ThemeText
                        content={t('notificationCta.title')}
                        fontFamily="MontserratBold"
                        variant="lg"
                        style={styles.title}
                    />
                    <ThemeText
                        severity="secondary"
                        content={t('notificationCta.description')}
                        variant="sm"
                        style={styles.description}
                    />
                </View>

                <ThemeDivider size={32} />

                <ThemeButton
                    label={t('notificationCta.allow')}
                    variant="md"
                    onPress={enable}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.primaryButton}
                />

                <ThemeDivider size={16} />

                <ActionText
                    label={t('notificationCta.maybeLater')}
                    action={handleMaybeLater}
                    severity="main"
                    withIcon={false}
                />
            </View>
        </BottomSheet>
    )
})

const styles = StyleSheet.create({
    container: { alignItems: 'center', flex: 1, paddingHorizontal: 24, paddingBottom: 24 },
    lottieWrapper: { alignItems: 'center', height: 212, justifyContent: 'center', paddingVertical: 16 },
    lottie: { height: 180, width: 180 },
    textContent: { alignItems: 'center', gap: 8 },
    title: { textAlign: 'center' },
    description: { textAlign: 'center', lineHeight: 20, opacity: 0.8 },
    primaryButton: { maxWidth: 280, width: '100%' },
})

export default NotificationCta