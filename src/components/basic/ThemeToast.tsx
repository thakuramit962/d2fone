import { useEffect } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { SHEET_ZINDEX } from '@/constants/appConstant';
import { useTheme } from '@/hooks/use-theme';
import { useGlobalStyle } from '@/hooks/useGlobalStyle';
import { updateToast } from '@/slices/toast-slice';
import { RootState } from '@/store/store';
import { dimensions } from '@/utils/app-helper';
import { DoneIcon, InfoIcon, WarningIcon } from '../icons';
import ThemeText from './text/ThemeText';

export interface ThemeToastProps {
    title: string;
    message?: string;
    severity?: 'success' | 'error' | 'warning' | 'info' | 'normal';
    key?: any
}

const ThemeToast = () => {
    const toast = useSelector((state: RootState) => state.toast);
    const dispatch = useDispatch();
    const theme = useTheme();
    const globalStyle = useGlobalStyle();
    const { top } = useSafeAreaInsets();

    const animatedTranslateY = useSharedValue(-50);
    const animatedOpacity = useSharedValue(0);

    useEffect(() => {
        if (toast?.title) {
            animatedTranslateY.value = withSpring(4);
            animatedOpacity.value = withSpring(1);

            const timeoutId = setTimeout(() => {
                animatedTranslateY.value = withSpring(-50);
                animatedOpacity.value = withSpring(0);
                setTimeout(() => {
                    dispatch(updateToast({ title: '' }));
                }, 500); // Wait for animation to finish before clearing
            }, 3000);

            return () => clearTimeout(timeoutId);
        }
    }, [toast.title, dispatch, top, animatedTranslateY, animatedOpacity]);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: animatedTranslateY.value }],
        opacity: animatedOpacity.value,
    }));

    const getColorAndIcon = (severity: ThemeToastProps['severity']) => {
        switch (severity) {
            case 'success':
                return { color: theme?.success, Icon: DoneIcon };
            case 'info':
                return { color: theme?.info, Icon: InfoIcon };
            case 'warning':
            case 'error':
                return { color: severity === 'error' ? theme?.error : theme?.warning, Icon: WarningIcon };
            default:
                return { color: theme?.text.disabled, Icon: InfoIcon };
        }
    };

    const { color, Icon } = getColorAndIcon(toast.severity);

    if (!toast?.title) {
        return null;
    }

    return (
        !!toast?.title
            ? <Modal
                visible={!!toast?.title}
                transparent
                animationType="fade"
                presentationStyle={'overFullScreen'}
                onRequestClose={() => dispatch(updateToast({ title: '' }))}
            >
                <Animated.View
                    style={[
                        styles.container,
                        animatedStyles,
                        { top: Platform.OS == 'android' ? 4 : top, borderColor: color, }
                    ]}
                >
                    <View style={[styles.content, { backgroundColor: `${color}20` }]}>
                        <Icon color={color} />
                        <View style={styles.textContainer}>
                            <ThemeText content={`${toast.title}`} color={color} variant='sm' fontFamily='MontserratSemiBold' />
                            {toast.message &&
                                <ThemeText content={`${toast.message}`} color={color} severity='secondary' />
                            }
                        </View>
                    </View>
                </Animated.View>
            </Modal>
            : null
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '90%',
        alignSelf: 'center',
        zIndex: SHEET_ZINDEX,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignSelf: 'stretch',
        minWidth: dimensions.width * 0.4,
    },
    textContainer: {
        flex: 1,
    },

});

export default ThemeToast;
