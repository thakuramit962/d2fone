import { LinearGradient } from 'expo-linear-gradient'
import React, { memo } from 'react'
import {
    Image,
    Pressable,
    StyleSheet,
    View,
    type ViewStyle,
} from 'react-native'

import { dimensions } from '@/utils/app-helper'
import { router } from 'expo-router'
import ThemeText from './text/ThemeText'

interface ViewFeedbacksCTAProps {
    onPress?: () => void
    style?: ViewStyle
}

const GRADIENT_START = { x: 0.2, y: 1 } as const
const GRADIENT_END = { x: 1, y: 1 } as const

const ViewFeedbacksCTA: React.FC<ViewFeedbacksCTAProps> = ({
    onPress,
    style,
}) => {
    return (
        <LinearGradient
            colors={['#F2F6FF', '#D2F0D8']}
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={[styles.container, style]}
        >
            <Image
                source={require('@/assets/images/static/feedback.png')}
                style={styles.image}
                accessibilityIgnoresInvertColors
            />

            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <ThemeText
                        content="Stories of "
                        color="#428097"
                        fontFamily="MontserratSemiBold"
                        size={20}
                    />

                    <ThemeText
                        content="Success"
                        color="#3C5070"
                        fontFamily="MontserratBold"
                        size={20}
                    />
                </View>

                <ThemeText
                    content="See how regional farmers are doubling production and cutting input costs using precision technology"
                    color="#626060"
                    variant='xxs'
                    style={styles.description}
                />

                <Pressable
                    onPress={() => router.navigate('/feedbacks')}
                    accessibilityRole="button"
                    accessibilityLabel="Watch success stories"
                    hitSlop={8}
                    style={({ pressed }) => [
                        styles.pressable,
                        pressed && styles.pressed,
                    ]}
                >
                    <LinearGradient
                        colors={['#498C9D', '#75B5B7']}
                        start={GRADIENT_START}
                        end={GRADIENT_END}
                        style={styles.button}
                    >
                        <ThemeText
                            content="Watch Stories"
                            color="#FFFFFF"
                            fontFamily="InterSemiBold"
                            variant="sm"
                        />
                    </LinearGradient>
                </Pressable>
            </View>
        </LinearGradient>
    )
}

export default memo(ViewFeedbacksCTA)

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 16,
        paddingLeft: 24,
        minHeight: 160,
        overflow: 'hidden',
    },

    content: {
        flex: 1,
        zIndex: 1,
    },

    titleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    description: {
        maxWidth: dimensions.width * 0.5,
        lineHeight: 14,
    },

    image: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 170,
        height: 135,
        resizeMode: 'contain',
    },

    pressable: {
        alignSelf: 'flex-start',
        marginTop: 24,
    },

    pressed: {
        opacity: 0.9,
    },

    button: {
        minWidth: 140,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
})