import { getFontSize } from '@/constants/appConstant'
import { useTheme } from '@/hooks/use-theme'
import { FontFamily } from '@/models/fontFamily'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useMemo } from 'react'
import { Pressable, PressableProps, TextStyle, ViewStyle } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SvgProps } from 'react-native-svg'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'xs' | 'sm' | 'md' | 'lg'

export type ButtonSeverity =
    | 'success' | 'info' | 'warning' | 'error'
    | 'main' | 'secondary' | 'disabled' | 'primary'

export interface ThemeButtonProps extends PressableProps {
    label: string
    variant?: ButtonVariant
    severity?: ButtonSeverity
    loading?: boolean
    loadingText?: string
    buttonStyle?: ViewStyle
    textStyle?: TextStyle
    disabled?: boolean
    fontFamily?: FontFamily
    borderRadius?: number        // fixed typo: bordrRadius → borderRadius
    icon?: React.FC<SvgProps>
    iconPosition?: 'left' | 'right'
    iconColor?: string
    color?: string
    bgColor?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VARIANT_HEIGHT: Record<ButtonVariant, number> = {
    lg: 56,
    md: 48,
    sm: 36,
    xs: 24,
}

const VARIANT_FONT_WEIGHT: Record<ButtonVariant, '400' | '600'> = {
    lg: '600',
    md: '600',
    sm: '600',
    xs: '400',
}

const BORDER_RADIUS_DEFAULT = 16
const BORDER_RADIUS_PRESSED = 18
const SCALE_DEFAULT = 1
const SCALE_PRESSED = 1.05
const TIMING_CONFIG = { easing: Easing.bounce } as const

// ─── Component ────────────────────────────────────────────────────────────────

const ThemeButton: React.FC<ThemeButtonProps> = React.memo(({
    label,
    variant = 'lg',
    severity,
    loading = false,
    loadingText = 'Loading...',
    buttonStyle,
    disabled = false,
    borderRadius,
    fontFamily = 'MontserratMedium',
    icon: Icon,
    iconPosition = 'right',
    iconColor,
    color,
    bgColor,
    textStyle,
    ...restProps
}) => {
    const theme = useTheme()

    // Shared values — stable refs, no re-creation on re-render
    const radiusValue = useSharedValue(borderRadius ?? BORDER_RADIUS_DEFAULT)
    const scaleValue = useSharedValue(SCALE_DEFAULT)

    const animatedViewStyle = useAnimatedStyle(() => ({
        borderRadius: radiusValue.value,
    }))

    const animatedTextStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleValue.value }],
    }))

    // Stable callbacks — won't cause child re-renders
    const handlePressIn = useCallback((e: any) => {
        radiusValue.value = withTiming(BORDER_RADIUS_PRESSED, TIMING_CONFIG)
        scaleValue.value = withTiming(SCALE_PRESSED, TIMING_CONFIG)
        restProps.onPressIn?.(e)
    }, [restProps.onPressIn])

    const handlePressOut = useCallback((e: any) => {
        radiusValue.value = withTiming(borderRadius ?? BORDER_RADIUS_DEFAULT, TIMING_CONFIG)
        scaleValue.value = withTiming(SCALE_DEFAULT, TIMING_CONFIG)
        restProps.onPressOut?.(e)
    }, [restProps.onPressOut, borderRadius])

    // Memoized gradient colors — recomputes only when relevant props change
    const gradientColors = useMemo((): [string, string] => {
        if (bgColor) return [bgColor, bgColor]
        if (disabled) return [`${theme?.text.disabled}`, `${theme?.text.disabled}`]
        if (severity === 'primary') return [`${theme?.primary}`, `${theme?.primary}`]
        if (severity === 'error') return [`${theme?.error}`, `${theme?.error}`]
        if (severity === 'success') return [`${theme?.success}`, `${theme?.success}`]
        if (severity === 'warning') return [`${theme?.warning}`, `${theme?.warning}`]
        if (severity === 'secondary') return [`${theme?.secondary}`, `${theme?.secondary}`]
        if (severity === 'info') return [`${theme?.info}`, `${theme?.info}`]
        return [`${theme?.text.primary}`, `${theme?.text.secondary}`]
    }, [bgColor, disabled, severity, theme])

    const iconSize = getFontSize(variant) + 4
    const iconTint = iconColor ?? theme?.background.slate
    const textColor = color ?? theme?.background.slate

    return (
        <Pressable
            disabled={disabled || loading}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessible
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled: disabled || loading, busy: loading }}
            {...restProps}
        >
            <Animated.View style={[{ overflow: 'hidden' }, animatedViewStyle]}>
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: VARIANT_HEIGHT[variant],
                            flexDirection: 'row',
                            gap: 8,
                            paddingHorizontal: 12,
                        },
                        buttonStyle,
                    ]}
                >
                    {Icon && iconPosition === 'left' && (
                        <Icon height={iconSize} width={iconSize} color={iconTint} />
                    )}

                    <Animated.Text
                        style={[
                            {
                                color: textColor,
                                fontSize: getFontSize(variant),
                                fontWeight: VARIANT_FONT_WEIGHT[variant],
                                fontFamily,
                                flex: 1,
                                textAlign: 'center',
                            },
                            textStyle,
                            animatedTextStyle,
                        ]}
                    >
                        {loading ? loadingText : label}
                    </Animated.Text>

                    {Icon && iconPosition === 'right' && (
                        <Icon height={iconSize} width={iconSize} color={iconTint} />
                    )}
                </LinearGradient>
            </Animated.View>
        </Pressable>
    )
})

ThemeButton.displayName = 'ThemeButton'

export default ThemeButton