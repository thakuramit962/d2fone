import ComingSoonTag from '@/components/basic/comingSoonTag'
import CompanyFooter from '@/components/basic/companyFooter'
import ModernDetailItem from '@/components/basic/modernDetailItem'
import ExploreHero from '@/components/basic/pages/explorePage/ExploreHero'
import {
    IdeaBulbIcon
} from '@/components/basic/pages/explorePage/icon'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { useTheme } from '@/hooks/use-theme'
import useAppText from '@/hooks/useAppText'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { FeaturedTool } from '@/models/commonTypes'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View
} from 'react-native'


interface ImageCardProps extends FeaturedTool {
    width?: number
}

const BORDERED_CARD_STYLE_BASE: object = {
    borderWidth: 1,
    borderRadius: 24,
}
const FULL_WIDTH_CARD: object = {
    ...BORDERED_CARD_STYLE_BASE,
    width: '100%',
}


// ─── Sub-components (memoized) ────────────────────────────────────────────────

const ImageCard = memo(({ img, title, width, link }: ImageCardProps) => {
    const theme = useTheme()

    const cardStyle = useMemo(
        () => [
            styles.imageCard,
            {
                borderColor: `${theme.text.disabled}25`,
                backgroundColor: theme.background.main,
                width: width ?? ('auto' as const),
            },
        ],
        [theme.text.disabled, theme.background.main, width]
    )

    return (
        <Pressable
            onPress={() => {
                link && router.navigate(link)
            }}
            style={cardStyle}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            <Image source={img} style={styles.imageCardImg} accessibilityIgnoresInvertColors />
            <ThemeText
                content={title}
                fontFamily="MontserratMedium"
                size={12}
                style={styles.centered}
            />
        </Pressable>
    )
})

ImageCard.displayName = 'ImageCard'

// ─── Main Component ───────────────────────────────────────────────────────────

