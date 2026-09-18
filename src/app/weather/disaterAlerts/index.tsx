import ScreenView from '@/components/basic/containers/screenView'
import LoadingList from '@/components/basic/loadingList'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeChip from '@/components/basic/ThemeChip'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { LocationFilledIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import useWeatherData from '@/hooks/useWeatherData'
import { WeatherAlert } from '@/models/weather'
import { RootState } from '@/store/store'
import { getSeverityColor } from '@/utils/commonUtils'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, Pressable, RefreshControl, View } from 'react-native'
import { useSelector } from 'react-redux'

const DisaterAlerts = () => {
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

    return (
        <ScreenView>
            <Header label={t('weather.alerts.title')} withoutTopPadding />

            {isError
                ? <>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        paddingTop: 160
                    }}>
                        <Image
                            source={require('@/assets/images/static/no-data.png')}
                            style={{
                                height: 160,
                                width: 160,
                                resizeMode: 'contain'
                            }} />
                        <ThemeText variant='xs' content={weatherData.errorMessage ?? t('weather.alerts.errorFallback')} />
                        <ThemeDivider size={12} />
                        <ActionText label={t('weather.alerts.refreshPage')} action={fetchWeatherDetails} withIcon={false} />
                    </View>
                </>
                : <FlatList
                    refreshControl={<RefreshControl
                        onRefresh={fetchWeatherDetails}
                        refreshing={isFetching}
                    />}
                    showsHorizontalScrollIndicator={false}
                    data={isFetching && weatherData?.data?.alerts?.alert?.length == 0 ? Array.from(Array(2)) : weatherData?.data?.alerts?.alert}
                    renderItem={({ item, index }: { item: WeatherAlert, index: number }) =>
                        isFetching
                            ? <LoadingList count={1} height={200} />
                            : <>
                                <Pressable
                                    onPress={() => router.navigate({
                                        pathname: '/weather/disaterAlerts/[id]',
                                        params: {
                                            id: item?.identifier
                                        }
                                    })}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: `${theme.text.primary}25`,
                                        borderRadius: 16,
                                        padding: 12
                                    }}
                                >
                                    <ThemeChip label={item.severity} containerStyle={{ alignSelf: 'flex-start' }} color={String(getSeverityColor(item.severity, theme))} />
                                    <ThemeText content={item.event} fontFamily='MontserratSemiBold' size={14} />
                                    <ThemeText content={item.headline} variant='xs' />
                                    <View style={{
                                        flexDirection: 'row', gap: 6, alignItems: 'center',
                                        paddingTop: 8,
                                    }}>
                                        <LocationFilledIcon color={theme.text.disabled} size={14} />
                                        <ThemeText content={item.areas} size={12} severity='secondary' />
                                    </View>
                                </Pressable>
                            </>
                    }
                    contentContainerStyle={{
                        gap: 8,
                        padding: 16,
                    }}
                />}

        </ScreenView>
    )
}

export default DisaterAlerts