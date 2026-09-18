import { useTheme } from '@/hooks/use-theme';
import useAppText from '@/hooks/useAppText';
import { FeaturedTool } from '@/models/commonTypes';
import { Href, useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import FeaturedToolCard from './featuredToolCard';


const FeaturedTools = () => {
    const theme = useTheme();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { t } = useTranslation();
    const { explore } = useAppText()


    const SECONDARY_TOOLS: FeaturedTool[] = useMemo(() => [
        explore.weatherForecast,
        explore.fertilizerCalculator,
        explore.sprayCalculator,
        explore.yieldPredictor,
    ], [t]);

    const handlePress = useCallback((link: Href) => {
        router.push(link);
    }, [router]);

    const smallCardStyle = useMemo(() => ({
        flex: 1,
        minWidth: width * 0.4,
        alignSelf: 'stretch' as const,
    }), [width]);

    return (
        <View style={styles.container}>
            <FeaturedToolCard
                tool={explore.mandiRate}
                theme={theme}
                onPress={handlePress}
            />

            <View style={styles.grid}>
                {SECONDARY_TOOLS.map((item) => (
                    <View key={item.id} style={smallCardStyle}>
                        <FeaturedToolCard
                            tool={item}
                            theme={theme}
                            onPress={handlePress}
                            small
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        alignContent: 'flex-start',
        alignItems: 'flex-start',
    },
});

export default memo(FeaturedTools);