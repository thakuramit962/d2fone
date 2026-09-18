import CompanyFooter from '@/components/basic/companyFooter';
import LoadingScreen from '@/components/basic/containers/loadingScreen';
import ScreenView from '@/components/basic/containers/screenView';
import ThemeDivider from '@/components/basic/ThemeDivider';
import Header from '@/components/layout/navigation/Header';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { dimensions } from '@/utils/app-helper';
import { router } from 'expo-router';
import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';

// ─── Lazy imports ────────────────────────────────────────────────────────────
const FarmForm = lazy(() => import('@/components/basic/pages/farms/form/farmForm'))
const illus = require('@/assets/images/static/farm1.png')


const AddFarm = () => {

    const { t } = useTranslation()
    const scrollRef = useScrollToTop()

    return (
        <ScreenView>
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={Platform.OS === 'android'}
            >
                <ImageBackground
                    source={illus}
                    imageStyle={styles.heroBannerImage}
                    style={styles.heroBanner}
                    accessibilityRole="image"
                    accessibilityLabel="Farm banner"
                >
                    <Header
                        backIcon
                        label={t('addFarm.title')}
                        withoutTopPadding
                        withPadding={false}
                    />
                </ImageBackground>

                <ThemeDivider size={24} />

                <Suspense fallback={<LoadingScreen minHeight={dimensions.height * 0.65} />}>
                    <FarmForm onSuccess={() => router.back()} />
                </Suspense>

                <CompanyFooter withoutBottomPadding />

            </ScrollView>
        </ScreenView>
    );
};

export default AddFarm;



const styles = StyleSheet.create({
    scrollContent: {
        padding: 6,
        // paddingBottom: 40,
    },
    heroBanner: {
        padding: 12,
        height: 160,
        borderRadius: 24,
        borderCurve: 'continuous',
    },
    heroBannerImage: {
        borderRadius: 24,
        resizeMode: 'cover',
    },

    footer: {
        marginHorizontal: -8,
        height: 200,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});