import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArrowRightIcon } from '@/components/icons';
import { useTheme } from '@/hooks/use-theme';

import { NewsItem } from '.';
import ActionText from '../../text/ActionText';
import ThemeText from '../../text/ThemeText';
import ThemeDivider from '../../ThemeDivider';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399';

type Props = {
    item: NewsItem | null;
    onClose: () => void;
};

export default function NewsView({ item, onClose }: Props) {
    const theme = useTheme();

    const [imageUri, setImageUri] = useState(FALLBACK_IMAGE);

    useEffect(() => {
        setImageUri(item?.imageUrl || FALLBACK_IMAGE);
    }, [item]);

    const formattedDate = useMemo(() => {
        if (!item?.pubDate) return null;
        return dayjs(item.pubDate).format('DD MMMM YYYY');
    }, [item?.pubDate]);

    const handleOpenArticle = useCallback(async () => {
        if (!item?.link) return;

        try {
            const supported = await Linking.canOpenURL(item.link);

            if (supported) {
                await Linking.openURL(item.link);
            }
        } catch (error) {
            console.warn('Failed to open article:', error);
        }
    }, [item?.link]);

    if (!item) return null;

    return (
        Boolean(item)
            ? <Modal
                visible={Boolean(item)}
                animationType="slide"
                presentationStyle="overFullScreen"
                onRequestClose={onClose}
                transparent
            >
                <SafeAreaView
                    style={[
                        styles.sheet,
                        {
                            backgroundColor: theme.background.main,
                        },
                    ]}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.content}
                    >
                        <View>
                            {item?.imageUrl &&
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.image}
                                    onError={() => setImageUri(FALLBACK_IMAGE)}
                                />
                            }
                            <ThemeDivider size={12} />

                            <ThemeText
                                content={item.title}
                                fontFamily="MontserratSemiBold"
                                variant="md"
                            />

                            {formattedDate && (
                                <ThemeText
                                    content={formattedDate}
                                    severity="disabled"
                                    variant="xs"
                                />
                            )}
                        </View>

                        <ThemeDivider size={16} />

                        <ThemeText
                            content={item.description}
                            size={15}
                            style={styles.description}
                        />

                        <ThemeDivider size={32} />

                        <Pressable
                            onPress={handleOpenArticle}
                            style={[
                                styles.articleButton,
                                {
                                    backgroundColor: `${theme.info}25`,
                                },
                            ]}
                        >
                            <ThemeText
                                content={`Read full article on ${item.source}`}
                                variant="xs"
                                severity="info"
                            />

                            <ArrowRightIcon
                                height={18}
                                width={18}
                                color={theme.info}
                            />
                        </Pressable>

                        <ThemeDivider size={24} />
                    </ScrollView>

                    <ActionText
                        label="Close"
                        action={onClose}
                    />
                </SafeAreaView>
            </Modal>
            : null
    );
}

const styles = StyleSheet.create({
    sheet: {
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 8,
    },

    content: {
        paddingBottom: 16,
    },

    image: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        resizeMode: 'cover',
    },

    description: {
        letterSpacing: 0.5,
        lineHeight: 22,
    },

    articleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 24,
        alignSelf: 'center',
    },
});