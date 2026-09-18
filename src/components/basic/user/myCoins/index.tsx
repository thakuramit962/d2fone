import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import useAgricoins from '@/hooks/use-agricoins';
import { RootState } from '@/store/store';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Skelton from '../../Skelton';
import ThemeText from '../../text/ThemeText';

const GRADIENT_COLORS = ['#ffe78fff', '#fffdeaff'] as const;
const sideCoin = require('@/assets/images/static/agricoin-side.png')
const frontCoin = require('@/assets/images/static/agricoin-front.png')

const MyCoins = ({ detailedView = false }: { detailedView?: boolean }) => {
    const { fetchAgricoins, loading } = useAgricoins();
    const { t } = useTranslation()

    const balance = useSelector(
        (state: RootState) => state.auth.currentUser?.agricoin?.balance ?? 0
    );

    useEffect(() => {
        fetchAgricoins();
    }, []);

    return (
        <>
            <Pressable
                hitSlop={10}
                accessibilityRole="button"
                onPress={() => router.navigate('/agricoins')}
            >
                <LinearGradient
                    colors={GRADIENT_COLORS}
                    start={{ x: 0, y: 0.2 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <Image
                        source={sideCoin}
                        style={styles.backgroundCoin}
                    />
                    <View>
                        <Text>
                            <ThemeText
                                content={t('agricoins.agri')}
                                fontFamily="MontserratBlack"
                                variant="md"
                                color="#333"
                                style={styles.titleSpacing}
                            />
                            <ThemeText
                                content={t('agricoins.coins')}
                                fontFamily="MontserratBold"
                                variant="md"
                                color="#c37e16"
                                style={styles.titleSpacing}
                            />
                        </Text>

                        <ThemeText
                            content={t('agricoins.tagline')}
                            style={styles.description}
                        />
                    </View>

                    <View style={[styles.footer, {
                        justifyContent: detailedView ? 'flex-end' : 'space-between',

                    }]}>

                        {!detailedView &&
                            <ThemeText
                                content={`${t('agricoins.viewMore')} >>`}
                                color="#746102"
                                size={12}
                                fontFamily="MontserratSemiBold"
                            />
                        }

                        <Pressable
                            onPress={fetchAgricoins}
                            hitSlop={11}
                            style={styles.balanceCard}>
                            <Image
                                source={frontCoin}
                                style={styles.coin}
                            />

                            {loading
                                ? <Skelton dimensions={{ height: 35, width: 64, radius: 8 }} />
                                : <View style={styles.balanceText}>
                                    <ThemeText
                                        content={t('agricoins.walletBalance')}
                                        color="#878787"
                                        size={8}
                                    />

                                    <ThemeText
                                        content={balance.toLocaleString()}
                                        variant="sm"
                                        fontFamily="MontserratBold"
                                        color="#0c0700"
                                        style={styles.titleSpacing}
                                    />
                                </View>}
                        </Pressable>
                    </View>
                </LinearGradient>
            </Pressable>
        </>
    );
};

export default memo(MyCoins);

const styles = StyleSheet.create({

    gradient: {
        borderRadius: 22,
        borderCurve: 'continuous',
        padding: 16,
        paddingHorizontal: 24,
        gap: 8,
        position: 'relative',
        overflow: 'hidden',
        borderBottomWidth: 2,
        borderRightWidth: 1,
        borderLeftWidth: 0.15,
        borderColor: '#d99f00ff'

    },

    backgroundCoin: {
        position: 'absolute',
        width: 180,
        height: 180,
        right: -48,
        top: -32,
        opacity: 0.3,
        resizeMode: 'contain',
        zIndex: 1,
        transform: [
            { skewY: '10deg' },
            { perspective: 100 },
            { rotateX: '10deg' }
        ]
    },

    titleSpacing: {
        letterSpacing: 0.25,
    },

    description: {
        maxWidth: 200,
    },

    footer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },

    balanceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingRight: 4,
        minWidth: 100,
        zIndex: 1
    },

    coin: {
        width: 32,
        height: 32,
    },

    balanceText: {
        flex: 1,
    },
});