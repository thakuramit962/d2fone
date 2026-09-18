import { useTheme } from '@/hooks/use-theme';
import { FeaturedTool } from '@/models/commonTypes';
import { Href } from 'expo-router';
import { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import ThemeText from '../../text/ThemeText';


type ToolCardProps = {
    tool: FeaturedTool;
    theme: ReturnType<typeof useTheme>;
    onPress: (link: Href) => void;
    small?: boolean;
    style?: object;
}

const FeaturedToolCard = ({ tool, theme, onPress, small, style }: ToolCardProps) => {

    const handlePress = useCallback(() => tool?.link ? onPress(tool?.link) : undefined, [onPress, tool.link]);

    return (
        <Pressable
            onPress={handlePress}
            accessibilityRole="button"
            style={({ pressed }) => [
                styles.card,
                style,
                {
                    // backgroundColor: theme.background.main,
                    borderColor: theme.text.disabled,
                    opacity: pressed ? 0.7 : 1,
                    minHeight: 90,
                }
            ]}
        >
            <Image
                source={tool.img}
                style={[styles.image, {
                    height: small ? 56 : 72,
                    width: small ? 56 : 72,
                }]}
            />
            <View style={styles.cardContent}>
                {tool?.label ? (
                    <ThemeText
                        content={tool.label}
                        fontFamily='MontserratMedium'
                        size={8} style={{ lineHeight: 10 }}
                        severity='primary'
                    />
                ) : null}
                <ThemeText
                    content={tool?.title ?? ''}
                    fontFamily='MontserratSemiBold'
                    variant='xs'
                />
                {(tool.description && !small) ? (
                    <ThemeText
                        content={tool.description}
                        // severity='secondary'
                        style={styles.description}
                    />
                ) : null}
            </View>
        </Pressable>
    )
}

export default memo(FeaturedToolCard)


const styles = StyleSheet.create({
    container: {
        gap: 8,

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    subTitle: {
        lineHeight: 12
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        alignContent: 'flex-start',
        alignItems: 'flex-start'
    },
    card: {
        padding: 8,
        borderRadius: 24,
        borderCurve: 'continuous',
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        gap: 12,
    },
    image: {
        resizeMode: 'contain'
    },
    cardContent: {
        flex: 1,
        gap: 2,
    },
    description: {
        marginTop: 2,
    }
})