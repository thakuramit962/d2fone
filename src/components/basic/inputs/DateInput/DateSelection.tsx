import { CalendarIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { dimensions } from '@/utils/app-helper'
import dayjs, { Dayjs } from 'dayjs'
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'
import ThemeText from '../../text/ThemeText'
import InputLabel from '../inputLabel'
import DateInput from './DateInput'



const RADIUS_IDLE = 14
const MAX_ICON_SIZE = 22
const FONT_SIZE = Math.min(dimensions.width * 0.04, 14)




interface DateSelectionProps {
    onChange: (date: Dayjs) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    maxHeight?: number;
    searchPlaceholder?: string;
    loading?: boolean
    required?: boolean
    helperText?: string
    icon?: React.FC<SvgProps>;
    size?: number
    format?: string
    borderColor?: string

    defaultDate?: Dayjs

    disableFuture?: boolean
    disablePast?: boolean
    minDate?: Dayjs
    maxDate?: Dayjs

    disabled?: boolean;
    variant?: 'underline' | 'outlined' | 'solid'
    cornerRadius?: number

};

const DateSelection: React.FC<DateSelectionProps> = ({
    defaultDate = dayjs(),
    onChange,
    placeholder = 'select date',
    label,
    error,
    disabled = false,
    borderColor,
    size = 56,
    helperText,
    icon: Icon,
    format = 'DD-MM-YYYY',
    maxDate,
    minDate,
    disableFuture,
    disablePast,
    variant = 'solid',
    required = false,
    cornerRadius = RADIUS_IDLE

}) => {


    const theme = useTheme()

    const [selectedDate, setSelectedDate] = React.useState<Dayjs>(dayjs(defaultDate))
    const [color, setColor] = React.useState<string | undefined>(theme?.text?.primary)

    const strokeColor = useMemo(() => {
        if (!disabled) return theme.text.disabled
        if (error) return theme.error
        return borderColor ?? theme.text.primary
    }, [disabled, error, borderColor, theme])

    const iconColor = error ? theme.error : theme.text.disabled

    // ── Icon dimensions ──────────────────────────────────────────────────────
    const iconSize = Math.min(size * 0.7, MAX_ICON_SIZE)

    // ── Container styles (memoized to avoid StyleSheet thrashing) ────────────
    const containerStyle = useMemo(() => ({
        borderColor: `${strokeColor}25`,
        backgroundColor: error
            ? `${theme.error}15`
            : (variant == 'solid')
                ? `${theme.text.disabled}20`
                : (!disabled
                    ? `${theme.text.disabled}30`
                    : 'transparent'),
        height: size,
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        paddingLeft: 16,
        // FIX: always leave right padding; secure toggle gets its own internal space
        paddingRight: 16,
        borderWidth: (!disabled || variant == 'solid') ? 0 : variant === 'outlined' ? 1 : 0,
        borderBottomWidth: (!disabled || variant == 'solid') ? 0 : 1,
        borderRadius: cornerRadius,
    }), [strokeColor, error, disabled, size, variant, theme])

    // ── Text input style (memoized) ──────────────────────────────────────────
    const textStyle = useMemo(() => ({
        flex: 1,
        fontSize: FONT_SIZE,
        lineHeight: FONT_SIZE,
        color: error ? theme.error : theme.text.primary,
        fontFamily: 'MontserratMedium',
        alignSelf: 'stretch' as const,
        textAlignVertical: 'center' as const,
        padding: 0,
    }), [error, theme])



    const defaultDateStr = defaultDate?.format('YYYY-MM-DD') ?? ''

    React.useEffect(() => {
        if (defaultDateStr) {
            setSelectedDate(dayjs(defaultDateStr))
        }
    }, [defaultDateStr])

    React.useEffect(() => {
        error ? setColor(theme?.error) : setColor(theme?.text?.primary)
    }, [error])


    return (
        <DateInput
            content={
                <View>
                    {label &&
                        <InputLabel
                            required={required}
                            error={Boolean(error)}
                            label={label}
                            size={size}
                        />
                    }
                    <View
                        style={containerStyle}>
                        <CalendarIcon color={iconColor} size={iconSize} style={{ marginRight: 6 }} />

                        <ThemeText
                            content={dayjs(selectedDate).format(format)}
                            fontFamily='MontserratMedium'
                            variant='sm'
                            color={disabled ? theme?.text.disabled : theme?.text.primary}
                            severity={disabled ? 'disabled' : 'main'}
                            style={textStyle}
                        />
                    </View>
                    {helperText &&
                        <ThemeText
                            numberOfLines={1}
                            ellipsizeMode='tail'
                            content={helperText ? `${helperText}` : ''}
                            color={error ? theme?.error : theme?.text.disabled}
                            style={{ marginHorizontal: 16 }}
                        />}
                </View>
            }
            defaultDate={defaultDate ?? dayjs()}
            onDateSelect={(date) => {
                setSelectedDate(date)
                onChange(date)
            }}
            disablePast={disablePast}
            disableFuture={disableFuture}
            disabled={disabled}
            maxDate={maxDate}
            minDate={minDate}
        />
    )
}

export default DateSelection