import { useTheme } from '@/hooks/use-theme'
import { StyleSheet, View } from 'react-native'
import ThemeText, { ThemeTextProps, } from './text/ThemeText'

const TextDivider = ({
    label,
    color,
    alignment = 'center',
    verticalAlign = "center",
    labelProps

}: {
    label?: string,
    color?: string,
    alignment?: 'left' | 'right' | 'center',
    verticalAlign?: 'center' | 'flex-start' | 'flex-end',
    labelProps?: ThemeTextProps
}) => {
    const theme = useTheme()
    const textColor = color ?? theme?.text.secondary
    const styles = StyleSheet.create({
        container: {
            alignItems: verticalAlign,
            justifyContent: 'center',
            flexDirection: 'row',
            marginVertical: 8,
            gap: label ? 8 : 0,
        },
        dividers: {
            flex: 1,
            backgroundColor: textColor,
            height: 0.5,
            opacity: 0.5
        }
    })
    return (
        <View style={styles.container}>
            {alignment !== 'left' && <View style={styles.dividers} />}
            {label && <ThemeText content={label ?? ''} severity={'secondary'} {...labelProps} />}
            {alignment !== 'right' && < View style={styles.dividers} />}
        </View>
    )
}

export default TextDivider