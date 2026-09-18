import { LocationFilledIcon } from "@/components/icons";
import { useTheme } from "@/hooks/use-theme";
import { Farm } from "@/models/user";

import { useFocusEffect } from "expo-router";
import { memo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    ListRenderItemInfo,
    Platform,
    Pressable,
    RefreshControl,
    StyleSheet,
    View
} from "react-native";
import LoadingList from "../../loadingList";
import ThemeText from "../../text/ThemeText";
import { FarmMap } from "./farmMap";

const DEFAULT_COORDS = { latitude: 29.124003, longitude: 75.706207 } as const;

const LOADING_PLACEHOLDERS = [1, 2, 3] as const;

interface LatLng {
    latitude: number;
    longitude: number;
}

export function parseCoordinates(
    raw: string | null | undefined
): LatLng {
    if (!raw) return DEFAULT_COORDS;

    const matches = raw.match(/[-+]?(?:\d+(?:\.\d+)?|\.\d+)/g)

    if (!matches || matches.length < 2) {
        return DEFAULT_COORDS;
    }

    const latitude = Number(matches[0]);
    const longitude = Number(matches[1]);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        return DEFAULT_COORDS;
    }

    return {
        latitude,
        longitude,
    };
}

export function formatCoordinates(coords: LatLng): string {
    if (
        coords.latitude === DEFAULT_COORDS.latitude &&
        coords.longitude === DEFAULT_COORDS.longitude
    ) {
        return "";
    }
    return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
}

export function buildAddress(
    parts: Array<string | null | undefined>,
    t: (key: string, opts?: Record<string, unknown>) => string
): string {
    const joined = parts.filter(Boolean).join(", ");
    return joined
        ? t('farmDetails.card.addressLabel', { address: joined })
        : t('farmDetails.card.addressEmpty');
}

export function isFarmInactive(status: string | number | null | undefined): boolean {
    return status === "0" || status === 0;
}

interface FarmCardProps {
    item: Farm;
    onPress?: (farm: Farm) => void;
}

export const FarmCard = memo(function FarmCard({ item, onPress }: FarmCardProps) {
    const theme = useTheme();
    const { t } = useTranslation()

    const isInactive = isFarmInactive(item.status);
    const coords = parseCoordinates(item.location_coordinates);
    const coordsDisplay = formatCoordinates(coords);

    const handlePress = useCallback(() => {
        onPress?.(item);
    }, [item, onPress]);

    return (
        <Pressable
            onPress={handlePress}
            accessible
            accessibilityRole="button"
            accessibilityLabel={t('farmDetails.card.a11yLabel', {
                field: item.field_area,
                acres: item.acerage,
                status: isInactive ? t('farmDetails.card.a11yInactive') : '',
            })}
            style={({ pressed }) => [
                styles.card,
                { borderColor: `${theme.text.primary}25` },
                pressed && styles.cardPressed,
            ]}
        >
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    {coordsDisplay ? (
                        <View style={styles.coordRow}>
                            <LocationFilledIcon
                                height={10}
                                width={10}
                                color={theme.text.secondary}
                            />
                            <ThemeText
                                content={coordsDisplay}
                                fontFamily="InterRegular"
                                size={10}
                                style={styles.coordText}
                                severity="secondary"
                                selectable
                            />
                        </View>
                    ) : null}

                    <ThemeText
                        content={item.field_area}
                        fontFamily="MontserratBold"
                        severity={isInactive ? "error" : "main"}
                        size={16}
                        style={styles.fieldArea}
                    />

                    <ThemeText
                        content={buildAddress([
                            item.address,
                            item.village,
                            item.sub_district,
                            item.district,
                        ], t)}
                        fontFamily="InterRegular"
                        severity="main"
                        size={10}
                        style={styles.address}
                    />
                </View>

                <View
                    style={[
                        styles.acreageBadge,
                        { backgroundColor: `${theme.text.primary}10` },
                    ]}
                >
                    <ThemeText
                        content={item.acerage}
                        fontFamily="MontserratBlack"
                        size={24}
                        style={styles.acreageNumber}
                        severity="main"
                    />
                    <ThemeText
                        content={t('farmDetails.card.acres')}
                        fontFamily="InterRegular"
                        size={10}
                        style={styles.acreageLabel}
                        severity="main"
                    />
                </View>
            </View>

            <View style={styles.mapWrapper} pointerEvents="none">
                <FarmMap coords={coords} region={{
                    ...coords,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }} />
            </View>

            <ThemeText
                content={t('farmDetails.card.currentCrop', { crop: item.current_crop ?? "—" })}
                fontFamily="InterRegular"
                size={12}
            />

            {isInactive && (
                <ThemeText
                    content={t('farmDetails.card.inactiveWarning')}
                    severity="error"
                    size={10}
                    style={styles.inactiveWarning}
                />
            )}
        </Pressable>
    );
});




interface FarmListProps {
    farms: Farm[];
    loading: boolean;
    onRefresh: () => void;
    onFarmPress?: (farm: Farm) => void;
}

export default function FarmList({
    farms,
    loading,
    onRefresh,
    onFarmPress,
}: FarmListProps) {
    const scrollRef = useRef<FlatList>(null);

    const { t } = useTranslation()

    const keyExtractor = useCallback(
        (item: Farm | number) =>
            typeof item === "number" ? String(item) : String(item.id),
        [],
    );

    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<Farm | number>) => {
            if (typeof item === "number") {
                return <LoadingList height={180} count={1} />;
            }
            return <FarmCard item={item} onPress={onFarmPress} />;
        },
        [onFarmPress],
    );

    const data: Array<Farm | number> = loading ? [...LOADING_PLACEHOLDERS] : farms;

    useFocusEffect(
        useCallback(() => {
            scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
        }, []),
    );

    return (
        <FlatList
            ref={scrollRef}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            removeClippedSubviews={Platform.OS === "android"}
            maxToRenderPerBatch={6}
            windowSize={10}
            initialNumToRender={4}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
                loading ? null : (
                    <ThemeText
                        content={t('farmList.empty')}
                        severity="secondary"
                        fontFamily="InterRegular"
                        size={14}
                        style={styles.emptyText}
                    />
                )
            }
            ListFooterComponent={<View style={styles.listFooter} />}
        />
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
        gap: 12,
    },
    listFooter: {
        height: 24,
    },

    card: {
        borderWidth: 1,
        borderRadius: 24,
        padding: 12,
        gap: 8,
    },
    cardPressed: {
        opacity: 0.85,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        paddingLeft: 12,
    },
    headerLeft: {
        flex: 1,
    },

    coordRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    coordText: {
        lineHeight: 10,
    },
    fieldArea: {
        lineHeight: 24,
    },
    address: {
        lineHeight: 10,
    },

    acreageBadge: {
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: "center",
    },
    acreageNumber: {
        lineHeight: 24,
    },
    acreageLabel: {
        lineHeight: 10,
    },

    mapWrapper: {
        borderRadius: 12,
        overflow: "hidden",
        height: 140,
    },

    inactiveWarning: {
        lineHeight: 20,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 48,
    },
});