import ScreenView from '@/components/basic/containers/screenView'
import Header from '@/components/layout/navigation/Header'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

import IconButton from '@/components/basic/buttons/IconButton'
import CompanyFooter from '@/components/basic/companyFooter'
import LoadingScreen from '@/components/basic/containers/loadingScreen'
import { useFeatureNudge } from '@/components/basic/ctaPopup/useFeatureNudge'
import ExitPrompt from '@/components/basic/exitPrompt'
import HomeCta from '@/components/basic/homeCta'
import ModernDetailItem from '@/components/basic/modernDetailItem'
import { ECommerceIcon, UserIcon } from '@/components/basic/pages/explorePage/icon'
import Chipfeatures from '@/components/basic/pages/home/chipfeatures'
import FeaturedTools from '@/components/basic/pages/home/featuredTools'
import LocationCta from '@/components/basic/permissions/locationCta'
import Skelton from '@/components/basic/Skelton'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { DroneDualIcon, HomeIcon, LanguageTranslationIcon, NotificationIcon, StarsIcon, TractorIcon } from '@/components/icons'
import { APP_VERSION } from '@/constants/appConstant'
import useAppVersion from '@/hooks/use-appVersion'
import { useTheme } from '@/hooks/use-theme'
import useLanguage from '@/hooks/useLanguage'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import useWeatherData from '@/hooks/useWeatherData'
import { dimensions } from '@/utils/app-helper'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BackHandler, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


const UserGreeting = lazy(() => import('@/components/basic/pages/home/userGreeting'))
const AddReferralDrawer = lazy(() => import('@/components/basic/pages/addReferralDrawer'))
const BlogTypeCommunityPosts = lazy(() => import('@/components/basic/pages/chaupal/blogTypeCommunityPosts'))
const News = lazy(() => import('@/components/basic/pages/news'))
const WeatherBlock = lazy(() => import('@/components/basic/pages/home/weatherBlock'))
const WeatherAlerts = lazy(() => import('@/components/basic/pages/home/weatherAlerts'))
const LocationDetails = lazy(() => import('@/components/basic/user/locationDetails'))
const NotificationCta = lazy(() => import('@/components/basic/permissions/notificationCta'))


const CARD_WIDTH = (dimensions.width / 2) - 20


