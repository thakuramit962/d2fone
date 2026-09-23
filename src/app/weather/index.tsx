import ScreenView from '@/components/basic/containers/screenView'
import { AirPressureIcon, RainIcon, WaterDropletIcon, WindIcon } from '@/components/basic/pages/weather/icons'
import WeatherDataCredit from '@/components/basic/pages/weather/WeatherDataCredit'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { LocationFilledIcon, WarningIcon } from '@/components/icons'
import BackButton from '@/components/layout/navigation/BackButton'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import useWeatherData from '@/hooks/useWeatherData'
import { RootState } from '@/store/store'
import { dimensions } from '@/utils/app-helper'
import { WEATHER_IMAGE_MAP } from '@/utils/weatherConditions'
import dayjs from 'dayjs'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, RefreshControl, ScrollView, View } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { shallowEqual, useSelector } from 'react-redux'

const Weather = () => {
    const scrollRef = useScrollToTop()
    const { t } = useTranslation()
    const { fetchWeatherDetails } = useWeatherData()

    const weatherData = useSelector((state: RootState) => state.weatherReport, shallowEqual)

    const isFetching = !!weatherData?.fetching
    const hasData = !!weatherData?.data
    const isError = !isFetching && !hasData

    const current = weatherData.data?.current;
    const forecastDay = weatherData.data?.forecast?.forecastday?.[0];

    const weatherImage = WEATHER_IMAGE_MAP[current?.condition?.code as keyof typeof WEATHER_IMAGE_MAP] ?? WEATHER_IMAGE_MAP[1009];

    const showSprayAlert = useMemo(
        () =>
            weatherData.data?.forecast?.forecastday?.some(
                day => day.day.daily_chance_of_rain > 50
            ) ?? false,
        [weatherData.data]
    );

    const weatherDetails = [
        {
            icon: WaterDropletIcon,
            label: t('weather.block.humidity'),
            val: `${current?.humidity} %`,
        },
        {
            icon: WindIcon,
            label: t('weather.block.wind'),
            val: `${current?.wind_kph} km/h`,
        },
        {
            icon: RainIcon,
            label: t('weather.screen.rainChances'),
            val: `${forecastDay?.day.daily_chance_of_rain} %`,
        },
        {
            icon: AirPressureIcon,
            label: t('weather.screen.airPressure'),
            val: `${current?.pressure_mb}`,
        },
    ];

    const handleRefresh = useCallback(() => {
        fetchWeatherDetails();
    }, [fetchWeatherDetails]);

    useEffect(() => {
        if (!weatherData.data)
            handleRefresh()
    }, [weatherData.data])

    if (isError) {
        return (
            <View style={{
                flex: 1, alignItems: 'center', justifyContent: 'center'
            }}>
                <ActionText
                    label={t('weather.screen.unableToFetch')}
                    action={fetchWeatherDetails}
                />
            </View>
        );
    }

    return (
        <ScreenView>
            <ScrollView
                ref={scrollRef}
                refreshControl={<RefreshControl
                    onRefresh={handleRefresh}
                    refreshing={isFetching}
                />}
            >

                <LinearGradient colors={['#dcf1ff', '#87addc']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{
                        borderRadius: 32,
                        padding: 16,
                        margin: 4,
                        minHeight: 550,
                        paddingBottom: 94,

                    }}>
                    <View style={{
                        flexDirection: 'row',
                        gap: 8,
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <BackButton />
                        <ThemeText content={dayjs().format('ddd, DD MMM')} variant='xs' fontFamily='MontserratMedium' />
                    </View>

                    <View style={{
                        alignItems: "center",
                        gap: 2,
                        paddingVertical: 8,
                    }}>
                        <View style={{
                            alignItems: "center",
                            justifyContent: 'center',
                            gap: 4,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: 'center',
                                gap: 4,
                            }}>
                                <LocationFilledIcon height={10} width={10} color={'#595959'} />
                                <ThemeText content={t('weather.screen.currentLocation')} color={'#595959'} />
                            </View>
                            <ThemeText
                                content={`${weatherData?.data?.location?.name}`}
                                style={{ maxWidth: 220, textAlign: 'center' }}
                                variant='xs' fontFamily='MontserratSemiBold' color='#106DA3' />
                        </View>
                        <ThemeText
                            content={isFetching ? t('weather.screen.fetchingInfo') : (weatherData.data?.lastUpdated ? t('weather.screen.updated', { time: weatherData.data?.lastUpdated }) : t('weather.screen.pleaseRefresh'))}
                            variant='xxs' color='#595959'
                            style={{
                                borderWidth: 0.75,
                                paddingHorizontal: 6,
                                borderRadius: 8,
                                borderColor: '#595959'
                            }}
                        />
                    </View>

                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        marginRight: -14,
                    }}>
                        <View style={{
                            flex: 2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ThemeText
                                content={`${Math.round(current?.temp_c ?? 0)}°`}
                                size={72}
                                style={{
                                    lineHeight: 72,
                                    textShadowColor: '#838383',
                                    textShadowOffset: {
                                        height: 1, width: 1
                                    },
                                }} fontFamily='MontserratBold' color='#ffffff' />
                            <ThemeText content={current?.condition.text ?? ''} size={16} fontFamily='InterMedium' color='#117DBC' />
                            <ThemeDivider size={8} />
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                width: 120,
                            }}>
                                <LinearGradient
                                    colors={['#ffffff', '#ff6200']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        height: 1.5,
                                        width: 120,
                                        borderRadius: 4,
                                    }}
                                />
                                <ThemeText content={String(forecastDay?.day.mintemp_c)} size={11} fontFamily='InterMedium' />
                                <ThemeText content={String(forecastDay?.day.maxtemp_c)} size={11} fontFamily='InterMedium' />
                            </View>
                        </View>
                        <Image
                            source={weatherImage?.square}
                            style={{
                                height: 200,
                                width: 200,
                                resizeMode: 'contain',
                            }}
                        />
                    </View>

                    {showSprayAlert && <SprayAlet />}

                </LinearGradient>

                <View style={{
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                    marginTop: -84,
                    maxWidth: 440,
                    paddingHorizontal: 16,
                    marginHorizontal: 'auto'
                }}>
                    {weatherDetails.map(item => (
                        <WeatherDetailItem
                            key={item.label}
                            {...item}
                        />
                    ))}

                </View>

                <ThemeDivider size={64} />

                <Pressable
                    onPress={() => router.navigate('/weather/weatherForecast')}
                    style={{
                        borderRadius: 16,
                        borderCurve: 'continuous',
                        borderWidth: 1,
                        borderColor: '#1BA1FA',
                        padding: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: dimensions.width * 0.9 >= 370 ? 370 : dimensions.width * 0.9,
                        marginHorizontal: 'auto'
                    }}>
                    <ThemeText content={t('weather.screen.weatherOnHorizon')} fontFamily='MontserratSemiBold' size={12} color={'#1BA1FA'} />
                </Pressable>

                <WeatherDataCredit />
            </ScrollView>

        </ScreenView>
    )
}

