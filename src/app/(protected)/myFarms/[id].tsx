import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, View } from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';

import BottomSheet from '@/components/basic/bottomSheet';
import CompanyFooter from '@/components/basic/companyFooter';
import LoadingScreen from '@/components/basic/containers/loadingScreen';
import ScreenView from '@/components/basic/containers/screenView';
import {
    formatCoordinates,
    isFarmInactive,
    parseCoordinates,
} from '@/components/basic/pages/farms';
import { FarmMap } from '@/components/basic/pages/farms/farmMap';
import FarmForm from '@/components/basic/pages/farms/form/farmForm';
import DetailLine from '@/components/basic/text/detailLine';
import ThemeText from '@/components/basic/text/ThemeText';
import TextDivider from '@/components/basic/textDivider';
import ThemeButton from '@/components/basic/ThemeButton';
import ThemeDivider from '@/components/basic/ThemeDivider';
import { InfoIcon, LocationFilledIcon } from '@/components/icons';
import Header from '@/components/layout/navigation/Header';
import { s3BucketUrl } from '@/constants/appConstant';
import useFarms from '@/hooks/use-farms';
import { useTheme } from '@/hooks/use-theme';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Farm } from '@/models/user';
import { RootState } from '@/store/store';
import { dimensions } from '@/utils/app-helper';
import { useTranslation } from 'react-i18next';


FarmMap.displayName = 'FarmMap';

const HEADER_IMAGE_HEIGHT = 180;
const SCROLL_THRESHOLD = 40; // px scrolled before image hides

