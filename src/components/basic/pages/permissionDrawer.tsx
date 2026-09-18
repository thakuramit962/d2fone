/**
 * PermissionDrawer — an animated bottom sheet for onboarding permissions.
 */

import { useTheme } from '@/hooks/use-theme';
import * as Location from 'expo-location';
// import * as Notifications from 'expo-notifications';
import { updateAppState } from '@/slices/appSlice';
import { dimensions } from '@/utils/app-helper';
import { router } from 'expo-router';
import { Suspense, memo, useCallback, useEffect, useRef } from 'react';
import {
    Alert,
    Animated,
    Easing,
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    View
} from 'react-native';
import { useDispatch } from 'react-redux';
import Permissions from '../permissions';
import Skelton from '../Skelton';
import ThemeText from '../text/ThemeText';

type PermissionDrawerProps = {
    visible: boolean;
    callback?: () => void;
};

const ANIMATION_CONFIG = {
    show: {
        opacity: { duration: 250 },
        slide: { duration: 300, easing: Easing.out(Easing.exp) },
    },
    hide: {
        opacity: { duration: 200 },
        slide: { duration: 200, easing: Easing.in(Easing.circle) },
    },
} as const;

function PermissionDrawer({ visible, callback }: PermissionDrawerProps) {
    const theme = useTheme();
    const dispatch = useDispatch();

    const opacityAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(300)).current; // Clean baseline offset
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        animationRef.current?.stop();

        const cfg = visible ? ANIMATION_CONFIG.show : ANIMATION_CONFIG.hide;
        const targetOpacity = visible ? 1 : 0;
        const targetTranslateY = visible ? 0 : 400;

        animationRef.current = Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: targetOpacity,
                duration: cfg.opacity.duration,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: targetTranslateY,
                duration: cfg.slide.duration,
                easing: cfg.slide.easing,
                useNativeDriver: true,
            }),
        ]);

        animationRef.current.start();

        return () => {
            animationRef.current?.stop();
        };
    }, [visible, opacityAnim, translateYAnim]);

    const handleOnboarding = useCallback(async () => {
        const { status: locationResult } = await Location.getForegroundPermissionsAsync();
        // const { status: notificationsResult } = await Notifications.getPermissionsAsync();

        const locationGranted = locationResult === 'granted';
        const notificationsGranted = true// notificationsResult === 'granted';

        // Production checklist variant check
        if (locationGranted && notificationsGranted) {
            dispatch(updateAppState({ hasOnboarded: true }));
            router.replace('/(auth)/login');
        } else {
            Alert.alert(
                'Core Permissions Required',
                'Location and notification permissions are essential to leverage our core app operations. Please update native access.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Open Settings',
                        onPress: () => Linking.openSettings(),
                    },
                ],
            );
        }
    }, [dispatch]);

    return (
        <Animated.View
            pointerEvents={visible ? 'auto' : 'none'}
            style={[StyleSheet.absoluteFill, styles.overlay, { opacity: opacityAnim }]}
        >
            <Pressable
                style={styles.backdrop}
                onPress={callback}
                accessibilityLabel="Close permissions drawer"
                accessibilityRole="button"
            />

            <Animated.View
                style={[
                    styles.sheet,
                    { transform: [{ translateY: translateYAnim }] },
                ]}
            >
                <View
                    style={[
                        styles.handle,
                        { backgroundColor: `${theme?.text?.disabled ?? '#aaa'}60` },
                    ]}
                />

                <View style={styles.content}>
                    <Suspense fallback={<Skelton dimensions={{ height: 72 }} />}>
                        <Permissions />
                    </Suspense>

                    <View style={styles.ctaWrapper}>
                        <Pressable
                            onPress={handleOnboarding}
                            style={styles.ctaButton}
                            accessibilityRole="button"
                            accessibilityLabel="Get Started"
                        >
                            <ThemeText
                                content="Continue to App"
                                fontFamily="MontserratBold"
                                size={18}
                                color="#ffffff"
                                style={styles.ctaText}
                            />
                        </Pressable>
                    </View>
                </View>
            </Animated.View>
        </Animated.View>
    );
}

export default memo(PermissionDrawer);

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dim background layer natively
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
    },
    sheet: {
        backgroundColor: '#fffffff6',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        alignItems: 'center',
        width: '100%',
        height: dimensions.height - 94,
        paddingBottom: Platform.OS === 'ios' ? 0 : 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    handle: {
        height: 4,
        width: 60,
        borderRadius: 2,
        marginTop: 12,
        marginBottom: 24,
    },
    content: {
        width: '100%',
        paddingTop: 72,
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        alignContent: 'stretch',
        alignItems: 'stretch',
        gap: 20,
    },
    ctaWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 72,
    },
    ctaButton: {
        backgroundColor: '#141414',
        borderRadius: 16,
        width: '100%',
        maxWidth: 300,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctaText: {
        fontSize: 18,
    },
});