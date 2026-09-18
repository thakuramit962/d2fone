import { useTheme } from '@/hooks/use-theme';
import React, { useMemo } from 'react'; // Import useMemo
import { Pressable, PressableProps, View, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import ThemeText, { ThemeTextProps } from './ThemeText';

interface DetailContentProps {
    Icon?: React.FC<SvgProps>;
    label?: ThemeTextProps;
    description?: ThemeTextProps;
    iconColor?: string;
    iconSize: number;
    stretchLabel: boolean;
    themeTextDisabledColor: string;
}

const DetailContent = React.memo(
    ({ Icon, label, description, iconColor, iconSize, stretchLabel, themeTextDisabledColor }: DetailContentProps) => {
        return (
            <>
                {Icon && (
                    <Icon
                        height={iconSize}
                        width={iconSize}
                        color={iconColor ?? themeTextDisabledColor}
                        style={{ opacity: 0.75 }}
                    />
                )}

                {label && (
                    <ThemeText
                        severity="secondary"
                        {...label}
                        style={[
                            { flex: stretchLabel ? 1 : 0 },
                            ...(label.style ? [label.style] : [])
                        ]}
                    />
                )}
                {description &&
                    <ThemeText
                        {...description}
                        selectable
                        style={[
                            { flex: stretchLabel ? 0 : 1 },
                            ...(description.style ? [description.style] : [])
                        ]}
                    />
                }
            </>
        );
    }
);

interface ModernDetailItemProps extends PressableProps {
    icon?: React.FC<SvgProps>;
    label?: ThemeTextProps;
    description?: ThemeTextProps;
    iconColor?: string;
    containerStyle?: ViewStyle;
    iconSize?: number;
    stretchLabel?: boolean;
}

const DetailLine = (
    {
        icon: Icon,
        label,
        description,
        iconColor,
        iconSize = 12,
        containerStyle,
        stretchLabel = true,
        onPress,
        ...rest
    }: ModernDetailItemProps
) => {
    const theme = useTheme();

    const themeTextDisabledColor = useMemo(() => `${theme?.text.disabled}`, [theme?.text.disabled]);

    const baseContainerStyle = useMemo(() => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 4,
        justifyContent: 'flex-start' as const
    }), []);

    return (
        onPress
            ? <Pressable
                onPress={onPress}
                {...rest}
                style={[baseContainerStyle, containerStyle]}
            >
                <DetailContent
                    Icon={Icon}
                    label={label}
                    description={description}
                    iconColor={iconColor}
                    iconSize={iconSize}
                    stretchLabel={stretchLabel}
                    themeTextDisabledColor={themeTextDisabledColor}
                />
            </Pressable>
            : <View
                {...rest}
                style={[baseContainerStyle, containerStyle]}
            >
                <DetailContent
                    Icon={Icon}
                    label={label}
                    description={description}
                    iconColor={iconColor}
                    iconSize={iconSize}
                    stretchLabel={stretchLabel}
                    themeTextDisabledColor={themeTextDisabledColor}
                />
            </View>
    );
};

export default React.memo(DetailLine);