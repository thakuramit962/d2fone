import { CurrentLocationIcon } from '@/components/icons'
import * as Location from 'expo-location'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import ThemeText from '../text/ThemeText'
import { MAP_VIEW_HEIGHT } from './locationUtils'

export interface MapRegion {
    latitude: number
    longitude: number
    zoom: number
}

export interface LocationData {
    latitude: number
    longitude: number
    region: MapRegion
    address?: string
    city?: string
    district?: string
    state?: string
    country?: string
    postalCode?: string
}

interface LocationPickerProps {
    initialRegion?: MapRegion
    onLocationChange?: (location: LocationData) => void
}

const DEFAULT_REGION: MapRegion = {
    latitude: 28.4595,
    longitude: 77.0266,
    zoom: 15,
}

export default function LocationPicker({ initialRegion = DEFAULT_REGION, onLocationChange, }: LocationPickerProps) {

    const mapRef = useRef<MapView>(null)

    const [marker, setMarker] = useState<{
        latitude: number
        longitude: number
    } | null>(initialRegion ? {
        latitude: initialRegion?.latitude,
        longitude: initialRegion?.longitude,
    } : null)

    const [loading, setLoading] = useState(false)
    const [resolvedAddress, setResolvedAddress] = useState<LocationData | null>(null)

    const getAddressDetails = useCallback(
        async (latitude: number, longitude: number) => {
            try {
                const result = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                })

                const place = result?.[0]

                const region: MapRegion = {
                    latitude,
                    longitude,
                    zoom: 12,
                }
                setResolvedAddress({
                    latitude,
                    longitude,
                    region,
                    address: [
                        place?.name,
                        place?.street,
                        place?.subregion,
                        place?.city,
                        place?.region,
                        place?.postalCode,
                        place?.country,
                    ]
                        .filter(Boolean)
                        .join(', '),

                    city: place?.city ?? undefined,
                    district: place?.subregion ?? undefined,
                    state: place?.region ?? undefined,
                    country: place?.country ?? undefined,
                    postalCode: place?.postalCode ?? undefined,
                })

                onLocationChange?.({
                    latitude,
                    longitude,
                    region,
                    address: [
                        place?.name,
                        place?.street,
                        place?.subregion,
                        place?.city,
                        place?.region,
                        place?.postalCode,
                        place?.country,
                    ]
                        .filter(Boolean)
                        .join(', '),

                    city: place?.city ?? undefined,
                    district: place?.subregion ?? undefined,
                    state: place?.region ?? undefined,
                    country: place?.country ?? undefined,
                    postalCode: place?.postalCode ?? undefined,
                })
            } catch (error) {
                console.error(error)
            }
        },
        [onLocationChange]
    )

    const updateLocation = useCallback(
        async (latitude: number, longitude: number) => {
            setMarker({ latitude, longitude })

            mapRef.current?.animateCamera({
                center: { latitude, longitude },
                zoom: 15,
            }, { duration: 500 })

            await getAddressDetails(latitude, longitude)
        },
        [getAddressDetails]
    )

    const handleMapClick = async (coordinates: { latitude: number; longitude: number }) => {
        await updateLocation(coordinates.latitude, coordinates.longitude)
    }

    const getCurrentLocation = async () => {
        try {
            setLoading(true)

            const { status } =
                await Location.requestForegroundPermissionsAsync()

            if (status !== 'granted') {
                return
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            })

            await updateLocation(
                location.coords.latitude,
                location.coords.longitude
            )
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        !initialRegion && getCurrentLocation()
    }, [])

    return (
        <>
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    mapType="satellite"
                    style={styles.map}
                    zoomControlEnabled
                    initialCamera={{
                        center: { latitude: initialRegion.latitude, longitude: initialRegion.longitude },
                        zoom: initialRegion.zoom,
                        pitch: 0,
                        heading: 0
                    }}
                    onPress={(e) => handleMapClick(e.nativeEvent.coordinate)}
                >
                    {marker && (
                        <Marker
                            coordinate={marker}
                            pinColor="#EA4335"
                        />
                    )}
                </MapView>

                <TouchableOpacity
                    style={styles.fab}
                    onPress={getCurrentLocation}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000000ff" />
                    ) : (
                        <CurrentLocationIcon size={20} color={'#000000ff'} />
                    )}
                </TouchableOpacity>

            </View>
            {resolvedAddress?.address ? (
                <ThemeText
                    content={`Resolved address: ${resolvedAddress.address}`}
                    accessibilityLabel={`Resolved address: ${resolvedAddress.address}`}
                />
            ) : null}</>

    )
}

const styles = StyleSheet.create({
    container: {
        height: MAP_VIEW_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        borderCurve: 'continuous'
    },
    map: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        right: 16,
        top: 16,
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
})