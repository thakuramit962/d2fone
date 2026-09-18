import HorizontalIndicators from '@/components/basic/pagination/horizontalIndicators'
import Skelton from '@/components/basic/Skelton'
import ActionText from '@/components/basic/text/ActionText'
import DetailLine from '@/components/basic/text/detailLine'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { ArrowRightIcon, CalendarIcon, Field2Icon, PlantIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import useSprayRequests from '@/hooks/useSprayRequests'
import { RequestStatus, SprayRequest, STATUS_LABEL } from '@/models/sprayRequest'
import { RootState } from '@/store/store'
import { dimensions } from '@/utils/app-helper'
import dayjs from 'dayjs'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { t } from 'i18next'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, ListRenderItem, Pressable, StyleSheet, TouchableOpacity, View, ViewToken } from 'react-native'
import { useSelector } from 'react-redux'

const TEXT_COLOR_1 = '#ffffff'
const TEXT_COLOR_2 = '#0f0900'
const COLOR_1 = '#7ccfd5ff'
const COLOR_2 = '#064155ff'

const CARD_GAP = 12


const PendingRequests = ({ MAX_VISIBLE = 7 }: { MAX_VISIBLE?: number }) => {
    const theme = useTheme()
    const myRequests = useSelector((state: RootState) => state.sprayRequests)

    const { fetchMyRequests } = useSprayRequests()

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        fetchMyRequests()
    }, [fetchMyRequests])

    const visibleList = useMemo(
        () => myRequests.list?.slice(0, MAX_VISIBLE) ?? [],
        [myRequests.list]
    )

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                setCurrentIndex(viewableItems[0].index ?? 0)
            }
        }
    ).current

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current

    const keyExtractor = useCallback(
        (item: SprayRequest, index: number) => item.request_id ?? String(index),
        []
    )

    const getStatusColor = useCallback(
        (status: number) => {
            switch (status) {
                case RequestStatus.Rejected:
                    return theme.warning
                case RequestStatus.Created:
                    return theme.info
                case RequestStatus.Accepted:
                    return theme.success
                default:
                    return theme.text.disabled
            }
        },
        [theme]
    )

    const renderItem: ListRenderItem<SprayRequest> = useCallback(
        ({ item }) => {
            const bg = getStatusColor(item.status)
            const label = STATUS_LABEL[item.status] ?? 'Unknown'

            return (
                <TouchableOpacity
                    onPress={() => router.navigate('/sprays/mySprays')}
                    style={styles.card}>
                    <View style={styles.cardHeader}>
                        <ThemeText
                            content={item.request_id}
                            fontFamily="MontserratSemiBold"
                            size={14}
                            color={TEXT_COLOR_1}
                        />
                        <ThemeText
                            color={theme.background.main}
                            style={[styles.statusBadge, { backgroundColor: bg }]}
                            size={10}
                            fontFamily="MontserratSemiBold"
                            content={label}
                        />
                    </View>

                    <ThemeDivider size={4} />
                    <LinearGradient
                        colors={[`${TEXT_COLOR_2}20`, `${TEXT_COLOR_2}10`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.detailsRow}
                    >
                        <CalendarIcon color={TEXT_COLOR_1} style={{ opacity: 0.8 }} />
                        <View style={styles.bookedForBlock}>
                            <ThemeText
                                content="Booked for"
                                size={10}
                                severity="disabled"
                                color={TEXT_COLOR_1}
                                style={{ opacity: 0.8 }}
                            />
                            <ThemeText
                                content={item.request_date}
                                fontFamily="MontserratBold"
                                size={13}
                                color={TEXT_COLOR_1}
                            />
                        </View>
                        <View style={styles.metaBlock}>
                            <DetailLine
                                icon={PlantIcon}
                                iconColor={TEXT_COLOR_1}
                                stretchLabel={false}
                                label={{ content: 'Crop: ', color: TEXT_COLOR_1, size: 11 }}
                                description={{
                                    content: item.crop_name,
                                    fontFamily: 'InterSemiBold',
                                    color: TEXT_COLOR_1,
                                    size: 11,
                                }}
                            />
                            <DetailLine
                                icon={Field2Icon}
                                iconColor={TEXT_COLOR_1}
                                stretchLabel={false}
                                label={{ content: 'Area: ', color: TEXT_COLOR_1, size: 11 }}
                                description={{
                                    content: `${item.acreage} acres`,
                                    fontFamily: 'InterSemiBold',
                                    color: TEXT_COLOR_1,
                                    size: 11,
                                }}
                            />
                        </View>
                    </LinearGradient>

                    <View style={styles.updatedRow}>
                        <CalendarIcon size={12} color={TEXT_COLOR_1} />
                        <ThemeText
                            content={dayjs(item.updated_at).format('D MMMM [@]hh:mm A')}
                            color={TEXT_COLOR_1}
                        />
                    </View>
                </TouchableOpacity>
            )
        },
        [getStatusColor, theme.background.main]
    )

    const listFooter = useMemo(() => {
        if (myRequests.loading || visibleList.length === 0) return null
        return (
            <Pressable style={styles.viewAll} onPress={() => router.navigate('/sprays/mySprays')}>
                <ArrowRightIcon color={TEXT_COLOR_1} size={32} />
                <ThemeText content="View All" color={TEXT_COLOR_1} fontFamily="MontserratMedium" size={12} />
            </Pressable>
        )
    }, [myRequests.loading, visibleList.length])

    const listEmpty = useMemo(() => {
        if (myRequests.loading) {
            return <Skelton dimensions={{ height: 104, width: dimensions.width - 32 }} />
        }
        if (myRequests.error) {
            return (
                <Skelton
                    dimensions={{ height: 104, width: dimensions.width - 32 }}
                    content={<ActionText label={myRequests.error + ' — tap to retry'} action={fetchMyRequests} />}
                />
            )
        }
        if (visibleList.length === 0) {
            return (
                <Skelton
                    dimensions={{ height: 104, width: dimensions.width - 32 }}
                    content={<ActionText label="Press to refresh" action={fetchMyRequests} color={theme?.background.main} />}
                />
            )
        }
        return null
    }, [myRequests.loading, myRequests.error, visibleList.length, fetchMyRequests])

    return (
        <LinearGradient
            colors={[COLOR_1, COLOR_2]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <ThemeText
                content={t('droneSprays.recentRequests')}
                fontFamily="MontserratSemiBold"
                variant="xs"
                color={TEXT_COLOR_1}
                style={{ paddingLeft: 8 }}
            />

            <ThemeDivider size={0} />

            <FlatList
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                snapToInterval={dimensions.width * 0.75 + CARD_GAP}
                snapToAlignment="start"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                horizontal
                data={visibleList}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListFooterComponent={listFooter}
                ListEmptyComponent={listEmpty}
                removeClippedSubviews
                maxToRenderPerBatch={5}
                windowSize={5}
                initialNumToRender={3}
            />

            <ThemeDivider size={1} />

            <HorizontalIndicators currentIndex={currentIndex} total={visibleList.length} color={TEXT_COLOR_1} />
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 4,
        padding: 8,
        paddingBottom: 16,
        paddingTop: 12,
    },
    list: {
        borderRadius: 16,
    },
    listContent: {
        gap: CARD_GAP,
        alignItems: 'center',
    },
    card: {
        width: dimensions.width * 0.75,
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: TEXT_COLOR_1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
    },
    statusBadge: {
        borderRadius: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        lineHeight: 10,
    },
    detailsRow: {
        borderRadius: 12,
        padding: 8,
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
    },
    bookedForBlock: {
        flex: 1,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: TEXT_COLOR_1,
    },
    metaBlock: {
        flex: 1.5,
        gap: 2,
    },
    updatedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAll: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        alignSelf: 'stretch',
        height: 72,
        backgroundColor: `${TEXT_COLOR_1}20`,
        borderRadius: 16,
    },
})

export default memo(PendingRequests)