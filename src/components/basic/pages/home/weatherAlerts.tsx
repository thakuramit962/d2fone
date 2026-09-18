import { AlertIcon, BackIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import useWeatherData from '@/hooks/useWeatherData'
import { WeatherAlert } from '@/models/weather'
import { RootState } from '@/store/store'
import { dimensions } from '@/utils/app-helper'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { ColorValue, FlatList, Pressable, View } from 'react-native'
import { useSelector } from 'react-redux'
import Skelton from '../../Skelton'
import ThemeText from '../../text/ThemeText'



const WeatherAlerts = () => {

    const theme = useTheme()
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
        <View
            style={{

            }}>
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={isFetching && weatherData?.data?.alerts?.alert?.length == 0 ? Array.from(Array(3)) : weatherData?.data?.alerts?.alert}
                renderItem={({ item, index }) => isFetching ? <Skelton dimensions={{ height: 48, width: dimensions.width * 0.65 }} /> : <DisaterAlertCard detail={item} key={index} />}
                horizontal
                contentContainerStyle={{
                    gap: 8,
                    paddingVertical: 8, paddingRight: 32,
                    alignItems: 'center'
                }}
                ListFooterComponent={<>
                    <Pressable
                        onPress={() => router.navigate('/weather/disaterAlerts')}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: `${theme.info}25`,
                            padding: 12,
                            alignSelf: 'center',
                            borderRadius: 16,
                        }}>
                        <BackIcon size={16} style={{
                            transform: [
                                { scaleX: -1 }
                            ]
                        }} />
                    </Pressable>
                </>}
            />
        </View>
    )
}

export default WeatherAlerts





const DisaterAlertCard = ({ detail }: { detail: WeatherAlert }) => {

    const theme = useTheme()

    const SEVERITY_CONFIG: Record<string, { color: ColorValue | undefined }> = {
        Extreme: { color: theme.error },
        Severe: { color: theme.warning },
        Moderate: { color: theme.info },
        Minor: { color: theme.warning },
        Unknown: { color: theme.text.secondary },
    };

    function getSeverityConfig(severity: string) {
        const key = Object.keys(SEVERITY_CONFIG).find(
            (k) => k.toLowerCase() === severity?.trim().toLowerCase()
        );
        return SEVERITY_CONFIG[key ?? 'Unknown'];
    }

    const severity = getSeverityConfig(detail.severity);


    return (
        <Pressable
            onPress={() => router.navigate({
                pathname: '/weather/disaterAlerts/[id]',
                params: {
                    id: detail?.identifier
                }
            })}
            style={{
                backgroundColor: `${String(severity.color ?? '')}20`,
                borderRadius: 16,
                borderCurve: 'continuous',
                paddingVertical: 4, paddingHorizontal: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                width: dimensions.width * 0.65,
                justifyContent: 'space-between'
            }}>
            <AlertIcon color={severity.color} height={32} width={32} />
            <View style={{
                flex: 1
            }}>
                <ThemeText
                    content={detail.event}
                    size={12} fontFamily='InterBold'
                />
                <ThemeText
                    content={detail.headline}
                    numberOfLines={2} ellipsizeMode='tail'
                    style={{

                    }}
                />
            </View>
        </Pressable>
    )
}