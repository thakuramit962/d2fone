import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    Animated,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    View
} from 'react-native'

import ScreenView from '@/components/basic/containers/screenView'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { ForwardIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'

import { useTheme } from '@/hooks/use-theme'
import { useUserOrders } from '@/hooks/useUserOrders'

import PendingRequests from '@/components/basic/pages/services/sprays/pendingRequests/pendingRequests'
import { useSprayList } from '@/components/basic/pages/services/sprays/sprayList'
import ActionText from '@/components/basic/text/ActionText'
import { RootState } from '@/store/store'
import { router, useFocusEffect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'



const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const AnimatedFlatList = Animated.FlatList

const DroneSprays = () => {
    const theme = useTheme()
    const { fetchUserOrders } = useUserOrders()
    const { t } = useTranslation()
    const scrollRef = useRef<FlatList>(null)

    const orderList = useSelector((state: RootState) => state.userOrders.data)

    const fetched = useRef(false)
    const [refreshing, setRefreshing] = useState(false)

    const imageScale = useRef(new Animated.Value(0.8)).current
    const buttonScale = useRef(new Animated.Value(1)).current
    const scrollY = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (!fetched.current && !orderList?.length) {
            fetched.current = true
            fetchUserOrders()
        }
    }, [fetchUserOrders, orderList])

    const handleRefresh = useCallback(async () => {
        setRefreshing(true)
        try {
            await fetchUserOrders()
        } finally {
            setRefreshing(false)
        }
    }, [fetchUserOrders])

    const animatePressIn = () => {
        Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start()
    }

    const animatePressOut = () => {
        Animated.spring(buttonScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()
    }

    const HERO_HEIGHT = 280

    const heroTranslateY = scrollY.interpolate({
        inputRange: [0, HERO_HEIGHT],
        outputRange: [0, -HERO_HEIGHT * 0.55],
        extrapolate: 'clamp',
    })

    const heroScale = scrollY.interpolate({
        inputRange: [0, HERO_HEIGHT],
        outputRange: [1, 0.92],
        extrapolate: 'clamp',
    })

    const heroOpacity = scrollY.interpolate({
        inputRange: [0, HERO_HEIGHT * 0.5],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    })

    const headerTranslateY = scrollY.interpolate({
        inputRange: [120, 160],
        outputRange: [-15, 0],
        extrapolate: 'clamp',
    })

    const headerOpacity = scrollY.interpolate({
        inputRange: [140, 180],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    })

    const handleBookSpray = useCallback(() => {
        router.navigate('/sprays/bookSpray')
    }, [])

    // Pull list data/render logic out of SprayList so it can be
    // fed into THIS FlatList instead of nesting a second one.
    const { ListEmptyComponent, renderOrderItem } = useSprayList()

    const ListHeader = useCallback(() => (
        <>
            <Animated.View
                style={[
                    styles.hero,
                    {
                        backgroundColor: theme.background.slate,
                        opacity: heroOpacity,
                        transform: [{ translateY: heroTranslateY }, { scale: heroScale }],
                    },
                ]}
            >
                <Header />

                <View style={styles.heroRow}>
                    <View>
                        <ThemeText content={t('droneSprays.drone')} size={22} fontFamily="MontserratExtraBold" color="#3ea222" />
                        <ThemeText content={t('droneSprays.sprayServices')} size={16} fontFamily="MontserratBold" severity="main" />
                        <ThemeDivider size={8} />
                        <ThemeText
                            content={t('droneSprays.description')}
                            severity="secondary"
                            style={styles.description}
                        />
                        <ThemeDivider size={16} />
                        <AnimatedPressable
                            onPress={handleBookSpray}
                            onPressIn={animatePressIn}
                            onPressOut={animatePressOut}
                            style={{ transform: [{ scale: buttonScale }] }}
                        >
                            <LinearGradient
                                colors={[theme.text.primary, theme.text.secondary]}
                                style={styles.button}
                            >
                                <ThemeText
                                    content={t('droneSprays.bookSpray')}
                                    size={12} color={theme.background.main} fontFamily="MontserratSemiBold" />
                                <ForwardIcon size={18} color={theme.background.main} />
                            </LinearGradient>
                        </AnimatedPressable>
                    </View>

                    <Animated.Image
                        source={require('@/assets/images/static/services/droneSpray.png')}
                        style={[styles.image, { transform: [{ scale: imageScale }] }]}
                    />
                </View>

            </Animated.View>

            <ThemeDivider size={24} />

            <PendingRequests MAX_VISIBLE={5} />


            <View style={[styles.list, { backgroundColor: theme.background.main }]}>
                <ThemeText content={t('droneSprays.title')} fontFamily="MontserratSemiBold" variant="xs" />
            </View>
        </>
    ), [heroOpacity, heroTranslateY, heroScale, theme, buttonScale, imageScale, handleBookSpray])

    useFocusEffect(
        useCallback(() => {
            scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
        }, []),
    );


    return (
        <ScreenView edges={['bottom', 'left', 'right']}>
            <Animated.View
                pointerEvents="box-none"
                style={[
                    styles.floatingHeader,
                    {
                        opacity: headerOpacity,
                        transform: [{ translateY: headerTranslateY }],
                        backgroundColor: theme.background.main,
                    },
                ]}
            >
                <Header label={t('droneSprays.title')} rightSlot={<ActionText label="Book Spray" action={handleBookSpray} />} />
            </Animated.View>


            <AnimatedFlatList
                ref={scrollRef}
                data={orderList}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={ListEmptyComponent}
                ListHeaderComponent={ListHeader}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            />
        </ScreenView>
    )
}

export default DroneSprays

const styles = StyleSheet.create({
    hero: {
        height: 280,
    },
    floatingHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        elevation: 20,
    },
    heroRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    description: { maxWidth: 170 },
    button: {
        width: 125,
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: { width: 125, height: 125, resizeMode: 'contain' },
    content: { paddingBottom: 80, gap: 8, },
    list: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 28,
        paddingHorizontal: 16,
        borderCurve: 'continuous',
    },
})