import { useTheme } from '@/hooks/use-theme'
import { dimensions } from '@/utils/app-helper'
import React, { forwardRef, memo, useCallback, useMemo, useState } from 'react'
import {
  FocusEvent,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle
} from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SvgProps } from 'react-native-svg'
import ThemeText from '../text/ThemeText'
import InputLabel from './inputLabel'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ThemeInputProps extends TextInputProps {
  /** Render a show/hide toggle; makes the field behave as a password input */
  isSecure?: boolean
  label?: string
  helperText?: string
  error?: boolean
  required?: boolean
  /** Leading icon component (react-native-svg) */
  icon?: React.FC<SvgProps>
  /** Height of the input row (default 56) */
  size?: number
  mainContainerStyle?: ViewStyle
  borderColor?: string
  cornerRadius?: number
  variant?: 'underline' | 'outlined' | 'solid'
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RADIUS_FOCUSED = 12
const RADIUS_IDLE = 14
const MAX_ICON_SIZE = 22
const FONT_SIZE = Math.min(dimensions.width * 0.04, 14)
const TIMING_CONFIG = { easing: Easing.bounce } as const

// ─── Component ────────────────────────────────────────────────────────────────

const ThemeInput = forwardRef<TextInput, ThemeInputProps>((props, ref) => {
  const {
    size = 56,
    error = false,
    helperText,
    label,
    icon: Icon,
    isSecure = false,
    mainContainerStyle,
    required = false,
    borderColor,
    variant = 'outlined',
    onFocus,
    onBlur,
    onChangeText,
    multiline = false,
    numberOfLines,
    editable = true,
    cornerRadius = RADIUS_IDLE,
    ...restProps
  } = props

  const theme = useTheme()

  // ── Animation shared values ──────────────────────────────────────────────
  const radius = useSharedValue<number>(cornerRadius)
  const animatedBorderStyle = useAnimatedStyle(() => ({ borderRadius: radius.value }))

  // ── Local state ──────────────────────────────────────────────────────────
  const [isFocused, setIsFocused] = useState(false)
  // FIX: textVisible should only be true when isSecure is true — avoids hiding
  // plain text fields when isSecure changes to false after mount
  const [textVisible, setTextVisible] = useState(isSecure)

  // ── Derived colors (memoized — not in a useEffect → no stale render) ─────
  // FIX: removed useEffect + useState for color; derived synchronously
  const strokeColor = useMemo(() => {
    if (!editable) return theme.text.disabled
    if (error) return theme.error
    return borderColor ?? theme.text.primary
  }, [editable, error, borderColor, theme])

  const iconColor = error ? theme.error : theme.text.disabled

  // ── Height for multiline inputs ──────────────────────────────────────────
  const inputHeight = useMemo(() => {
    if (!multiline) return size
    return (numberOfLines ?? 1) * (size / 2.5)
  }, [multiline, numberOfLines, size])

  // ── Icon dimensions ──────────────────────────────────────────────────────
  const iconSize = Math.min(size * 0.7, MAX_ICON_SIZE)

  // ── Event handlers (stable refs — not recreated on every render) ─────────
  const handleFocus = useCallback(
    (e: FocusEvent) => {
      radius.value = withTiming(cornerRadius - 2, TIMING_CONFIG)
      setIsFocused(true)
      onFocus?.(e)
    },
    [onFocus, radius]
  )

  const handleBlur = useCallback(
    (e: FocusEvent) => {
      radius.value = withTiming(cornerRadius, TIMING_CONFIG)
      setIsFocused(false)
      onBlur?.(e)
    },
    [onBlur, radius]
  )

  const handleChangeText = useCallback(
    (text: string) => onChangeText?.(text),
    [onChangeText]
  )

  const toggleVisibility = useCallback(() => setTextVisible((prev) => !prev), [])

  // ── Container styles (memoized to avoid StyleSheet thrashing) ────────────
  const containerStyle = useMemo(() => ({
    borderColor: `${strokeColor}25`,
    backgroundColor: error
      ? `${theme.error}15`
      : (variant == 'solid')
        ? `${theme.text.disabled}20`
        : (!editable
          ? `${theme.text.disabled}30`
          : 'transparent'),
    height: inputHeight,
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingLeft: 16,
    // FIX: always leave right padding; secure toggle gets its own internal space
    paddingRight: isSecure ? 4 : 16,
    paddingVertical: multiline ? 8 : 0,
    borderWidth: (!editable || variant == 'solid') ? 0 : variant === 'outlined' ? 1 : 0,
    borderBottomWidth: (!editable || variant == 'solid') ? 0 : 1,
  }), [strokeColor, error, editable, inputHeight, isSecure, multiline, variant, theme])

  // ── Text input style (memoized) ──────────────────────────────────────────
  const textStyle = useMemo(() => ({
    flex: 1,
    fontSize: FONT_SIZE,
    lineHeight: FONT_SIZE,
    color: error ? theme.error : theme.text.primary,
    letterSpacing: isFocused ? 0.5 : 0,
    fontFamily: 'MontserratRegular',
    alignSelf: 'stretch' as const,
    textAlignVertical: multiline ? 'top' as const : 'center' as const,
    padding: 0,
  }), [error, isFocused, multiline, theme])

  // ────────────────────────────────────────────────────────────────────────

  return (
    <View style={mainContainerStyle}>

      {/* ── Label ── */}
      {label && (
        <InputLabel
          label={label}
          editable={editable}
          error={error}
          required={required}
          size={size}
        />
      )}

      {/* ── Input row ── */}
      <Animated.View style={[containerStyle, animatedBorderStyle]}>

        {Icon && (
          <Icon
            height={iconSize}
            width={iconSize}
            style={styles.icon}
            color={iconColor}
          />
        )}

        <TextInput
          ref={ref}
          selectTextOnFocus
          selectionColor={`${theme.primary}60`}
          secureTextEntry={isSecure ? textVisible : undefined}
          placeholder={label ? '' : restProps.placeholder ?? ''}
          placeholderTextColor={`${theme.text.disabled}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          style={textStyle}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          {...restProps}
        />

        {/* ── Show/Hide toggle ── */}
        {isSecure && (
          <Pressable
            onPress={toggleVisibility}
            android_ripple={{
              color: `${strokeColor}50`,
              borderless: true,
              foreground: false,
            }}
            accessibilityRole="button"
            accessibilityLabel={textVisible ? 'Hide password' : 'Show password'}
            hitSlop={8}
          >
            <View style={[styles.center, { width: size }]}>
              <ThemeText
                content={textVisible ? 'Show' : 'Hide'}
                severity="primary"
                fontFamily="MontserratMedium"
              />
            </View>
          </Pressable>
        )}
      </Animated.View>

      {/* ── Helper / error text ── */}
      {helperText && (
        <ThemeText
          numberOfLines={1}
          ellipsizeMode="tail"
          content={helperText}
          color={error ? theme.error : theme.text.disabled}
          style={styles.helperText}
        />
      )}
    </View>
  )
})

ThemeInput.displayName = 'ThemeInput'

export default memo(ThemeInput)

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    gap: 4,
  },
  label: {
    paddingLeft: 16,
  },
  icon: {
    marginRight: 6,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    marginHorizontal: 16,
  },
})