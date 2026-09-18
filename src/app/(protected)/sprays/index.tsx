import CompanyFooter from '@/components/basic/companyFooter'
import ScreenView from '@/components/basic/containers/screenView'
import ServiceCtaCard from '@/components/basic/pages/services/serviceCtaCard'
import ServiceGrid from '@/components/basic/pages/services/serviceOptionCard'
import SupportCard from '@/components/basic/supportCard'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { ExploreServiceIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import { useEntranceAnimation } from '@/hooks/useEntranceAnimation'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { dimensions } from '@/utils/app-helper'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Image, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const illus = require('@/assets/images/static/farmingIllustration.png')
const droneSpray = require('@/assets/images/static/services/droneSpray.png')

// ─── Stagger timing (ms) ──────────────────────────────────────────────────────
const S = 80 // base stagger unit

const HeroSection = memo(() => {

    const { t } = useTranslation()

    const { fadeAnim, motionAnim } = useEntranceAnimation({
        slideDirection: 'down',   // slides in from above
        initialOffset: 28,
    })

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: motionAnim }] }}>
            <ImageBackground
                source={illus}
                resizeMode="contain"
                style={{ paddingHorizontal: 16, minHeight: 200 }}
            >
                <Text>
                    <ThemeText content={t('servicesHome.hero.our')} fontFamily="MontserratBold" size={18} style={{ lineHeight: 20 }} />
                    <ThemeText content={t('servicesHome.hero.services')} fontFamily="MontserratBold" size={18} style={{ lineHeight: 20 }} severity="primary" />
                </Text>
                <ThemeText content={t('servicesHome.hero.subtitle')} fontFamily="InterRegular" size={13} severity="secondary" />
            </ImageBackground>
        </Animated.View>
    )
})

const SectionHeader = memo(() => {
    const { fadeAnim, motionAnim } = useEntranceAnimation({ delay: S * 2 })
    const { t } = useTranslation()

    return (
        <Animated.View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 8,
                marginVertical: 16,
                opacity: fadeAnim,
                transform: [{ translateY: motionAnim }],
            }}
        >
            <ExploreServiceIcon />
            <ThemeText content={t('servicesHome.sprayServices')} fontFamily="MontserratSemiBold" size={14} />
        </Animated.View>
    )
})

const AnimatedGrid = memo(({ theme }: { theme: ReturnType<typeof useTheme> }) => {

    const { t } = useTranslation()

    const { fadeAnim, motionAnim } = useEntranceAnimation({
        delay: S * 3,
        effect: 'scale',
        initialOffset: 4,     // → starts at scale 0.96
        tension: 60,
        friction: 9,
    })

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: motionAnim }], gap: 16 }}>
            <>

                <Pressable
                    onPress={() =>
                        router.navigate('/sprays/droneSprays')
                    }
                    style={[
                        {
                            borderColor: `${theme.text.primary}25`,
                            minWidth: '90%',
                            borderRadius: 24,
                            borderWidth: 1,
                            padding: 16,
                            borderCurve: 'continuous',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            flex: 1,
                            gap: 16,
                            paddingVertical: 16,
                        },
                    ]}
                >
                    <Image
                        source={droneSpray}
                        style={{
                            height: 72,
                            width: 72,
                            resizeMode: 'contain',
                        }}
                    />
                    <View style={{
                        flex: 1
                    }}>
                        <ThemeText
                            content={t('servicesHome.droneSpray.title')}
                            fontFamily="MontserratSemiBold"
                            variant='xs'
                        />
                        <ThemeText
                            content={t('servicesHome.droneSpray.description')}
                            severity="secondary"
                        />
                        <ThemeDivider size={16} />

                        <Pressable
                            onPress={() => router.navigate('/sprays/bookSpray')}
                            style={{
                                backgroundColor: theme.text.primary,
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'flex-start',
                            }}>
                            <ThemeText
                                content={t('servicesHome.droneSpray.bookNow')}
                                color={theme.background.main} fontFamily='MontserratSemiBold' variant='xxs' />
                        </Pressable>
                    </View>

                </Pressable>
            </>

            <ServiceGrid theme={theme} />
        </Animated.View>
    )
})

const FooterPanel = memo(({ theme }: { theme: ReturnType<typeof useTheme> }) => {
    const { fadeAnim, motionAnim } = useEntranceAnimation({
        delay: S * 4,
        tension: 55,
    })

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: motionAnim }],
            }}
        >
            <LinearGradient colors={[`${theme.background.slate}`, `${theme.background.main}`]}
                style={{
                    borderTopRightRadius: 24,
                    borderTopLeftRadius: 24,
                    paddingTop: 48,
                    paddingHorizontal: 8,
                    marginHorizontal: -16,
                    minHeight: 500,
                }}>

                <ServiceCtaCard />
                <ThemeDivider size={24} />
                <CompanyFooter />

            </LinearGradient>
        </Animated.View>
    )
})


const FloatingSupportCard = memo(({ bottom }: { bottom: number }) => {
    const { motionAnim } = useEntranceAnimation({
        delay: S * 5,
        effect: 'swipeUp',
        initialOffset: 140,   // starts 140px below resting position
        tension: 52,
        friction: 11,
    })

    return (
        <Animated.View
            style={{
                position: 'absolute',
                bottom: bottom + 24,
                left: 0,
                right: 0,
                padding: 12,
                width: dimensions.width,
                transform: [{ translateY: motionAnim }],
            }}
        >
            <SupportCard />
        </Animated.View>
    )
})

// ─── Main screen ──────────────────────────────────────────────────────────────

const ServicesHome = () => {
    const theme = useTheme()
    const { bottom } = useSafeAreaInsets()
    const scrollRef = useScrollToTop()
    const { t } = useTranslation()

    return (
        <>
            <ScreenView edges={['bottom', 'left', 'right']}>
                <Header bg={theme.background.main} />
                <ScrollView
                    ref={scrollRef}
                    style={{ backgroundColor: theme.background.main }}
                    contentContainerStyle={{ padding: 16, paddingTop: 0 }}
                    showsVerticalScrollIndicator={false}
                    overScrollMode="never"
                    bounces={false}
                    removeClippedSubviews
                >
                    <HeroSection />
                    <SectionHeader />
                    <AnimatedGrid theme={theme} />

                    <ThemeDivider size={16} />

                    <Pressable
                        onPress={() => router.navigate('/sprays/mySprays')}
                        style={{
                            backgroundColor: `${theme.text.primary}10`,
                            height: 56,
                            borderRadius: 24,
                            borderCurve: 'continuous',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'stretch',
                        }}>
                        <ThemeText content={t('servicesHome.viewBookedServices')} fontFamily='MontserratSemiBold' size={14} severity='main' />
                    </Pressable>

                    <ThemeDivider size={42} />
                    <FooterPanel theme={theme} />
                </ScrollView>
            </ScreenView>

            <FloatingSupportCard bottom={bottom} />
        </>
    )
}

export default memo(ServicesHome)