import useAppText from '@/hooks/useAppText'
import { FeaturedTool } from '@/models/commonTypes'
import { router } from 'expo-router'
import { memo } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import ComingSoonTag from '../../comingSoonTag'
import ThemeText from '../../text/ThemeText'


type ServiceGridProps = {
    theme: any
}

type ServiceCardProps = {
    item: FeaturedTool
    theme: any
}

const ServiceCard = memo(({ item, theme }: ServiceCardProps) => {
    return (
        <>
            <Pressable
                onPress={() =>
                    item?.link &&
                    router.navigate(item.link)
                }
                style={[
                    styles.card,
                    {
                        borderColor: `${theme.text.primary}25`,
                    },
                ]}
            >
                <Image source={item.img} style={[styles.image, {
                    opacity: item?.link ? 1 : 0.5
                }]} />
                <ThemeText
                    content={item.title}
                    fontFamily="MontserratSemiBold"
                    variant='xs'
                    style={{
                        opacity: item?.link ? 1 : 0.5
                    }}
                />
                <ThemeText
                    content={item?.description ?? " "}
                    severity="secondary"
                    variant='xxs'
                    style={{
                        opacity: item?.link ? 1 : 0.5
                    }}
                />
                <ComingSoonTag />
            </Pressable>
        </>
    )
})

const ServiceGrid = ({ theme }: ServiceGridProps) => {
    const { services } = useAppText()
    const { boomSpray, manualSpray, tractorSpray } = services
    return (
        <View style={styles.container}>
            {[tractorSpray, boomSpray, manualSpray]?.map(item => (
                <ServiceCard key={item.id} item={item} theme={theme} />
            ))}
        </View>
    )
}

export default ServiceGrid

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 12,
    },
    card: {
        width: '32%',
        borderRadius: 24,
        borderWidth: 1,
        padding: 8,
        borderCurve: 'continuous',
    },
    image: {
        resizeMode: 'contain',
        borderRadius: 8,
        height: 64,
        width: '100%',
        marginBottom: 6,
    },
})