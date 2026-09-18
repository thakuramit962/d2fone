import { ArrowRightIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { FontFamily } from '@/models/fontFamily'
import { Pressable, TextProps, TextStyle, ViewStyle } from 'react-native'
import ThemeText from './ThemeText'



interface ActionTextProps extends TextProps {
    action?: () => void,
    label: string,
    withIcon?: boolean,
    withBg?: boolean,
    severity?: 'success' | 'info' | 'warning' | 'error' | 'main' | 'secondary' | 'disabled' | 'primary'
    variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xxs'
    containerStyle?: ViewStyle
    textStyle?: TextStyle
    color?: string
    fontFamily?: FontFamily
}

const ActionText = ({ action, label, withIcon = true, withBg = false, severity = 'info', color, containerStyle, variant = 'xs', fontFamily = 'MontserratMedium', textStyle, ...restProps }: ActionTextProps) => {

    const theme = useTheme()

    const conetntColor = color ? color :
        severity === 'success' ? theme?.success
            : severity === 'primary' ? theme?.primary
                : severity === 'info' ? theme?.info
                    : severity === 'warning' ? theme?.warning
                        : severity === 'error' ? theme?.error
                            : severity === 'disabled' ? theme?.text?.disabled
                                : severity === 'secondary' ? theme?.text?.secondary
                                    : theme?.text?.secondary

    return (
        <Pressable
            style={[{
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center',
                justifyContent: 'center',
                ...(withBg ? {
                    backgroundColor: `${conetntColor}20`,
                    padding: 2,
                    paddingLeft: 8,
                    borderRadius: 8,
                } : {})
            }, containerStyle]}
            onPress={action ? action : () => { }}>
            <ThemeText content={label} variant={variant} severity={severity} fontFamily={fontFamily} color={color} style={textStyle} {...restProps} />
            {withIcon && <ArrowRightIcon height={16} width={16} color={conetntColor} />}
        </Pressable>
    )
}

export default ActionText