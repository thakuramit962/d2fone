import { useTheme } from '@/hooks/use-theme'
import React from 'react'
import { Pressable, PressableProps } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'


interface IconButtonProps extends PressableProps {
    icon: React.ReactNode
    size?: number
    onPress?: () => void
    severity?: 'success' | 'info' | 'warning' | 'error' | 'main' | 'secondary' | 'disabled' | 'primary'
    withoutBg?: boolean
    color?: string
}


const IconButton = (props: IconButtonProps) => {

    const { icon, onPress, size = 24, severity = 'info', withoutBg = false, color, ...restProps } = props

    const theme = useTheme()
    const initialSize = useSharedValue(size)
    const pressedStyle = useAnimatedStyle(() => ({
        height: initialSize.value,
        width: initialSize.value,
    }))

    const buttonColor = color ? color : severity == 'primary' ? theme?.primary
        : severity == 'error' ? theme?.error
            : severity == 'success' ? theme?.success
                : severity == 'warning' ? theme?.warning
                    : severity == 'secondary' ? theme?.secondary
                        : severity == 'info' ? theme?.info
                            : theme?.primary


    return (
        <Pressable
            style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onPressIn={() => { initialSize.value = withSpring(size * 0.95) }}
            onPressOut={() => { initialSize.value = withSpring(size) }}
            onPress={!!onPress ? onPress : () => null}
            {...restProps}
        >
            <Animated.View
                style={[
                    {
                        backgroundColor: restProps?.disabled ? `${theme?.text.disabled}20` : withoutBg ? 'transparent' : `${buttonColor}20`,
                        borderRadius: size,
                        transformOrigin: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: size * 0.25,
                    },
                    pressedStyle
                ]}>
                {icon}
            </Animated.View>
        </Pressable>
    )
}

export default IconButton