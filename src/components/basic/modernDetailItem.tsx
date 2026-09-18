import { useTheme } from '@/hooks/use-theme'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import React, { ReactNode, memo, useMemo } from 'react'
import { ColorValue, Image, ImageSourcePropType, Pressable, PressableProps, View, ViewStyle } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { ArrowRightIcon } from '../icons'
import ThemeText, { ThemeTextProps } from './text/ThemeText'

interface ModernDetailItemProps extends PressableProps {
    icon?: React.FC<SvgProps>
    actionIcon?: ReactNode
    label?: ThemeTextProps
    description?: ThemeTextProps
    iconColor?: string
    iconSize?: number
    iconOpacity?: number
    children?: ReactNode
    isLast?: boolean
    isFirst?: boolean
    single?: boolean
    bg?: ColorValue
    minHeight?: number
    borderRadius?: number
    padding?: number
    iconBox?: number
    containerStyle?: ViewStyle
    listNumber?: ThemeTextProps
    iconOnTop?: boolean
    seperateChild?: boolean
    img?: ImageSourcePropType
}

const ModernDetailItem = ({
    icon: Icon,
    img,
    actionIcon,
    label,
    description,
    iconColor,
    iconSize = 26,
    iconBox = 12,
    iconOpacity = 0.75,
    children,
    isLast,
    isFirst,
    single = true,
    bg,
    minHeight = 54,
    borderRadius = 16,
    padding = 4,
    onPress,
    containerStyle,
    listNumber,
    iconOnTop = false,
    seperateChild = false,
    ...rest
}: ModernDetailItemProps) => {
    const theme = useTheme()
    const global = useGlobalStyle()

    const isSingle = useMemo(
        () => (!isFirst && !isLast && single),
        [isFirst, isLast, single]
    )

    const borderRadiusStyle = useMemo(() => ({
        borderTopLeftRadius: (isSingle || isFirst) ? borderRadius : 4,
        borderTopRightRadius: (isSingle || isFirst) ? borderRadius : 4,
        borderBottomLeftRadius: (isSingle || isLast) ? borderRadius : 4,
        borderBottomRightRadius: (isSingle || isLast) ? borderRadius : 4,
    }), [isSingle, isFirst, isLast, borderRadius])

    const containerBaseStyle = useMemo(() => ({
        backgroundColor: bg ?? theme?.background.main,
        padding,
        columnGap: 8,
        rowGap: seperateChild ? 2 : 4,
        paddingRight: onPress ? 24 : padding,
        minHeight,
        ...borderRadiusStyle,
    }), [bg, theme, padding, minHeight, borderRadiusStyle, onPress])

    const layoutStyle = useMemo(
        () => (iconOnTop ? global.rowStartTop : global.rowCenter),
        [iconOnTop, global]
    )

    const actionIconStyle = useMemo(() => ({
        position: 'absolute' as const,
        right: 4,
        top: (iconOnTop || seperateChild) ? padding * 2 : undefined
    }), [iconOnTop, seperateChild, padding])

    return (
        <Pressable
            disabled={!onPress}
            style={[
                containerBaseStyle,
                containerStyle,
                layoutStyle,
                seperateChild && { flexWrap: 'wrap' },
                { borderCurve: "continuous" }
            ]}
            onPress={onPress}
            {...rest}
        >
            {Icon && (
                <View style={[global.flexCenter, { height: iconSize + iconBox, width: iconSize + iconBox }]}>
                    <Icon
                        height={iconSize}
                        width={iconSize}
                        color={iconColor ?? theme?.text.primary}
                        style={{ opacity: iconOpacity }}
                    />
                </View>
            )}
            {img && (
                <View style={[global.flexCenter, { height: iconSize + iconBox, width: iconSize + iconBox }]}>
                    <Image
                        source={img}
                        style={{
                            opacity: iconOpacity,
                            height: iconSize,
                            width: iconSize,
                            resizeMode: 'contain'
                        }}
                    />
                </View>
            )}

            {listNumber && (
                <View style={[global.flexCenter, { height: iconSize, width: iconSize }]}>
                    <ThemeText {...listNumber} />
                </View>
            )}

            <View style={{ flex: 1, paddingHorizontal: (Icon || listNumber) ? 0 : 8 }}>
                {label && <ThemeText severity="secondary" {...label} />}
                {description && <ThemeText fontFamily="MontserratSemiBold" {...description} />}
                {!seperateChild && children}
            </View>

            {seperateChild && (
                <View style={{ width: '100%', paddingHorizontal: 8 }}>
                    {children}
                </View>
            )}

            {(onPress || actionIcon) && (
                <View style={[global.flexCenter, actionIconStyle]}>
                    {actionIcon ?? <ArrowRightIcon style={{ opacity: 0.5 }} />}
                </View>
            )}
        </Pressable>
    )
}

export default memo(ModernDetailItem)
