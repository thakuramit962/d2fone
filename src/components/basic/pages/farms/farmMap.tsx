import { memo } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export const FarmMap = memo(
    ({
        region,
        coords,
    }: {
        region: any;
        coords: {
            latitude: number;
            longitude: number;
        };
    }) => {
        return (
            <View style={{ flex: 1 }} pointerEvents="none">
                <MapView
                    style={{ flex: 1 }}
                    mapType="satellite"
                    initialCamera={{
                        center: {
                            latitude: region?.latitude ?? coords?.latitude,
                            longitude: region?.longitude ?? coords?.longitude,
                        },
                        zoom: region?.zoom ?? 15,
                        pitch: 0,
                        heading: 0
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                >
                    {coords && (
                        <Marker
                            coordinate={coords}
                            pinColor="#EA4335"
                        />
                    )}
                </MapView>
            </View>
        );
    }
);