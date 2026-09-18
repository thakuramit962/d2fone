import ScreenView from '@/components/basic/containers/screenView'
import WeatherDataCredit from '@/components/basic/pages/weather/WeatherDataCredit'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import useWeatherData from '@/hooks/useWeatherData'
import { RootState } from '@/store/store'
import dayjs from 'dayjs'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, RefreshControl, ScrollView, View } from 'react-native'
import { useSelector } from 'react-redux'

const WeatherForecast = () => {
    const theme = useTheme()
    const { t } = useTranslation()
    const scrollRef = useScrollToTop()

    const { fetchWeatherDetails } = useWeatherData()

    const weatherData = useSelector(
        (state: RootState) => state.weatherReport
    )

    const locationName = useMemo(
        () => `${weatherData.data?.location?.name ?? ''} ___`,
        [weatherData.data?.location?.name]
    )

    const forecastDays = weatherData.data?.forecast?.forecastday ?? []

    return (
        <ScreenView>
            <Header
                label={t('weather.forecast.title')}
                description={dayjs().format('dddd, DD MMM')}
                withoutTopPadding
            />

            <ScrollView
                ref={scrollRef}
                refreshControl={
                    <RefreshControl
                        refreshing={weatherData.fetching}
                        onRefresh={fetchWeatherDetails}
                    />
                }
                contentContainerStyle={{
                    padding: 16,
                }}
            >
                {weatherData?.fetching
                    ? <ThemeText content={t('weather.forecast.loadingData')} variant='xs' />
                    : (
                        <>
                            <ThemeText
                                content={locationName}
                                fontFamily="MontserratSemiBold"
                                variant="sm"
                            />

                            <ThemeText
                                content={t('weather.forecast.planFarming')}
                                severity="secondary"
                                variant="xs"
                            />

                            <ThemeDivider size={32} />

                            <View style={{ gap: 4 }}>
                                {forecastDays?.map((el) => {
                                    const showSpraySuggestion =
                                        Number(el.day.daily_chance_of_rain) < 30

                                    return (
                                        <View
                                            key={el.date}
                                            style={{
                                                borderRadius: 14,
                                                borderColor: `${theme.text.primary}25`,
                                                borderWidth: 1,
                                                padding: 4,
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                columnGap: 8,
                                                rowGap: 2,
                                            }}
                                        >
                                            <ThemeText
                                                content={dayjs(el.date).format('ddd')}
                                                fontFamily="MontserratBold"
                                                variant="xs"
                                                style={{
                                                    width: 60,
                                                    paddingLeft: 16,
                                                }}
                                            />

                                            <Image
                                                source={{
                                                    uri: `https:${el.day.condition.icon}`,
                                                }}
                                                style={{
                                                    height: 36,
                                                    width: 36,
                                                }}
                                            />

                                            <ThemeText
                                                content={`${el.day.avgtemp_c}`}
                                                variant="xs"
                                                fontFamily="MontserratSemiBold"
                                                style={{
                                                    width: 100,
                                                    textAlign: 'center',
                                                }}
                                            />

                                            <ThemeText
                                                content={el.day.condition.text}
                                                style={{ flex: 1 }}
                                                variant="xs"
                                                fontFamily="InterMedium"
                                            />

                                            {showSpraySuggestion && (
                                                <Pressable
                                                    onPress={() => router.navigate('/sprays/bookSpray')}
                                                    style={{
                                                        backgroundColor: `${theme.info}25`,
                                                        width: '100%',
                                                        borderRadius: 8,
                                                        paddingHorizontal: 8,
                                                        paddingVertical: 2,
                                                    }}
                                                >
                                                    <ThemeText
                                                        content={t('weather.forecast.suitableForSpray')}
                                                        severity="info"
                                                        fontFamily="MontserratSemiBold"
                                                        variant="xs"
                                                    />

                                                    <ThemeText
                                                        content={t('weather.forecast.pressToSchedule')}
                                                        variant="xxs"
                                                    />
                                                </Pressable>
                                            )}
                                        </View>
                                    )
                                })}
                            </View>

                            <WeatherDataCredit />
                        </>
                    )
                }
            </ScrollView>
        </ScreenView>
    )
}

export default WeatherForecast