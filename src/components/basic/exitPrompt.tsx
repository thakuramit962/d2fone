import { useTheme } from '@/hooks/use-theme'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import { dimensions } from '@/utils/app-helper'
import { useEffect, useRef, useState } from 'react'
import {
    Animated,
    BackHandler,
    Easing,
    Modal,
    Pressable,
    View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AlertIcon, CloseIcon } from '../icons'
import ActionText from './text/ActionText'
import ThemeText from './text/ThemeText'

const ExitPrompt = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    const theme = useTheme()
    const globalStyle = useGlobalStyle()
    const { bottom } = useSafeAreaInsets()

    const translateYAnim = useRef(new Animated.Value(100)).current
    const [confirmExit, setConfirmExit] = useState(false)

    const animate = (toValue: number) => {
        Animated.timing(translateYAnim, {
            toValue,
            duration: toValue === 0 ? 300 : 200,
            easing: toValue === 0 ? Easing.out(Easing.exp) : Easing.in(Easing.circle),
            useNativeDriver: true,
        }).start()
    }

    useEffect(() => {
        animate(visible ? 0 : 100)
        if (!visible) setConfirmExit(false)
    }, [visible])

    return (
        visible
            ? <Modal
                visible={visible}
                animationType="fade"
                onRequestClose={onClose}
                statusBarTranslucent
                backdropColor={'#00000018'}
            >
                {/* Background Overlay */}
                <Pressable
                    onPress={onClose}
                    style={[
                        globalStyle.justifyEnd,
                        globalStyle.alignCenter,
                        {
                            flex: 1,
                            paddingBottom: 24,
                        },
                    ]}
                >
                    <View
                        style={[
                            globalStyle.flexCenter,
                            {
                                height: 48,
                                width: 48,
                                borderRadius: 24,
                                backgroundColor: '#ffffff30',
                            },
                        ]}
                    >
                        <CloseIcon color={'#ffffff'} />
                    </View>
                </Pressable>

                {/* Animated Bottom Sheet */}
                <Animated.View
                    style={[
                        {
                            backgroundColor: theme?.background.slate,
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            alignItems: 'center',
                            width: dimensions.width,
                            minHeight: 400,
                            paddingBottom: bottom + 16,
                            transform: [{ translateY: translateYAnim }],
                            padding: 16,
                            justifyContent: 'space-between',
                            gap: 16,
                            alignSelf: 'stretch',
                        },
                    ]}
                >
                    {/* Header */}
                    <View style={[globalStyle.flexCenter, { flex: 1, alignSelf: 'stretch' }]}>
                        <AlertIcon height={100} width={100} color={theme?.error} />
                        <ThemeText
                            content="Exit App"
                            severity="error"
                            variant="lg"
                            fontFamily="MontserratBold"
                        />
                        <ThemeText
                            content={`Are you sure you want to exit the app?`}
                            variant="xs"
                            style={{
                                paddingHorizontal: 8,
                                textAlign: 'center',
                                marginTop: 8,
                            }}
                        />
                    </View>

                    {/* Actions */}
                    <View
                        style={[
                            globalStyle.rowCenter,
                            {
                                gap: 16,
                            },
                        ]}
                    >
                        <ActionText
                            label='Yes, Exit'
                            severity='error'
                            variant='sm'
                            fontFamily='MontserratSemiBold'
                            withIcon={false}
                            withBg
                            action={() => {
                                onClose()
                                BackHandler.exitApp()
                            }}
                            containerStyle={{
                                height: 42,
                                borderRadius: 12,
                                width: 120,
                                backgroundColor: `${theme?.error}10`

                            }} />
                        <ActionText
                            label='No, Stay'
                            severity='primary'
                            variant='sm'
                            fontFamily='MontserratSemiBold'
                            withIcon={false}
                            action={onClose}
                            containerStyle={{
                                height: 42,
                                width: 120,

                            }}
                        />
                    </View>
                </Animated.View>
            </Modal>
            : null
    )
}

export default ExitPrompt
