import { BackIcon } from '@/components/icons';
import useAgriNews from '@/hooks/use-agriNews';
import { useTheme } from '@/hooks/use-theme';
import { decodeHtml, dimensions } from '@/utils/app-helper';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import LoadingList from '../../loadingList';
import HorizontalIndicators from '../../pagination/horizontalIndicators';
import Skelton from '../../Skelton';
import ThemeText from '../../text/ThemeText';
import NewsModal from './NewsView';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    source: string;
    imageUrl?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const CARD_WIDTH = Math.min(dimensions.width * 0.75, 300);
const CARD_GAP = 10;


// ── Component ──────────────────────────────────────────────────────────────────
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399';

const NewsCard = ({ item, onPress, fullwidth }: { item: NewsItem; onPress: () => void, fullwidth?: boolean }) => (
    <Pressable
        style={[styles.card,
        { width: fullwidth ? '100%' : CARD_WIDTH }
        ]}
        android_ripple={{ color: '#e8f5e9', borderless: false }}
        onPress={onPress} // 👈 add this
    >
        {item.imageUrl &&
            <Image
                source={{ uri: item.imageUrl ?? FALLBACK_IMAGE }}
                style={styles.image}
                // graceful fallback if image fails
                onError={(e) => {
                    (e.target as any).src = FALLBACK_IMAGE;
                }}
            />}
        <View style={styles.textBlock}>
            <ThemeText
                content={item.source}
                size={8}
                severity="secondary"
                numberOfLines={1}
            />
            <ThemeText
                content={item.title}
                fontFamily="MontserratSemiBold"
                variant="xs"
                numberOfLines={fullwidth ? undefined : 2}

            />
            <ThemeText
                content={decodeHtml(item.description || item.source)}
                variant="xxs"
                severity="secondary"
                numberOfLines={fullwidth ? undefined : 1}
            />

        </View>
    </Pressable>
);

const News = ({ horizontal }: { horizontal?: boolean }) => {
    const theme = useTheme()
    const { news, loading, error, refetch } = useAgriNews();
    const { t } = useTranslation()

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null); // 👈 add this

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: any[] }) => {
            if (viewableItems.length > 0) {
                setCurrentIndex(viewableItems[0].index ?? 0);
            }
        }
    ).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="small" color="#4CAF50" />
                <ThemeText content={t('news.loading')} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable onPress={refetch} style={styles.retryBtn}>
                    <ThemeText content={'Retry'} />
                </Pressable>
            </View>
        );
    }

    return (
        <View>
            <NewsModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
            {loading && !horizontal && <View style={{ paddingHorizontal: 16 }}>
                <LoadingList height={100} count={3} />
            </View>
            }
            <FlatList
                data={loading ? Array.from(Array(3)) : news}
                keyExtractor={(item) => item.link}
                renderItem={({ item, index }) => loading && horizontal ? <Skelton dimensions={{ height: 100, width: dimensions.width * 0.65 }} /> :
                    <NewsCard
                        fullwidth={!horizontal}
                        item={item}
                        onPress={() => setSelectedItem(item)} // 👈 wire press
                    />
                }
                refreshControl={
                    <RefreshControl onRefresh={refetch} refreshing={loading} />
                }
                horizontal={horizontal}
                snapToInterval={CARD_WIDTH + CARD_GAP}
                snapToAlignment="start"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    padding: 16, gap: CARD_GAP, alignItems: 'center',
                    paddingBottom: horizontal ? 16 : 180
                }}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                removeClippedSubviews
                initialNumToRender={3}
                maxToRenderPerBatch={4}
                windowSize={5}
                ListFooterComponent={horizontal
                    ? <>
                        <Pressable
                            onPress={() => router.navigate('/latestNews')}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${theme.info}25`,
                                padding: 12,
                                alignSelf: 'center',
                                borderRadius: 16,
                            }}>
                            <BackIcon size={16} style={{
                                transform: [
                                    { scaleX: -1 }
                                ]
                            }} />
                        </Pressable>
                    </>
                    : null}

            />
            {horizontal &&
                <HorizontalIndicators
                    currentIndex={currentIndex}
                    total={news.length}
                />}
        </View>
    );
};

export default News;

const styles = StyleSheet.create({
    header: {
        fontSize: 16,
        fontWeight: '700',
        marginHorizontal: 16,
        marginBottom: 8,
        color: '#1A1A1A',
    },
    card: {
        flexDirection: 'row',
        elevation: 5,
        shadowColor: '#838383',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 8,
        gap: 4,
    },
    image: {
        width: 92,
        minHeight: 75,
        alignSelf: 'stretch',
        borderRadius: 20,
        resizeMode: 'cover',
    },
    textBlock: {
        flex: 1,
        padding: 4,
        justifyContent: 'center',
    },
    centered: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    loadingText: {
        fontSize: 12,
        color: '#6B7280',
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    retryBtn: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 99,
    },
    retryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});