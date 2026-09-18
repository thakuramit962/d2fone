import LoadingScreen from '@/components/basic/containers/loadingScreen'
import ThemeText from '@/components/basic/text/ThemeText'
import API from '@/constants/api'
import useNearByUsers from '@/hooks/use-near-by-users'
import { useTheme } from '@/hooks/use-theme'
import useLiveLocation from '@/hooks/useLiveLocation'
import { updateAppState } from '@/slices/appSlice'
import { RootState } from '@/store/store'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'

const LocationDetails = ({ small }: { small?: boolean }) => {
    const theme = useTheme()
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { isLoggedIn, currentUser } = useSelector((state: RootState) => state?.auth)
    const { getNearByUsers, usersLocation } = useNearByUsers()

    const syncCoordinatesToBackend = useCallback(
        async (coords: { latitude: number; longitude: number }) => {
            if (!isLoggedIn || !currentUser?.id) return
            await API.post('/v1/update-coordinates', {
                location_coordinates: `${coords.latitude.toFixed(6)},${coords.longitude.toFixed(6)}`,
                user_id: currentUser.id,
            })
        },
        [isLoggedIn, currentUser]
    )

    const throttledCallbacks = useMemo(
        () => [
            {
                key: 'nearby-users',
                minDistanceMeters: 100,
                minIntervalMs: 20_000,
                onTrigger: () => getNearByUsers(),
            },
            {
                key: 'backend-sync',
                minDistanceMeters: 100,
                minIntervalMs: 20_000,
                onTrigger: syncCoordinatesToBackend,
            },
        ],
        [getNearByUsers, syncCoordinatesToBackend]
    )

    const {
        permissionState,
        region,
        coords: userCoords,
        address,
        refreshing,
        error,
        mapRef,
        requestPermissionAndStart,
        refresh,
    } = useLiveLocation({
        onLocationUpdate: (loc) => {
            const { latitude, longitude, accuracy, altitude, heading, speed } = loc.coords
            dispatch(
                updateAppState({
                    locationCoords: { latitude, longitude, accuracy, altitude, heading, speed, timestamp: loc.timestamp },
                })
            )
        },
        throttledCallbacks,
    })

    return (
        small
            ? null
            : <>
                <>
                    {(permissionState === 'denied' || permissionState === 'unavailable') && (
                        <View style={[styles.deniedContainer, { backgroundColor: theme.background.slate ?? '#f2f2f2' }]}>
                            <Text style={[styles.deniedTitle, { color: theme.text.primary }]}>
                                {t('locationDetails.permissionNeeded')}
                            </Text>
                            <Text style={[styles.deniedDesc, { color: theme.text.secondary ?? '#666' }]}>
                                {error || t('locationDetails.permissionDesc')}
                            </Text>

                            <TouchableOpacity
                                onPress={requestPermissionAndStart}
                                style={[styles.primaryBtn, { backgroundColor: theme.primary ?? '#2563eb' }]}
                            >
                                <Text style={styles.btnText}>{t('locationDetails.allowAccess')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.settingsBtn}>
                                <Text style={{ color: theme.primary ?? '#2563eb' }}>{t('locationDetails.openSettings')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {permissionState === 'granted' && userCoords && (
                        <View style={styles.addressContainer}>
                            <ThemeText
                                content={refreshing ? t('locationDetails.fetchingAddress') : address || t('locationDetails.resolvingAddress')}
                                fontFamily="MontserratMedium"
                                variant="xs"
                            />
                            <ThemeText
                                content={t('locationDetails.coordinates', { coords: `${userCoords.latitude.toFixed(6)}, ${userCoords.longitude.toFixed(6)}` })}
                                fontFamily="MontserratSemiBold"
                                severity="secondary"
                            />
                        </View>
                    )}
                </>

                {permissionState == 'checking' || refreshing && <LoadingScreen />}

                {permissionState === 'granted' && userCoords && (
                    <View style={styles.mapWrapper}>
                        <MapView
                            ref={mapRef}
                            mapType="satellite"
                            style={styles.map}
                            initialCamera={{
                                center: { latitude: region.latitude, longitude: region.longitude },
                                zoom: region.zoom,
                                pitch: 0,
                                heading: 0,
                            }}
                            zoomEnabled
                            loadingEnabled
                            loadingBackgroundColor={theme.info ?? '#fff'}
                            zoomControlEnabled
                            showsUserLocation={true}
                        >
                            {usersLocation?.members?.map((member, i) => (
                                <Marker
                                    key={member.id || i}
                                    image={require('@/assets/images/static/executive.png')}
                                    coordinate={{
                                        latitude: member.location_coordinates.latitude,
                                        longitude: member.location_coordinates.longitude,
                                    }}
                                    title={member?.name || t('locationDetails.d2fExecutive')}
                                    pinColor="#3599eaff"
                                />
                            ))}

                            <Marker
                                image={require('@/assets/images/static/location.png')}
                                coordinate={{
                                    latitude: region.latitude,
                                    longitude: region.longitude,
                                }}
                                title={t('locationDetails.yourLocation')}
                                pinColor="#ff0037ff"
                            />
                        </MapView>

                        <TouchableOpacity
                            style={[styles.floatingRefreshBtn, { backgroundColor: theme.warning ?? '#2563eb' }]}
                            onPress={refresh}
                            disabled={refreshing}
                        >
                            <Text style={styles.btnText}>{refreshing ? '...' : '↻'}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    deniedContainer: { alignItems: 'center', padding: 20, borderRadius: 16, marginTop: 12 },
    deniedTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
    deniedDesc: { textAlign: 'center', marginTop: 8 },
    primaryBtn: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    btnText: { color: '#fff', fontWeight: '600', fontSize: 24, lineHeight: 24 },
    settingsBtn: { marginTop: 10 },
    addressContainer: { marginTop: 8, gap: 4, paddingHorizontal: 16 },
    loaderContainer: { paddingVertical: 10, alignItems: 'center' },
    mapWrapper: { flex: 1, position: 'relative' },
    map: { width: '100%', height: '100%' },
    floatingRefreshBtn: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
})

export default LocationDetails