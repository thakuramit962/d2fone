import { ArrowDownIcon } from '@/components/icons'
import { SHEET_ZINDEX } from '@/constants/appConstant'
import { useTheme } from '@/hooks/use-theme'
import { dimensions } from '@/utils/app-helper'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View, ViewStyle } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SvgProps } from 'react-native-svg'
import ActionText from '../../text/ActionText'
import ThemeText from '../../text/ThemeText'

export interface SelectOption {
    label: string
    value: string
    [key: string]: any
}

interface ExpandableSelectInputProps {
    label?: string
    placeholder?: string
    helperText?: string
    error?: boolean
    required?: boolean
    icon?: React.FC<SvgProps>
    size?: number
    mainContainerStyle?: ViewStyle
    options: SelectOption[]
    onChange?: (value: SelectOption) => void
    borderColor?: string
    colour?: string
    defaultValue?: SelectOption | null
    showLabelAsValue?: boolean
    cornerRadius?: number
}

const RADIUS_FOCUSED = 12
const RADIUS_IDLE = 14
const MAX_ICON_SIZE = 22
const FONT_SIZE = Math.min(dimensions.width * 0.04, 14)
const TIMING_CONFIG = { easing: Easing.bounce } as const


const ExpandableSelectInput = ({
    size = 56,
    error = false,
    helperText,
    label,
    icon: Icon,
    mainContainerStyle,
    required,
    placeholder = 'Select',
    options,
    onChange,
    borderColor,
    colour,
    defaultValue,
    cornerRadius = 14,
    showLabelAsValue = true,
}: ExpandableSelectInputProps) => {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<SelectOption | null>(defaultValue ?? null)

    // Dynamic color evaluation
    const color = error ? theme?.error : theme?.text.primary
    const textColor = error ? theme?.error : theme?.text.disabled
    const iconSize = Math.min(size * 0.4, 22)

    // Animate border radius dynamically when dropdown opens
    const borderRadius = useSharedValue<number>(cornerRadius)
    const animatedBorderStyle = useAnimatedStyle(() => ({ borderRadius: borderRadius.value }))

    useEffect(() => {
        borderRadius.value = withTiming(open ? cornerRadius / 2 : cornerRadius, { duration: 150 })
    }, [open, cornerRadius])

    const animatedStyle = useAnimatedStyle(() => ({
        borderRadius: borderRadius.value,
    }))

    const toggleDropdown = useCallback(() => {
        setOpen((prev) => {
            prev ? borderRadius.value = withTiming(cornerRadius - 2, TIMING_CONFIG) : borderRadius.value = withTiming(cornerRadius - 2, TIMING_CONFIG)
            return !prev
        })
    }, [])

    const handleSelect = useCallback(
        (option: SelectOption) => {
            setSelected(option)
            setOpen(false)
            onChange?.(option)
        },
        [onChange]
    )

    const containerStyles = useMemo<ViewStyle>(
        () => ({
            borderColor: `${borderColor ?? color}25`,
            backgroundColor: error ? `${color}15` : 'transparent',
            height: size,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 16,
            paddingRight: 8,
            borderWidth: 1,
        }),
        // ADDED: borderColor to dependency array
        [borderColor, color, error, size]
    )

    // Fallback logic for displaying value vs label based on prop
    const displayedText = useMemo(() => {
        if (!selected) return placeholder
        return showLabelAsValue ? selected.label : selected.value
    }, [selected, placeholder, showLabelAsValue])

    const interactiveColor = error
        ? color
        : selected
            ? (colour ?? theme?.text.primary)
            : borderColor
                ? `${borderColor}70`
                : theme?.text.secondary

    return (
        <View style={[styles.relative, mainContainerStyle]}>
            {/* Label */}
            {label && (
                <View style={styles.labelContainer}>
                    <ThemeText
                        content={label}
                        fontFamily="MontserratMedium"
                        style={{
                            color: textColor,
                            fontSize: Math.max(size / 4, 11),
                        }}
                    />
                    {required && (
                        <ThemeText
                            content="*"
                            fontFamily="MontserratMedium"
                            style={{ color: theme?.error, fontSize: Math.max(size / 4, 11) }}
                        />
                    )}
                </View>
            )}

            {/* Input Button */}
            <Pressable onPress={toggleDropdown}>
                <Animated.View style={[containerStyles, animatedBorderStyle]}>

                    <View style={styles.inputLeftSection}>
                        {Icon && (
                            <Icon
                                height={iconSize}
                                width={iconSize}
                                style={styles.marginRight}
                                color={error ? color : selected ? theme?.text.primary : borderColor ? `${borderColor}70` : theme?.text.secondary}
                            />
                        )}
                        <ThemeText
                            content={displayedText}
                            color={interactiveColor}
                            variant="xs"
                            fontFamily="MontserratMedium"
                            numberOfLines={1}
                            style={styles.flexShrink}
                        />
                    </View>
                    <Animated.View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
                        <ArrowDownIcon color={interactiveColor} />
                    </Animated.View>
                </Animated.View>
            </Pressable>

            {/* Helper text */}
            {!!helperText && (
                <ThemeText
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    content={helperText}
                    color={textColor}
                    style={styles.helperText}
                />
            )}

            {/* Dropdown Menu */}
            {open && (
                <>
                    {/* Backdrop dismiss layer */}
                    <Pressable
                        onPress={() => setOpen(false)}
                        style={[styles.backdrop, { zIndex: SHEET_ZINDEX - 1 }]}
                    />

                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        style={[
                            styles.dropdownScroll,
                            {
                                zIndex: SHEET_ZINDEX,
                                top: label ? size + 18 : size,
                                backgroundColor: theme?.background.slate,
                            }
                        ]}
                        contentContainerStyle={styles.dropdownContent}
                    >
                        {options.map((option: SelectOption, index: number) => (
                            <ActionText
                                key={option.value ?? index}
                                label={option.label}
                                withIcon={false}
                                severity="secondary"
                                containerStyle={styles.actionTextContainer}
                                action={() => handleSelect(option)}
                            />
                        ))}
                    </ScrollView>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    relative: { position: 'relative' },
    labelContainer: { flexDirection: 'row', gap: 4, paddingLeft: 16 },
    inputLeftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    marginRight: { marginRight: 6 },
    flexShrink: { flexShrink: 1 },
    helperText: { marginHorizontal: 16, marginTop: 4 },
    backdrop: {
        position: "absolute",
        top: -2000,
        left: -2000,
        right: -2000,
        bottom: -2000,
    },
    dropdownScroll: {
        position: "absolute",
        elevation: 5,
        padding: 10,
        width: "100%",
        borderRadius: 12,
        maxHeight: 300,
    },
    dropdownContent: {
        paddingBottom: 20,
        alignItems: "flex-start",
    },
    actionTextContainer: {
        minHeight: 28,
        alignSelf: "stretch",
        justifyContent: "flex-start",
    }
})

export default React.memo(ExpandableSelectInput)