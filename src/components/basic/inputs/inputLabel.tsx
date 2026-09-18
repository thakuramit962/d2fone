import { useTheme } from '@/hooks/use-theme'
import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import ThemeText from '../text/ThemeText'



const InputLabel = ({ size = 56, error, required, editable, label }: {
    size?: number
    error?: boolean
    required?: boolean
    editable?: boolean
    label: string

}) => {
    const theme = useTheme()
    const labelFontSize = useMemo(() => (size / 4 < 12 ? 12 : 14), [size])
    return (
        <View style={styles.labelRow}>
            <ThemeText
                content={label}
                fontFamily="InterRegular"
                style={[
                    styles.label,
                    {
                        color: error
                            ? theme.error
                            : !editable
                                ? theme.text.disabled
                                : theme.text.secondary,
                        fontSize: labelFontSize,
                    },
                ]}
            />
            {required && (
                <ThemeText
                    content="*"
                    fontFamily="MontserratMedium"
                    style={{ color: theme.error, fontSize: labelFontSize }}
                />
            )}
        </View>
    )
}

export default memo(InputLabel)

const styles = StyleSheet.create({
    labelRow: {
        flexDirection: 'row',
        gap: 4,
    },
    label: {
        paddingLeft: 16,
    },
})