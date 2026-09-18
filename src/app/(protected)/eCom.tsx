import BottomSheet from '@/components/basic/bottomSheet'
import ScreenView from '@/components/basic/containers/screenView'
import ProductItem from '@/components/basic/pages/eCom/productItem'
import RequestForm from '@/components/basic/pages/eCom/requestForm'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import useECommerce from '@/hooks/useECommerce'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { EComProduct } from '@/models/eComProduct'
import { dimensions } from '@/utils/app-helper'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useState } from 'react'
import { Image, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'


const ECom = () => {
    const theme = useTheme()
    const scrollRef = useScrollToTop()

    const { products, fetchProducts } = useECommerce()
    const [selected, setSelected] = useState<null | EComProduct>(null)
    const imageSource = selected && selected.images?.length
        ? { uri: selected?.images[0] }
        : require('@/assets/images/static/d2f.png')

    const handlePressProduct = useCallback((product: EComProduct) => {
        setSelected(product)
    }, [])

    useEffect(() => { fetchProducts() }, [])

    return (
        <>
            <LinearGradient
                style={styles.flex1}
                colors={[theme.background.main, theme.background.slate]}
            >
                <ScreenView bg={'transparent'}>
                    <Header
                        backIcon
                        withoutTopPadding
                        bottomSlot={
                            <View style={styles.headerSlot}>
                                <ThemeText content={'OUR PRODUCTS'} fontFamily="MontserratBold" variant="sm" />
                                <ThemeText
                                    content={'Precision Solutions'}
                                    severity="main"
                                    style={styles.letterSpacing}
                                    fontFamily="MontserratMedium"
                                />
                            </View>
                        }
                    />
                    <ScrollView
                        ref={scrollRef}
                        refreshControl={<RefreshControl refreshing={products?.loading} onRefresh={fetchProducts} />}>

                        <View style={styles.heroContainer}>
                            <Image
                                source={require('@/assets/images/static/eComIllustration.png')}
                                style={styles.heroImage}
                            />
                            <ThemeText
                                content={'Precision agriculture solutions suitable for your farm needs'}
                                variant="xs"
                                style={styles.heroCaption}
                            />
                        </View>
                        <ThemeDivider size={32} />

                        <View style={[
                            {
                                backgroundColor: theme.background.slate,
                                flex: 1,
                                padding: 8,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: 8,
                            }]}>
                            {products?.data
                                ?.map((product, i) => (
                                    <ProductItem
                                        key={product.id}
                                        product={product}
                                        onPress={handlePressProduct}
                                    />
                                ))}
                        </View>
                        <ThemeDivider size={100} />
                    </ScrollView>
                </ScreenView>
            </LinearGradient>
            {selected &&
                <BottomSheet
                    visible={Boolean(selected)}
                    onClose={() => setSelected(null)}
                    height={dimensions.height * 0.9}
                    children={
                        <>
                            <ScrollView>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'flex-start'
                                }}>
                                    <Image
                                        source={imageSource}
                                        style={[
                                            styles.itemImage,
                                            {
                                                backgroundColor: theme.background.main,
                                                width: '100%',
                                            },
                                        ]}
                                    />

                                    <View style={{
                                        // flex: 1,
                                        paddingHorizontal: 8,
                                    }}>
                                        <ThemeText content={selected.product_name} variant="sm" fontFamily="MontserratSemiBold" numberOfLines={1} />
                                        {/* <ThemeText content={currencyFormatter(+selected.product_price)} severity="primary" size={14} fontFamily="InterBold" /> */}
                                        <ThemeDivider size={8} />
                                        <ThemeText content={selected.description} severity="secondary" size={12} />
                                    </View>

                                    <ThemeDivider size={32} />


                                    <RequestForm productId={selected?.id} callback={() => setSelected(null)} />
                                </View>
                            </ScrollView>
                            <ActionText label='Close' action={() => setSelected(null)} severity='main' variant='xs' withIcon={false} />
                            <ThemeDivider size={32} />
                        </>
                    }
                />
            }
        </>
    )
}

export default ECom



const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    headerSlot: {
        alignItems: 'center',
        marginTop: -42,
        marginHorizontal: 42,
    },
    letterSpacing: {
        letterSpacing: 1,
    },
    heroContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    heroImage: {
        width: '100%',
        height: 260,
        resizeMode: 'contain',
    },
    heroCaption: {
        textAlign: 'center',
        maxWidth: 240,
        marginTop: -24
    },
    listSection: {
        gap: 8,
        padding: 16,
    },
    gridSection: {
        gap: 8,
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#f16334'
    },
    item: {
        borderRadius: 32,
        borderCurve: 'continuous',
        padding: 6,
        borderWidth: 1,
        flexWrap: 'wrap',
        gap: 8,
    },
    itemImage: {
        height: 140,
        resizeMode: 'contain',
        borderRadius: 26,
    },
    viewLink: {
        position: 'absolute',
        right: 24,
        bottom: 6,
    },
})