import { LocationOffIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { usePermissions } from '@/hooks/usePermissions'
import { memo, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import ModernDetailItem from '../modernDetailItem'
import Skelton from '../Skelton'


const LocationCta = memo(() => {
    const theme = useTheme()
    const { openSettings, requestLocation, permissions } = usePermissions()

    const status = permissions?.location

    const handlePress = useCallback(() => {
        if (status === 'denied' || status === 'granted') {
            openSettings()
        } else {
            requestLocation()
        }
    }, [status])

    if (status === 'granted') {
        return null
    }

    if (status === 'undetermined') {
        return (
            <View style={styles.container}>
                <Skelton dimensions={{ height: 56 }} />
            </View>
        )
    }

    if (status === 'denied') {
        const isDenied = status === 'denied'

        return (
            <View style={styles.container}>
                <ModernDetailItem
                    icon={LocationOffIcon}
                    iconColor={theme.error}
                    label={{ content: isDenied ? 'Location access is disabled' : 'Enable location services' }}
                    description={{
                        content: isDenied
                            ? 'Please enable location permission in settings to continue.'
                            : 'Allow location access to get accurate results near you.',
                    }}
                    onPress={handlePress}
                    accessibilityLabel="Location permission CTA"
                    accessibilityRole="button"
                />
            </View>
        )
    }

    return null
})

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
})

LocationCta.displayName = 'LocationCta'

export default LocationCta