const Home = () => {


    const theme = useTheme()
    const { top } = useSafeAreaInsets()
    const { checkUpdate, version, checking } = useAppVersion()
    const { newUser } = useLocalSearchParams()
    const { languageOptions } = useLanguage()
    const scrollRef = useScrollToTop()

    const language = useSelector((state: RootState) => state?.appSlice.language)
    const user = useSelector((state: RootState) => state?.auth)
    const { activePopup, handleClose, handleAction } = useFeatureNudge({ dwellTime: 10000 });
    const weatherData = useSelector((state: RootState) => state.weatherReport)

    const { t } = useTranslation()


    const [exitPrompt, setExitPrompt] = useState(false)

    const { fetchWeatherDetails } = useWeatherData()
    const reloadPage = useCallback(() => {
        fetchWeatherDetails()
        checkUpdate()
    }, [])


    useEffect(() => {
        checkUpdate()
    }, [])

    useEffect(() => {
        if (!checking && version != APP_VERSION) {
            router.navigate('/checkUpdate');
        }
        checkUpdate()
    }, [version])



    useFocusEffect(
        React.useCallback(() => {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                setExitPrompt(!exitPrompt)
                return true
            });
            return () => backHandler.remove()
        }, [])
    );

    return (
        <React.Fragment>
            <ScreenView bg={theme.background.slate}>
                <Header
                    withoutTopPadding
                    bg={'transparent'}
                    backIcon={false}
                    bottomSlot={
                        <>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 8,
                            }}>
                                <Suspense fallback={<Skelton dimensions={{ height: 42, width: 180 }} />}>
                                    <UserGreeting />
                                </Suspense>

                                <View style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    gap: 6,
                                }}>
                                    <IconButton size={32} withoutBg icon={<NotificationIcon />} onPress={() => router.navigate('/myNotifications')} />

                                    <Pressable
                                        onPress={() => router.navigate('/chooseLanguage')}
                                        style={{
                                            height: 28,
                                            // width: 24,
                                            borderRadius: 16,
                                            borderWidth: 1.5,
                                            borderColor: theme.text.disabled,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexDirection: "row",
                                            gap: 4,
                                            padding: 2,
                                            // backgroundColor: theme.text.primary,
                                            paddingRight: 12, paddingLeft: 2,
                                        }}>
                                        <View style={{
                                            borderRadius: 12,
                                            padding: 2,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: `${theme.text.primary}20`,
                                        }}>
                                            <LanguageTranslationIcon size={18} color={theme.background.main} />
                                        </View>
                                        <ThemeText variant='xs' fontFamily='InterSemiBold' content={languageOptions.find((el) => el.value == language)?.label ?? ''} />
                                    </Pressable>
                                </View>
                            </View>
                        </>
                    }
                />
                <ScrollView
                    ref={scrollRef}
                    refreshControl={<RefreshControl
                        onRefresh={reloadPage}
                        refreshing={false}
                    />}
                    contentContainerStyle={{
                        backgroundColor: theme.background.slate

                    }}>
                    <View style={{
                        paddingHorizontal: 8,
                    }}>

                        <View style={{
                            flexDirection: 'row',
                            gap: 8,
                            alignItems: 'stretch',
                            justifyContent: 'space-between',
                        }}>
                            <View style={[
                                style.borderedBox,
                                {
                                    flex: 1,
                                    borderColor: `${theme.info}25`,
                                    padding: 8,
                                    overflow: 'hidden'
                                }
                            ]}>
                                <Suspense fallback={<Skelton dimensions={{ height: 90 }} />}>
                                    <WeatherBlock />
                                </Suspense>
                            </View>

                            <Pressable
                                onPress={() => router.navigate('/myFarms')}
                                style={[
                                    style.borderedBox,
                                    {
                                        width: 96,
                                        minHeight: 96,
                                        borderColor: `${theme.text.primary}`,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 4,
                                        padding: 8
                                    }
                                ]}>
                                <TractorIcon size={38} />
                                <ThemeText content={t('home.myFarms')} fontFamily='MontserratSemiBold' variant='xs' />
                            </Pressable>

                        </View>
                        {(weatherData?.data?.alerts?.alert && weatherData?.data?.alerts?.alert?.length > 0) &&
                            <Suspense fallback={<Skelton dimensions={{ height: 48 }} />}>
                                <WeatherAlerts />
                            </Suspense>
                        }

                    </View>
                    <LocationCta />
                    <ThemeDivider size={16} />
                    <HomeCta />

                    <ThemeDivider size={16} />
                    <LinearGradient
                        colors={[theme.background.main, theme.background.slate]}
                        style={{
                            paddingHorizontal: 8,
                            borderTopRightRadius: 24,
                            borderTopLeftRadius: 24,
                            paddingBottom: 24, paddingTop: 8,
                        }}>

                        <ModernDetailItem
                            iconColor={theme.primary}
                            bg={'transparent'}
                            iconOpacity={1}
                            iconSize={32}
                            icon={StarsIcon}
                            label={{ content: t('home.smartServices.label'), variant: 'xs', fontFamily: 'MontserratSemiBold', severity: 'main', }}
                            description={{
                                content: t('home.smartServices.title'),
                                fontFamily: 'MontserratBold',
                                severity: 'primary',
                                variant: 'sm',
                                style: {
                                    marginTop: -2
                                }
                            }}
                        />


                        <ThemeDivider size={12} />

                        <FeaturedTools />

                        <ThemeDivider size={24} />
                        <ModernDetailItem
                            iconColor={theme.text.primary}
                            bg={'transparent'}
                            iconOpacity={1}
                            iconSize={20}
                            icon={HomeIcon}
                            description={{
                                content: t('home.recommendedForYou'),
                                variant: 'sm'
                            }}
                        />
                        <View style={{
                            gap: 16,
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}>
                            <View style={{ width: CARD_WIDTH }}>
                                <ModernDetailItem
                                    onPress={() => router.navigate('/sprays')}
                                    actionIcon={<></>}
                                    borderRadius={24}
                                    containerStyle={{
                                        borderColor: `${theme.text.primary}25`,
                                        borderWidth: 1,
                                        padding: 8,
                                    }}
                                    iconSize={32}
                                    iconOpacity={1}
                                    icon={DroneDualIcon}
                                    seperateChild
                                >
                                    <ThemeText
                                        content={t('home.cards.precisionSpraying.title')}
                                        fontFamily="InterBold"
                                        variant="xs"
                                    />
                                    <ThemeText
                                        content={t('home.cards.precisionSpraying.description')}
                                        fontFamily="InterRegular"
                                        variant="xxs"
                                        severity="secondary"
                                        numberOfLines={3}
                                        ellipsizeMode="tail"
                                    />
                                </ModernDetailItem>
                            </View>
                            <View style={{ width: CARD_WIDTH }}>
                                <ModernDetailItem
                                    onPress={() => router.navigate('/eCom')}
                                    actionIcon={<></>}
                                    borderRadius={24}
                                    containerStyle={{
                                        borderColor: `${theme.text.primary}25`,
                                        borderWidth: 1,
                                        paddingBottom: 12,
                                        padding: 8
                                    }}
                                    iconSize={32}
                                    iconOpacity={1}
                                    icon={ECommerceIcon}
                                    seperateChild
                                >
                                    <ThemeText
                                        content={t('home.cards.exploreProducts.title')}
                                        fontFamily="InterBold"
                                        variant="xs"
                                    />
                                    <ThemeText
                                        content={t('home.cards.exploreProducts.description')}
                                        fontFamily="InterRegular"
                                        variant="xxs"
                                        severity="secondary"
                                        numberOfLines={3}
                                        ellipsizeMode="tail"
                                    />
                                </ModernDetailItem>
                            </View>
                        </View>

                        <ThemeDivider size={12} />
                        <Chipfeatures />


                        <ThemeDivider size={24} />

                        <ModernDetailItem
                            iconColor={theme.text.primary}
                            iconOpacity={1}
                            iconSize={20}
                            icon={UserIcon}
                            bg={'transparent'}
                            description={{
                                content: t('home.trendingTopics'),
                                variant: 'xs'
                            }}
                        />
                        <View style={{ gap: 8 }}>
                            <Suspense fallback={<Skelton dimensions={{ height: 270, radius: 24 }} />}>
                                <BlogTypeCommunityPosts />
                            </Suspense>
                        </View>

                        <View
                            style={{
                                marginHorizontal: -16,
                            }}>
                            <Suspense fallback={<Skelton dimensions={{ height: 82 }} />}>
                                <News horizontal />
                            </Suspense>
                        </View>

                        {/* <ThemeDivider size={48} />
                        <Suspense fallback={<Skelton dimensions={{ height: 160, radius: 24 }} />}>
                            <ViewFeedbacksCTA />
                        </Suspense> */}

                    </LinearGradient>

                    <CompanyFooter bg={'transparent'} />
                </ScrollView>

            </ScreenView>

            {checking &&
                <View style={[style.loadingChip, {
                    top: top
                }]}>
                    <ThemeText content={t('home.checkingUpdate')} />
                </View>
            }

            {/* <CtaPopup
                popup={activePopup}
                onClose={handleClose}
                onAction={handleAction}
            /> */}

            {(newUser && newUser == 'yes') &&
                <Suspense fallback={<LoadingScreen />}>
                    <AddReferralDrawer
                        visible={(newUser && newUser == 'yes')}
                        onClose={() => router.replace('/tabs/home')}
                    />
                </Suspense>
            }

            <ExitPrompt visible={exitPrompt} onClose={() => setExitPrompt(false)} />

            <Suspense fallback={null}>
                <LocationDetails small />
            </Suspense>

            <Suspense fallback={null}>
                <NotificationCta />
            </Suspense>

        </React.Fragment>
    )
}

export default Home


const style = StyleSheet.create({
    container: {
        padding: 16,
    },
    borderedBox: {
        borderRadius: 24,
        borderWidth: 1,
        borderCurve: 'continuous',
    },
    loadingChip: {
        position: 'absolute',
        backgroundColor: '#865b0020',
        alignSelf: 'center',
        borderRadius: 10,
        paddingHorizontal: 16, paddingVertical: 6,
    }
})