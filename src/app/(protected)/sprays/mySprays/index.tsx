import EmptyData from '@/components/basic/containers/EmptyData'
import ScreenView from '@/components/basic/containers/screenView'
import LoadingList from '@/components/basic/loadingList'
import { FarmerActionSheet } from '@/components/basic/pages/services/sprays/farmerActionSheet'
import ActionText from '@/components/basic/text/ActionText'
import DetailLine from '@/components/basic/text/detailLine'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { ArrowRightIcon, CalendarIcon, Field2Icon, PlantIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import useSprayRequests from '@/hooks/useSprayRequests'
import { RequestStatus, SprayRequest, STATUS_LABEL } from '@/models/sprayRequest'
import { RootState } from '@/store/store'
import dayjs from 'dayjs'
import { router, useFocusEffect } from 'expo-router'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, ListRenderItem, Pressable, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'

const agricoinsImg = require('@/assets/images/static/agricoin-side.png')

const MySprays = () => {

    const theme = useTheme()
    const myRequests = useSelector((state: RootState) => state.sprayRequests)

    const { fetchMyRequests } = useSprayRequests()
    const { t } = useTranslation()

    const scrollRef = useRef<FlatList>(null);

    const [selected, setSelected] = useState<null | SprayRequest>(null)

    useEffect(() => {
        fetchMyRequests()
    }, [fetchMyRequests])

    const keyExtractor = useCallback(
        (item: SprayRequest, index: number) => item.request_id ?? String(index),
        []
    )

    useFocusEffect(
        useCallback(() => {
            scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
        }, []),
    );


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
            const label = STATUS_LABEL[item.status] ?? t('status.unknown')

            return (
                <TouchableOpacity
                    onPress={() => {
                        setSelected(item)
                    }}
                    style={[styles.card, { borderColor: `${theme.text.primary}25` }]}
                    accessible
                    accessibilityRole="summary"
                    accessibilityLabel={`Spray request ${item.request_id}, status ${label}, for ${item.crop_name}`}
                >
                    <View style={styles.cardHeader}>
                        <View>
                            <ThemeText content={item.request_id} fontFamily="MontserratSemiBold" size={14} />
                            <View style={styles.updatedRow}>
                                <CalendarIcon size={12} color={theme.text.secondary} />
                                <ThemeText content={dayjs(item.updated_at).format('D MMMM [@]hh:mm A')} severity='secondary' />
                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                        }}>
                            {+item?.apply_coin > 0 &&
                                <Image
                                    source={agricoinsImg}
                                    style={{
                                        height: 22, width: 22, resizeMode: 'contain'
                                    }}
                                />
                            }
                            <ThemeText
                                color={theme.background.main}
                                style={[styles.statusBadge, { backgroundColor: bg }]}
                                size={10}
                                fontFamily="MontserratSemiBold"
                                content={label}
                            />
                        </View>
                    </View>

                    <ThemeDivider size={4} />
                    <View style={styles.detailsRow}>
                        <View style={[styles.metaBlock, { borderColor: `${theme.text.primary}20` }]}>
                            <DetailLine
                                icon={PlantIcon}
                                stretchLabel={false}
                                label={{ content: t('mySprays.cropLabel'), size: 11 }}
                                description={{ content: item.crop_name, fontFamily: 'InterSemiBold', size: 11 }}
                            />
                            <DetailLine
                                icon={Field2Icon}
                                iconColor={+item?.apply_coin > 0 ? theme.info : theme.text.primary}
                                stretchLabel={false}
                                label={{ content: t('mySprays.areaLabel'), size: 11 }}
                                description={{ content: `${item.acreage} acres`, fontFamily: 'InterSemiBold', size: 11 }}
                            />
                        </View>

                        <CalendarIcon style={{ opacity: 0.8, marginLeft: 4 }} />
                        <View style={styles.bookedForBlock}>
                            <ThemeText content={t('mySprays.bookedFor')} size={10} severity="disabled" style={{ opacity: 0.8 }} />
                            <ThemeText content={item.request_date} fontFamily="MontserratBold" size={13} />
                        </View>
                    </View>

                    {(item.service_id && item.status == 2) &&
                        <Pressable style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            gap: 4,
                            padding: 4,
                            backgroundColor: `${theme.text.primary}15`,
                            borderRadius: 10,
                            paddingLeft: 16,
                            marginBottom: 6
                        }}>
                            <View style={{ flex: 1 }}>
                                <ThemeText content={'Order Id'} fontFamily='MontserratRegular' size={9} />
                                <ThemeText content={item.service_id} fontFamily='MontserratBold' size={12} />
                            </View>
                            <ThemeText content={t('view')} severity='disabled' fontFamily='MontserratMedium' />
                            <ArrowRightIcon size={18} />
                        </Pressable>
                    }
                </TouchableOpacity>
            )
        },
        [getStatusColor, theme.background.main, theme.text.primary]
    )

    const listEmpty = useMemo(() => {
        if (myRequests.loading) {
            return <LoadingList />
        }
        if (myRequests.error) {
            return (
                <View style={styles.centerBlock}>
                    <ActionText label={`${myRequests.error} — ${t('mySprays.retrySuffix')}`} action={fetchMyRequests} />
                </View>
            )
        }
        return (
            <EmptyData message={t('mySprays.noRequests')} title={t('mySprays.noDataTitle')} callback={{
                label: t('mySprays.createRequest'),
                action: () => router.navigate('/sprays/bookSpray')
            }} />
        )
    }, [myRequests, fetchMyRequests])

    return (
        <ScreenView edges={['bottom', 'left', 'right']}>
            <Header label={t('mySprays.title')}
                rightSlot={
                    <Pressable onPress={() => router.navigate('/sprays/bookSpray')}
                        style={{
                            backgroundColor: theme.text.primary,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 16,
                            borderCurve: 'continuous',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <ThemeText content={t('mySprays.bookSpray')} color={theme.background.main} variant='xs' fontFamily='MontserratSemiBold' />
                    </Pressable>
                }
                bottomSlot={
                    <Pressable onPress={() => router.navigate('/sprays/droneSprays')}
                        style={{
                            borderColor: `${theme.text.primary}25`,
                            borderWidth: 1,
                            padding: 12,
                            // alignSelf: 'flex-start',
                            borderRadius: 12,
                            borderCurve: 'continuous',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <ThemeText content={t('mySprays.viewAll')} variant='xs' fontFamily='MontserratSemiBold' />
                    </Pressable>
                }
            />
            <FlatList
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                data={myRequests.list}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListEmptyComponent={listEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={myRequests.loading}
                        onRefresh={fetchMyRequests}
                        tintColor={theme.text.primary}
                    />
                }
                removeClippedSubviews
                maxToRenderPerBatch={5}
                windowSize={5}
                initialNumToRender={5}

            />

            {selected &&
                <FarmerActionSheet
                    onClose={() => setSelected(null)}
                    open={Boolean(selected)}
                    spray={selected}
                />
            }
        </ScreenView>
    )
}

export default memo(MySprays)

const styles = StyleSheet.create({
    list: {
        borderRadius: 16,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 72,
        paddingTop: 8,
        gap: 8,
        flexGrow: 1,
    },
    card: {
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
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
    },
    metaBlock: {
        flex: 1.5,
        gap: 2,
        borderRightWidth: StyleSheet.hairlineWidth,
    },
    updatedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    centerBlock: {
        paddingVertical: 48,
        alignItems: 'center',
        height: 300
    },
})