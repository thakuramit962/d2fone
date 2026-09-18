import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { useTheme } from '@/hooks/use-theme'
import { EComProduct } from '@/models/eComProduct'
import { dimensions } from '@/utils/app-helper'
import { Image, Pressable, StyleSheet, View } from 'react-native'


type EComItemProps = {
    product: EComProduct
    small?: boolean
    onPress?: (product: EComProduct) => void
}

const ProductItem = ({ product, small, onPress }: EComItemProps) => {
    const theme = useTheme()
    const imageSource = product.images?.length ?
        { uri: product?.images[0] }
        : require('@/assets/images/static/d2f.png')
    return (
        <Pressable
            onPress={() => onPress?.(product)}
            style={({ pressed }) => [
                styles.item,
                {
                    borderColor: `${theme.text.primary}25`,
                    flexDirection: small ? 'column' : 'row',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    flexGrow: !small ? 1 : 0,
                    minWidth: small ? 150 : dimensions.width * 0.9,
                    opacity: pressed ? 0.7 : 1,
                },
            ]}
        >
            <Image
                source={imageSource}
                style={[
                    styles.itemImage,
                    {
                        borderColor: `${theme.text.primary}10`,
                        backgroundColor: theme.background.main,
                        width: small ? '100%' : 140,
                    },
                ]}
            />

            <View style={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: small ? 8 : undefined,
                paddingBottom: small ? 12 : undefined,
            }}>
                <ThemeText content={product.product_name} variant="xs" fontFamily="MontserratSemiBold" numberOfLines={1} />
                <ThemeDivider size={1} />
                <ThemeText content={product.description} severity="secondary" size={12} numberOfLines={2} style={{ height: 34 }} />
                {/* <ThemeDivider size={8} />
                <ThemeText content={currencyFormatter(+product.product_price)} severity="primary" size={12} fontFamily="InterBold" /> */}
            </View>

            {onPress &&
                <ThemeText
                    content={'View >>'}
                    style={styles.viewLink}
                    severity="main"
                    size={12}
                    fontFamily="MontserratMedium"
                />}
        </Pressable>
    )
}

export default ProductItem


const styles = StyleSheet.create({
    item: {
        borderRadius: 32,
        borderCurve: 'continuous',
        padding: 6,
        borderWidth: 1,
        flexWrap: 'wrap',
        gap: 8,
    },
    itemImage: {
        height: 110,
        resizeMode: 'contain',
        borderRadius: 26,
        borderWidth: 1,
    },
    viewLink: {
        position: 'absolute',
        right: 24,
        bottom: 6,
    },
})