export default Weather

interface WeatherDetailItemProps {
    icon: React.FC<SvgProps>
    label: string
    val: string
}

const WeatherDetailItem = memo(({ icon: Icon, label, val }: WeatherDetailItemProps) => {
    return (
        <>
            <LinearGradient
                colors={['#ffffff', '#93C7E5']}
                style={{
                    borderRadius: 16,
                    borderCurve: 'continuous',
                    overflow: 'hidden',
                    padding: 1,
                    flex: 1,
                }}>
                <LinearGradient
                    colors={['#ffffff', '#ECF8FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        borderRadius: 15,
                        borderCurve: 'continuous',
                        flex: 1,
                        paddingHorizontal: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <ThemeDivider size={16} />
                    <Icon height={36} width={36} color={'#373737'} />
                    <ThemeDivider size={16} />
                    <ThemeText content={val} fontFamily='InterBold' size={12} color='#232323' style={{ textAlign: 'center', lineHeight: 16 }} />
                    <ThemeText content={label} size={12} color='#232323' style={{ textAlign: 'center', lineHeight: 16 }} />
                    <ThemeDivider size={12} />
                </LinearGradient>
            </LinearGradient>
        </>
    )
})

const SprayAlet = memo(() => {
    const { t } = useTranslation()
    return (
        <View
            style={{
                borderRadius: 16,
                borderLeftWidth: 6,
                borderColor: '#FFB700',
                backgroundColor: '#FFF8E6',
                alignSelf: 'stretch',
                height: 48,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 16,
            }}>
            <WarningIcon color={'#D27E00'} height={28} width={28} />
            <View style={{ flex: 1 }}>
                <ThemeText
                    content={t('weather.screen.sprayAlert')}
                    size={12} color='#3C2D00' />
            </View>
        </View>
    )
})