const Explore = () => {
    const theme = useTheme()
    const { width: screenWidth } = useWindowDimensions()

    const scrollRef = useScrollToTop()
    const { t } = useTranslation()
    const { explore } = useAppText()
    const {
        fertilizerCalculator,
        mandiRate,
        sprayCalculator,
        weatherForecast,
        yieldPredictor,
        sprayService,
        ecommerce,
        soilHealth,
        cropCalendar,
        irrigation,
        khetiCenter,
        insurance,
        rewards,
        helpline
    } = explore

    const cardWidth = useMemo(() => screenWidth / 2 - 20, [screenWidth])
    const imageCardWidth = useMemo(() => screenWidth / 3 - 20, [screenWidth])

    const borderedCardStyle = useMemo(
        () => ({
            ...BORDERED_CARD_STYLE_BASE,
            borderColor: `${theme.text.primary}25`,
        }),
        [theme.text.primary]
    )

    const dimmedBorderedCardStyle = useMemo(
        () => ({
            ...borderedCardStyle,
            opacity: 0.5,
        }),
        [theme.text.primary]
    )

    return (
        <View style={styles.flex}>
            <ExploreHero />

            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
            >
                <View style={{ padding: 16 }}>
                    <ModernDetailItem
                        containerStyle={{
                            ...BORDERED_CARD_STYLE_BASE,
                            borderColor: `${theme.text.primary}25`,
                        }}
                        iconSize={64}
                        iconOpacity={1}
                        img={sprayService?.img}
                        borderRadius={24}
                        padding={8}
                        onPress={() => router.navigate('/sprays')}
                        actionIcon={null}
                    >
                        <ThemeText
                            content={sprayService.title}
                            fontFamily="MontserratSemiBold"
                            variant="xs"
                        />
                        <ThemeText
                            content={sprayService?.description ?? ' '}
                            fontFamily="InterRegular"
                            variant="xxs"
                            severity="secondary"
                            numberOfLines={3}
                            ellipsizeMode="tail"
                        />
                    </ModernDetailItem>
                </View>

                <LinearGradient
                    colors={[theme.background.slate, theme.background.main]}
                    style={styles.smartToolsSection}>
                    <View style={styles.smartToolsHeader}>
                        <IdeaBulbIcon size={24} />
                        <View style={styles.flexOne}>
                            <ThemeText
                                content={t('explore.smartToolsTitle')}
                                variant="xs"
                                fontFamily="MontserratBold"
                                severity="main"
                            />
                            <ThemeText
                                content={t('explore.smartToolsDesc')}
                                severity="secondary"
                            />
                        </View>
                    </View>

                    <View style={styles.smartToolsGrid}>

                        {[yieldPredictor, sprayCalculator, fertilizerCalculator, weatherForecast, mandiRate, ecommerce].map((item, i) => (
                            <View key={i} style={{ width: cardWidth }}>
                                <ModernDetailItem
                                    key={i}
                                    containerStyle={{ ...borderedCardStyle, flex: 1 }}
                                    iconSize={56}
                                    iconOpacity={1}
                                    seperateChild
                                    borderRadius={24}
                                    padding={8}
                                    onPress={() => item?.link && router.navigate(item.link)}
                                    img={item.img1 ? item.img1 : item.img}
                                    children={
                                        <>
                                            <ThemeText
                                                content={`${item.title}`}
                                                fontFamily="MontserratSemiBold"
                                                variant="xs"
                                            />
                                            <ThemeText
                                                content={item?.description ?? ' '}
                                                fontFamily="InterRegular"
                                                variant="xxs"
                                                severity="secondary"
                                                numberOfLines={3}
                                                ellipsizeMode="tail"
                                            />
                                        </>
                                    }
                                />
                            </View>
                        ))}
                    </View>

                </LinearGradient>

                <View style={styles.usefulLinksContainer}>
                    <ThemeText
                        content={t('explore.otheruseFulLinks')}
                        fontFamily="MontserratSemiBold"
                        variant="xs"
                    />
                    <ThemeDivider size={12} />

                    <View style={styles.imageCardRow}>
                        {[rewards, helpline].map((item) => (
                            <ImageCard
                                key={item.id}
                                {...item}
                                width={imageCardWidth}
                            />
                        ))}
                    </View>
                </View>

                <ThemeDivider size={32} />
                <ThemeText
                    content={t('explore.comingSoon')}
                    fontFamily="MontserratSemiBold"
                    variant="xs"
                    style={styles.comingSoonHeading}
                />
                <View style={styles.gridContainer}>
                    {[
                        soilHealth,
                        cropCalendar,
                        irrigation,
                        khetiCenter,
                        insurance
                    ].map((item, i) => (
                        <View key={item.title ?? i} style={{ width: cardWidth }}>
                            <ModernDetailItem
                                containerStyle={dimmedBorderedCardStyle}
                                iconSize={28}
                                iconOpacity={1}
                                icon={item.icon}
                                seperateChild
                                borderRadius={24}
                                padding={8}
                                // onPress={() => item?.link && router.navigate(item.link)}
                                actionIcon={null}
                            >
                                <ThemeText
                                    content={`${item.title}`}
                                    fontFamily="InterBold"
                                    variant="xs"
                                />
                                <ThemeText
                                    content={item?.description ?? ' '}
                                    fontFamily="InterRegular"
                                    variant="xxs"
                                    severity="secondary"
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                />
                            </ModernDetailItem>

                            {!item?.link && <ComingSoonTag />}
                        </View>
                    ))}

                </View>

                <CompanyFooter />
            </ScrollView>
        </View>
    )
}

export default memo(Explore)

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    flexOne: {
        flex: 1,
    },

    // Smart tools section
    smartToolsSection: {
        padding: 16,
        borderRadius: 24,
    },
    smartToolsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    smartToolsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        paddingTop: 16,
    },
    smartToolCard: {
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
        borderWidth: 1,
    },
    smartToolImage: {
        height: 64,
        width: 64,
        resizeMode: 'contain',
    },
    smartToolArrow: {
        position: 'absolute',
        right: 8,
        top: 12,
    },

    // Grid
    gridContainer: {
        flexDirection: 'row',
        paddingTop: 0,
        flexWrap: 'wrap',
        gap: 8,
        padding: 16,
    },
    fullWidthCardWrapper: {
        alignSelf: 'stretch',
        width: '100%',
    },
    comingSoonHeading: {
        paddingLeft: 16,
    },

    // ImageCard
    imageCard: {
        borderRadius: 24,
        borderCurve: 'continuous',
        padding: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageCardImg: {
        height: 48,
        width: 48,
        resizeMode: 'contain',
    },

    // Useful links section
    usefulLinksContainer: {
        padding: 16,
    },
    imageCardRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },

    // Shared
    centered: {
        textAlign: 'center',
    },
})