const FarmDetails = () => {
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const theme = useTheme();
    const { loading } = useFarms();
    const scrollRef = useScrollToTop()

    const imageHeightAnim = useRef(new Animated.Value(HEADER_IMAGE_HEIGHT)).current;
    const isHiddenRef = useRef(false);

    const handleScroll = (e: any) => {
        const y = e.nativeEvent.contentOffset.y;

        if (y > SCROLL_THRESHOLD && !isHiddenRef.current) {
            isHiddenRef.current = true;
            Animated.timing(imageHeightAnim, {
                toValue: 0,
                duration: 220,
                useNativeDriver: false,
            }).start();
        } else if (y <= SCROLL_THRESHOLD && isHiddenRef.current) {
            isHiddenRef.current = false;
            Animated.timing(imageHeightAnim, {
                toValue: HEADER_IMAGE_HEIGHT,
                duration: 220,
                useNativeDriver: false,
            }).start();
        }
    };

    const selectorFarms = useSelector(
        (state: RootState) => state.auth?.currentUser?.userFarms,
        shallowEqual
    );

    const farms: Farm[] = useMemo(() => {
        return Array.isArray(selectorFarms)
            ? selectorFarms
            : selectorFarms
                ? [selectorFarms]
                : [];
    }, [selectorFarms]);

    const selectedFarm = useMemo(
        () => farms.find(farm => String(farm.id) === String(id)),
        [farms, id]
    );

    if (!loading && !selectedFarm) {
        return (
            <ScreenView>
                <Header
                    backIcon
                    description={t('farmDetails.header.title')}
                    label={t('farmDetails.header.notFoundTitle')}
                />

                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ThemeText
                        content={t('farmDetails.header.notFoundDescription')}
                        severity="error"
                    />

                    <ThemeDivider size={20} />

                    <ThemeButton
                        label={t('farmDetails.buttons.goBack')}
                        variant="sm"
                        onPress={() => router.back()}
                    />
                </View>
            </ScreenView>
        );
    }

    if (loading || !selectedFarm) {
        return (
            <ScreenView>
                <Header
                    backIcon
                    description={t('farmDetails.header.title')}
                    label={t('farmDetails.header.loading')}
                />
                <LoadingScreen />
            </ScreenView>
        );
    }

    const isInactive = useMemo(
        () => isFarmInactive(selectedFarm.status),
        [selectedFarm.status]
    );

    const coords = useMemo(
        () => parseCoordinates(selectedFarm.location_coordinates),
        [selectedFarm.location_coordinates]
    );

    const coordsDisplay = useMemo(
        () => formatCoordinates(coords),
        [coords]
    );

    const region = useMemo(
        () => ({
            ...coords,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }),
        [coords]
    );

    const address = useMemo(
        () =>
            [
                selectedFarm.address,
                selectedFarm.village,
                selectedFarm.sub_district,
                selectedFarm.pin_code,
            ]
                .filter(Boolean)
                .join(', '),
        [selectedFarm]
    );

    const regionText = useMemo(
        () =>
            [selectedFarm.district, selectedFarm.state]
                .filter(Boolean)
                .join(', '),
        [selectedFarm]
    );

    const dynamicStyles = useMemo(
        () => ({
            card: {
                borderColor: `${theme.text.primary}25`,
            },
            acreageBadge: {
                backgroundColor: `${theme.text.primary}10`,
            },
        }),
        [theme.text.primary]
    );

    const [editForm, setEditForm] = useState(false);

    const farmValues = {
        farm_name: selectedFarm.field_area,
        acerage: selectedFarm.acerage,
        current_crop: selectedFarm?.current_crop ?? '',
        address: selectedFarm.address,
        district: selectedFarm.district,
        state: selectedFarm.state,
        sub_district: selectedFarm.sub_district,
        village: selectedFarm.village,
        pin: selectedFarm.pin_code ?? '',
        latitude: region?.latitude ? String(region?.latitude) : undefined,
        longitude: region?.longitude ? String(region?.longitude) : undefined,
        status: selectedFarm?.status
    }

    return (
        <ScreenView edges={['bottom', 'left', 'right']} bg={theme.background?.slate}>

            <Header
                backIcon
                description={t('farmDetails.header.title')}
                label={selectedFarm.field_area ?? t('farmDetails.header.defaultTitle')}
                rightSlot={
                    <ThemeButton
                        buttonStyle={{
                            minWidth: 90,
                            height: 30,
                        }}
                        label={t('farmDetails.buttons.edit')}
                        variant="xs"
                        onPress={() => setEditForm(true)}
                    />
                }
                bottomSlot={
                    selectedFarm.farm_image
                        ? <Animated.View
                            style={{
                                height: imageHeightAnim,
                                width: '100%',
                                borderRadius: 24,
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                source={{ uri: `${s3BucketUrl}/${selectedFarm.farm_image}` }}
                                style={{
                                    height: HEADER_IMAGE_HEIGHT,
                                    width: '100%',
                                    resizeMode: 'cover',
                                }}
                            />
                        </Animated.View>
                        : null
                }
            />
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={handleScroll}
            >
                <View
                    style={[
                        styles.card,
                        dynamicStyles.card,
                    ]}
                >
                    <View style={styles.headerRow}>
                        <View style={styles.headerLeft}>
                            <ThemeText
                                content={selectedFarm.field_area ?? '-'}
                                fontFamily="MontserratBold"
                                severity={isInactive ? 'error' : 'main'}
                                size={16}
                                style={styles.fieldArea}
                            />

                            {!!coordsDisplay && (
                                <View style={styles.coordRow}>
                                    <LocationFilledIcon
                                        height={10}
                                        width={10}
                                        color={theme.text.secondary}
                                    />

                                    <ThemeText
                                        content={coordsDisplay}
                                        fontFamily="InterRegular"
                                        size={10}
                                        severity="secondary"
                                        selectable
                                        style={styles.coordText}
                                    />
                                </View>
                            )}
                        </View>

                        <View
                            style={[
                                styles.acreageBadge,
                                dynamicStyles.acreageBadge,
                            ]}
                        >
                            <ThemeText
                                content={selectedFarm.acerage ?? '0'}
                                fontFamily="MontserratBlack"
                                size={24}
                                style={styles.acreageNumber}
                            />

                            <ThemeText
                                content={t('farmDetails.card.acres')}
                                fontFamily="InterRegular"
                                size={10}
                                style={styles.acreageLabel}
                            />
                        </View>
                    </View>

                    <TextDivider label={t('farmDetails.card.detailsDivider')} />

                    <View style={styles.detailsContainer}>
                        <DetailLine
                            icon={InfoIcon}
                            iconSize={14}
                            iconColor={theme.text.secondary}
                            label={{
                                content: t('farmDetails.card.farmName'),
                                variant: 'xs',
                            }}
                            description={{
                                content: selectedFarm.field_area ?? '-',
                                variant: 'xs',
                                fontFamily: 'InterMedium',
                            }}
                        />

                        <DetailLine
                            icon={InfoIcon}
                            iconSize={14}
                            iconColor={theme.text.secondary}
                            label={{
                                content: t('farmDetails.card.area'),
                                variant: 'xs',
                            }}
                            description={{
                                content: t('farmDetails.card.acreageValue', { value: selectedFarm.acerage ?? 0 }),
                                variant: 'xs',
                                fontFamily: 'InterMedium',
                            }}
                        />

                        <DetailLine
                            icon={InfoIcon}
                            iconSize={14}
                            iconColor={theme.text.secondary}
                            label={{
                                content: t('farmDetails.card.currentCrop', { crop: '' }),
                                variant: 'xs',
                            }}
                            description={{
                                content:
                                    selectedFarm.current_crop ?? '-na-',
                                variant: 'xs',
                                fontFamily: 'InterMedium',
                            }}
                        />

                        <DetailLine
                            icon={InfoIcon}
                            iconSize={14}
                            iconColor={theme.text.secondary}
                            label={{
                                content: t('farmDetails.card.region'),
                                variant: 'xs',
                            }}
                            description={{
                                content: regionText || '-',
                                variant: 'xs',
                            }}
                        />

                        <DetailLine
                            icon={InfoIcon}
                            iconSize={14}
                            iconColor={theme.text.secondary}
                            label={{
                                content: t('farmDetails.card.status'),
                                variant: 'xs',
                            }}
                            description={{
                                content: isInactive
                                    ? t('farmDetails.card.statusInactive')
                                    : t('farmDetails.card.statusActive'),
                                variant: 'xs',
                                fontFamily: 'InterMedium',
                                severity: isInactive
                                    ? 'error'
                                    : 'success',
                            }}
                        />

                        <View style={{
                            gap: 4,
                            padding: 12, marginHorizontal: -8,
                            backgroundColor: `${theme.text.primary}10`,
                            borderRadius: 16
                        }}>
                            <>
                                <DetailLine
                                    icon={LocationFilledIcon}
                                    label={{
                                        content: t('farmDetails.card.address'),
                                        variant: 'xs', severity: 'disabled'
                                    }}
                                />
                                <DetailLine
                                    description={{
                                        content: address || '-',
                                        variant: 'xxs',
                                    }}
                                />

                            </>
                        </View>


                    </View>

                    {isInactive && (
                        <ThemeText
                            content={t('farmDetails.card.inactiveWarning')}
                            severity="error"
                            size={10}
                            style={styles.inactiveWarning}
                        />
                    )}
                </View>

                <ThemeDivider size={24} />

                <View style={{
                    paddingHorizontal: 12,
                    backgroundColor: theme?.background?.main,
                    paddingVertical: 24,
                    // width: dimensions.width,
                    marginHorizontal: -8,
                    borderRadius: 24,
                }}>
                    <ThemeText content={t('farmDetails.location.title')} fontFamily='MontserratSemiBoldItalic' />

                    <ThemeText content={selectedFarm.location_coordinates ??
                        t('farmDetails.location.coordinatesFallback')} severity='secondary' />
                    <ThemeDivider size={12} />
                    {selectedFarm.location_coordinates &&
                        <View
                            style={styles.mapWrapper}
                            pointerEvents="none"
                        >
                            <FarmMap
                                region={region}
                                coords={coords}
                            />
                        </View>
                    }
                    <ThemeDivider size={100} />
                </View>


                <CompanyFooter withoutBottomPadding />
            </ScrollView>

            <BottomSheet
                onClose={() => {
                    setEditForm(false)
                }}
                visible={editForm}
                height={dimensions.height - 64}

                children={
                    <>
                        <ScrollView style={{
                            padding: 8,
                        }}>

                            <FarmForm
                                mode="edit"
                                farmId={selectedFarm.id}
                                initialValues={farmValues}
                                initialLocation={{
                                    latitude: region?.latitude,
                                    longitude: region?.longitude,
                                    zoom: 15
                                }}
                                initialImageUri={selectedFarm.farm_image ?? ""}
                                onSuccess={() => {
                                    setEditForm(false);
                                }}
                            />


                            <ThemeDivider size={120} />
                        </ScrollView>
                    </>
                }
            />
        </ScreenView>
    );
};

export default FarmDetails;

const styles = StyleSheet.create({
    scrollContent: {
        padding: 8,
        paddingBottom: 40,
    },

    mapWrapper: {
        borderRadius: 24,
        height: 200,
        overflow: 'hidden',
    },

    map: {
        flex: 1,
    },

    card: {
        borderWidth: 1,
        borderRadius: 24,
        padding: 8,
        marginTop: 12,
        minHeight: dimensions.height * 0.35,
        paddingBottom: 32,
    },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        paddingLeft: 12,
    },

    headerLeft: {
        flex: 1,
    },

    coordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    coordText: {
        lineHeight: 10,
    },

    fieldArea: {
        lineHeight: 24,
    },

    acreageBadge: {
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
    },

    acreageNumber: {
        lineHeight: 24,
    },

    acreageLabel: {
        lineHeight: 10,
    },

    detailsContainer: {
        gap: 6,
        paddingHorizontal: 12,
    },

    inactiveWarning: {
        lineHeight: 20,
    },
});