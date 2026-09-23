import { LocationIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import useWeatherData from '@/hooks/useWeatherData'
import { RootState } from '@/store/store'
import { WEATHER_IMAGE_MAP } from '@/utils/weatherConditions'
import { router } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, View } from 'react-native'
import { useSelector } from 'react-redux'
import LoadingList from '../../loadingList'
import Skelton from '../../Skelton'
import DetailLine from '../../text/detailLine'
import ThemeText from '../../text/ThemeText'

const WeatherBlock = () => {
    const theme = useTheme()
    const { t } = useTranslation()
    const { fetchWeatherDetails } = useWeatherData()

    const weatherData = useSelector((state: RootState) => state.weatherReport)

    const isFetching = !!weatherData?.fetching
    const hasData = !!weatherData?.data
    const isError = !isFetching && !hasData

    useEffect(() => {
        if (!hasData && !isFetching) {
            fetchWeatherDetails()
        }
    }, [])

    const current = weatherData?.data?.current
    const forecastToday = weatherData?.data?.forecast?.forecastday?.[0]?.day

    const temperature = useMemo(() => {
        if (current?.temp_c === undefined || current?.temp_c === null) return null
        return Math.round(current.temp_c)
    }, [current?.temp_c])

    useEffect(() => {
        if (weatherData.data?.lastUpdated == undefined)
            fetchWeatherDetails()
    }, [weatherData.data])

    return (
        <Pressable
            onPress={() => router.navigate('/weather')}
            style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 4,
                alignItems: 'center',
            }}>
            <DetailLine
                icon={LocationIcon}
                iconSize={16}
                iconColor={theme.text.primary}
                label={{
                    content: isFetching
                        ? t('weather.block.loading')
                        : isError
                            ? t('weather.block.errorLocation')
                            : `${weatherData?.data?.location?.name ?? t('weather.block.unknown')}`,
                    severity: 'main',
                    variant: 'xxs',
                    numberOfLines: 1,
                    ellipsizeMode: 'tail',
                }}
            />

            <View style={{ flex: 1, gap: 12 }}>
                <View style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                    {isFetching && <Skelton dimensions={{ height: 54, width: 72 }} />}
                    {hasData && !isFetching && (
                        <>
                            <ThemeText
                                content={`${temperature ?? 0}°`}
                                fontFamily="MontserratBlack"
                                size={36}
                                style={{ lineHeight: 36 }}
                            />
                            <ThemeText numberOfLines={2} content={`${current?.condition?.text ?? t('weather.block.unknown')}`} style={{ textAlign: 'center', }} />
                        </>
                    )}
                </View>
            </View>

            <View style={{ flex: 1.5 }}>
                {isFetching && <LoadingList count={4} height={12} />}
                {hasData && !isFetching && (
                    <>
                        <DetailLine
                            label={{ content: t('weather.block.humidity'), size: 10 }}
                            description={{ content: `${current?.humidity ?? t('weather.block.unknown')}%`, fontFamily: 'MontserratSemiBold', size: 10 }}
                        />
                        <DetailLine
                            label={{ content: t('weather.block.chanceOfRain'), size: 10 }}
                            description={{ content: `${forecastToday?.daily_chance_of_rain ?? t('weather.block.unknown')} %`, fontFamily: 'MontserratSemiBold', size: 10 }}
                        />
                        <DetailLine
                            label={{ content: t('weather.block.pressure'), size: 10 }}
                            description={{ content: `${current?.pressure_mb ?? t('weather.block.unknown')} hPa`, fontFamily: 'MontserratSemiBold', size: 10 }}
                        />
                        <DetailLine
                            label={{ content: t('weather.block.wind'), size: 10 }}
                            description={{ content: `${current?.wind_kph ?? t('weather.block.unknown')} km/h`, fontFamily: 'MontserratSemiBold', size: 10 }}
                        />
                    </>
                )}
            </View>

            {current?.condition?.code &&
                <Image
                    source={WEATHER_IMAGE_MAP[(current?.condition?.code || 1009) as keyof typeof WEATHER_IMAGE_MAP].long}
                    accessible={false}
                    importantForAccessibility="no"
                    style={{
                        position: 'absolute',
                        bottom: -8,
                        left: -8,
                        height: 40,
                        width: 150,
                        resizeMode: 'contain',
                        zIndex: -1,
                    }}
                />}
        </Pressable>
    )
}

export default WeatherBlock