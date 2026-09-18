import { memo, useCallback, useState } from 'react'
import { ColorValue, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Svg, { Path } from 'react-native-svg'

type CheckboxInputProps = {
    value?: boolean
    defaultValue?: boolean
    onChange?: (isChecked: boolean) => void
    color?: ColorValue
    disabled?: boolean
    accessibilityLabel?: string
    style?: StyleProp<ViewStyle>
    testID?: string
}

const CheckboxInput = ({
    color = '#147A28',
    defaultValue = false,
    value,
    onChange,
    disabled = false,
    accessibilityLabel = 'Checkbox',
    style,
    testID,
}: CheckboxInputProps) => {
    const isControlled = value !== undefined
    const [internalChecked, setInternalChecked] = useState(defaultValue)
    const checked = isControlled ? (value as boolean) : internalChecked

    const handlePress = useCallback(() => {
        if (disabled) return
        const next = !checked
        if (!isControlled) {
            setInternalChecked(next)
        }
        onChange?.(next)
    }, [checked, disabled, isControlled, onChange])

    return (
        <Pressable
            onPress={handlePress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.checkboxWrapper,
                pressed && !disabled && styles.pressed,
                disabled && styles.disabled,
                style,
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled }}
            accessibilityLabel={accessibilityLabel}
            hitSlop={8}
            testID={testID}
        >
            <Svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                accessibilityElementsHidden
                importantForAccessibility="no"
            >
                <Path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" />
                {checked && (
                    <Path
                        d="M8 12.5L10.5 15L16 9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}
            </Svg>
        </Pressable>
    )
}

export default memo(CheckboxInput)

const styles = StyleSheet.create({
    checkboxWrapper: {
        height: 24,
        width: 24,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressed: {
        opacity: 0.6,
    },
    disabled: {
        opacity: 0.4,
    },
})