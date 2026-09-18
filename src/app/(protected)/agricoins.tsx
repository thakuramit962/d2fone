import ScreenView from '@/components/basic/containers/screenView'
import ThemeText from '@/components/basic/text/ThemeText'
import { ArrowDownRightIcon, ArrowUpRightIcon, InfoIcon, WalletSolidIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import useAgricoins from '@/hooks/use-agricoins'
import { useTheme } from '@/hooks/use-theme'
import { RootState } from '@/store/store'
import dayjs from 'dayjs'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    ListRenderItemInfo,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native'
import { useSelector } from 'react-redux'

const TEXT_COLOR = '#000000'

type CoinSource =
    | 'register'
    | 'spray'
    | 'referral'
    | 'spray_redemption'
    | 'product_redemption'
    | 'admin'
    | 'bonus'

type LedgerEntry = {
    id?: string | number
    coins: number
    created_at: string
    description?: string | null
    free_acreage?: number | null
    reference?: string
    source: CoinSource
    type: 'credit' | 'debit'
}

const LINE_ITEM_TEMPLATES: Record<CoinSource, { credit: string; debit: string }> = {
    register: { credit: 'Coins earned for registration', debit: 'Coins deducted — registration reversed' },
    spray: { credit: 'Coins earned for spray activity', debit: 'Coins deducted for spray' },
    referral: { credit: 'Coins earned from referral', debit: 'Coins deducted — referral reversed' },
    spray_redemption: { credit: 'Coins refunded from spray redemption', debit: 'Coins redeemed for spray' },
    product_redemption: { credit: 'Coins refunded from product redemption', debit: 'Coins redeemed for product' },
    admin: { credit: 'Coins credited by admin', debit: 'Coins deducted by admin' },
    bonus: { credit: 'Bonus coins credited', debit: 'Bonus coins reversed' },
}

function getLineItemText(item: LedgerEntry) {
    const template = LINE_ITEM_TEMPLATES[item.source]?.[item.type]
    let text = template ?? item.description ?? 'Coin transaction'

    // Only append the raw description if it adds information beyond the template
    if (template && item.description) {
        text += ` — ${item.description}`
    }

    if (item.free_acreage) {
        text += ` (${item.free_acreage} acres)`
    }

    if (item.reference) {
        text += ` · Ref: ${item.reference}`
    }

    return text
}

const TransactionItem = React.memo(({ item }: { item: LedgerEntry }) => {
    const theme = useTheme()
    const isCredit = item.type === 'credit'
    return (
        <View style={styles.row}>
            <View style={{
                backgroundColor: `${isCredit ? theme.success : theme.error}10`,
                padding: 8,
                borderRadius: 12,
            }}>
                {isCredit
                    ? <ArrowDownRightIcon color={theme.success} size={20} />
                    : <ArrowUpRightIcon color={theme.error} size={20} />}
            </View>
            <View style={styles.rowDetails}>
                <ThemeText content={getLineItemText(item)} variant="xs" fontFamily='MontserratMedium' />
                <ThemeText
                    content={dayjs(item.created_at).format('D MMM YYYY, hh:mm:ss A')}
                    variant="xxs"
                    color="#83838360"
                />
            </View>
            <ThemeText
                content={`${isCredit ? '+' : '-'}${Math.abs(item.coins)}`}
                variant="sm"
                fontFamily="MontserratSemiBold"
                severity={isCredit ? 'success' : 'main'}
                style={{
                    minWidth: 72,
                    textAlign: 'right'
                }}
            />
        </View>
    )
})
TransactionItem.displayName = 'TransactionItem'

const Agricoins = () => {

    const balance = useSelector((state: RootState) => state.auth.currentUser?.agricoin?.balance || 0)
    const { fetchAgricoinsLedger, fetchAgricoins, ledger, loading } = useAgricoins()
    const scrollRef = useRef<FlatList>(null);

    useEffect(() => {
        fetchAgricoins()
        fetchAgricoinsLedger()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleRefresh = useCallback(() => {
        fetchAgricoins()
        fetchAgricoinsLedger()
    }, [fetchAgricoins, fetchAgricoinsLedger])

    const keyExtractor = useCallback(
        (item: LedgerEntry, index: number) => String(item.id ?? item.reference ?? index),
        []
    )

    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<LedgerEntry>) => <TransactionItem item={item} />,
        []
    )

    const listData: LedgerEntry[] = useMemo(() => ledger ?? [], [ledger])

    useFocusEffect(
        useCallback(() => {
            scrollRef.current?.scrollToOffset({ offset: 0, animated: true })
        }, []),
    );


    return (
        <LinearGradient colors={['#a37d00ff', '#ffffffff']} locations={[0, 0.5]} style={styles.flex}>
            <ScreenView edges={['bottom', 'left', 'right']} bg="transparent">
                <Header
                    label="My Agricoins"
                    bottomSlot={
                        <View style={styles.balanceWrap}>
                            <WalletSolidIcon size={200} style={styles.walletIcon} />

                            <Image source={require('@/assets/images/static/agricoin-side.png')} style={styles.coinLarge} />
                            <Image source={require('@/assets/images/static/agricoin-side.png')} style={styles.coinMedium} />
                            <Image source={require('@/assets/images/static/agricoin-front.png')} style={styles.coinSmall} />

                            <ThemeText
                                content="Your Balance"
                                fontFamily="MontserratSemiBold"
                                variant="xs"
                                style={styles.uppercase}
                            />
                            {loading && balance == null ? (
                                <ActivityIndicator style={styles.balanceLoader} />
                            ) : (
                                <ThemeText content={String(balance ?? 0)} fontFamily="MontserratExtraBold" size={38} />
                            )}
                        </View>
                    }
                    rightSlot={
                        <Pressable onPress={() => router.navigate('/agricoinsPolicy')}>
                            <InfoIcon />
                        </Pressable>
                    }
                />

                <ThemeText
                    content="Recent Transactions"
                    fontFamily="MontserratSemiBold"
                    color={TEXT_COLOR}
                    variant="xs"
                    style={styles.sectionLabel}
                />

                <FlatList
                    ref={scrollRef}
                    style={styles.list}
                    contentContainerStyle={listData.length === 0 && styles.listEmptyContainer}
                    data={listData}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
                    ListEmptyComponent={
                        !loading ? (
                            <ThemeText content="No transactions yet" variant="sm" style={styles.emptyText} />
                        ) : null
                    }
                    initialNumToRender={12}
                    windowSize={7}
                    removeClippedSubviews
                />
            </ScreenView>
        </LinearGradient>
    )
}

export default Agricoins

const styles = StyleSheet.create({
    flex: { flex: 1 },
    balanceWrap: { alignItems: 'center' },
    walletIcon: { transform: [{ rotate: '-15deg' }] },
    coinLarge: {
        height: 48,
        width: 48,
        resizeMode: 'contain',
        position: 'absolute',
        top: 140,
        right: 140,
    },
    coinMedium: {
        height: 42,
        width: 42,
        resizeMode: 'contain',
        position: 'absolute',
        top: 120,
        right: 130,
    },
    coinSmall: {
        height: 32,
        width: 32,
        resizeMode: 'contain',
        position: 'absolute',
        top: 150,
        right: 130,
    },
    uppercase: { textTransform: 'uppercase' },
    balanceLoader: { marginTop: 8 },
    sectionLabel: { paddingLeft: 24 },
    list: {
        padding: 16,
        borderRadius: 24,
        borderColor: '#83838360',
        borderWidth: 1,
        marginHorizontal: 8,
    },
    listEmptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
    row: {
        borderBottomWidth: 1,
        borderBottomColor: '#83838320',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        alignItems: 'flex-start',
        paddingVertical: 10,
    },
    rowDetails: { flex: 1 },
    emptyText: { textAlign: 'center', marginTop: 24 },
})


// const SMAPLE_DATA: LedgerEntry[] = [
//     {
//         "coins": 25, "created_at": "2026-06-12T11:07:54.000000Z", "description": null,
//         "free_acreage": null, "reference": "AWFHR-1121", "source": "referral", "type": "credit"
//     }, {
//         "coins": 10,
//         "created_at": "2026-06-10T09:15:22.000000Z", "description": "Welcome bonus for new user registration", "free_acreage": null, "reference": "REG-88231", "source": "register", "type": "credit"
//     }, {
//         "coins": 5, "created_at": "2026-06-11T14:32:10.000000Z", "description": null,
//         "free_acreage": 2.5, "reference": "SPR-44521", "source": "spray", "type": "credit"
//     }, {
//         "coins": 50, "created_at": "2026-06-13T08:45:00.000000Z",
//         "description": "Redeemed for pesticide spray service", "free_acreage": 5, "reference": "SPRD-99102", "source": "spray_redemption", "type": "debit"
//     }, {
//         "coins": 100, "created_at": "2026-06-14T16:20:35.000000Z",
//         "description": "Redeemed for fertilizer product bundle", "free_acreage": null, "reference": "PRD-77345", "source": "product_redemption", "type": "debit"
//     }, {
//         "coins": 30, "created_at": "2026-06-09T12:00:00.000000Z",
//         "description": "Manual adjustment by support team", "free_acreage": null,
//         "reference": "ADM-11007", "source": "admin", "type": "credit"
//     },
//     { "coins": 15, "created_at": "2026-06-08T18:44:11.000000Z", "description": "Correction — duplicate admin credit reversed", "free_acreage": null, "reference": "ADM-11008", "source": "admin", "type": "debit" }, { "coins": 20, "created_at": "2026-06-15T07:30:47.000000Z", "description": null, "free_acreage": null, "reference": "BON-55678", "source": "bonus", "type": "credit" }, { "coins": 8, "created_at": "2026-06-16T19:05:03.000000Z", "description": "Bonus reversed due to policy violation", "free_acreage": null, "reference": "BON-55679", "source": "bonus", "type": "debit" }, { "coins": 12, "created_at": "2026-06-17T10:12:59.000000Z", "description": null, "free_acreage": 3, "reference": "SPR-44890", "source": "spray", "type": "credit" }, { "coins": 40, "created_at": "2026-06-18T15:40:20.000000Z", "description": "Referral reversed — referred user account deleted", "free_acreage": null, "reference": "AWFHR-1122", "source": "referral", "type": "debit" }, { "coins": 60, "created_at": "2026-06-19T11:58:14.000000Z", "description": "Refund issued — spray redemption cancelled", "free_acreage": 5, "reference": "SPRD-99103", "source": "spray_redemption", "type": "credit" }
// ]