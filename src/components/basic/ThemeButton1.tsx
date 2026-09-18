import React from 'react';
import Animated from 'react-native-reanimated';
import { SvgProps } from 'react-native-svg';
import ThemeText, { ThemeTextProps } from './ThemeText';


interface ThemeButtonProps {
    Icon?: React.FC<SvgProps>;
    label?: ThemeTextProps;
    description?: ThemeTextProps;
    iconSize: number;
    stretchLabel: boolean;
    themeTextDisabledColor: string;

    iconPosition?: 'left' | 'right'
    iconColor?: string
}

const ThemeButton1 = ({ Icon, label, iconColor, iconSize, iconPosition = 'left' }: ThemeButtonProps) => {
    return (
        <Animated.View style={[{ overflow: 'hidden' }]}>

            {Icon && iconPosition === 'left' && (
                <Icon
                    height={iconSize}
                    width={iconSize}
                    color={iconColor}
                    style={{ opacity: 0.75 }}
                />
            )}

            {label && (
                <ThemeText
                    severity="secondary"
                    {...label}
                    style={[
                        ...(label.style ? [label.style] : [])
                    ]}
                />
            )}

            {Icon && iconPosition === 'right' && (
                <Icon
                    height={iconSize}
                    width={iconSize}
                    color={iconColor}
                    style={{ opacity: 0.75 }}
                />
            )}
        </Animated.View>
    )
}

export default React.memo(ThemeButton1)