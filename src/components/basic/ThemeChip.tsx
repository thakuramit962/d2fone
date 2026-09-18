import { getFontSize } from '@/constants/appConstant';
import { useTheme } from '@/hooks/use-theme';
import { useGlobalStyle } from '@/hooks/useGlobalStyle';
import React from 'react';
import { Pressable, PressableProps, TextProps, TextStyle, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import ThemeText from './text/ThemeText';

interface ThemeChipProps extends TextProps {
    icon?: React.FC<SvgProps>;
    label: string | string[];
    color?: string;
    iconColor?: string;
    textColor?: string;
    textSize?: number;
    variant?: 'xs' | 'sm' | 'md' | 'lg'
    iconPosition?: 'left' | 'right'
    severity?: 'success' | 'info' | 'warning' | 'error' | 'main' | 'secondary' | 'disabled' | 'primary';
    containerProps?: PressableProps;
    containerStyle?: ViewStyle
    textStyle?: TextStyle
    onPress?: () => void
    iconSizePlus?: number
    type?: 'solid' | 'default'
}

const ThemeChip: React.FC<ThemeChipProps> = React.memo(({
    label,
    style,
    variant,
    severity,
    icon: Icon,
    iconColor,
    textColor,
    textSize,
    containerProps,
    iconPosition = 'left',
    containerStyle,
    onPress,
    textStyle,
    iconSizePlus = 8,
    type = 'default',
    ...restProps
}) => {
    const theme = useTheme();
    const globalStyle = useGlobalStyle();

    const fontSize = getFontSize(variant)


    const color = restProps?.color ? restProps.color :
        severity === 'success' ? theme?.success
            : severity === 'primary' ? theme?.primary
                : severity === 'info' ? theme?.info
                    : severity === 'warning' ? theme?.warning
                        : severity === 'error' ? theme?.error
                            : severity === 'disabled' ? theme?.text?.disabled
                                : severity === 'secondary' ? theme?.text?.secondary
                                    : theme?.text?.disabled;

    const pressableStyle: ViewStyle = {
        ...globalStyle.alignCenter,
        backgroundColor: type == 'solid' ? color : `${color}30`,
        padding: 2,
        paddingRight: iconPosition == 'left' ? 12 : 8,
        paddingLeft: iconPosition == 'right' ? 12 : 8,
        flexDirection: 'row',
        gap: 6,
        borderRadius: 20,
    };

    return (
        <Pressable
            onPress={onPress}
            style={[pressableStyle, containerStyle]}
            {...containerProps}
        >
            {(Icon && iconPosition == 'left') && <Icon height={fontSize + iconSizePlus} width={fontSize + iconSizePlus} color={iconColor ?? color} />}
            <ThemeText
                content={label}
                variant="sm"
                style={[{
                    // flex: 1,
                    color: textColor ? textColor : type == 'solid' ? theme?.background.main : color,
                    fontSize: textSize ?? fontSize,
                    fontFamily: 'MontserratMedium',
                    textAlign: 'center'
                }, textStyle]}
                {...restProps}
            />
            {(Icon && iconPosition == 'right') && <Icon height={fontSize + iconSizePlus} width={fontSize + iconSizePlus} color={iconColor ?? color} />}
        </Pressable>
    );
});

export default ThemeChip;
