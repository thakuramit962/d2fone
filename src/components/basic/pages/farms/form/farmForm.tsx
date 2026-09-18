import { GraphicPickerHandle } from '@/components/basic/inputs/imageInput/graphicPicker';
import ThemeInput from '@/components/basic/inputs/ThemeInput';
import { LocationData, MapRegion } from '@/components/basic/location/locationPicker';
import { MAP_VIEW_HEIGHT } from '@/components/basic/location/locationUtils';
import ModernDetailItem from '@/components/basic/modernDetailItem';
import NotesSection from '@/components/basic/notesSection';
import Skelton from '@/components/basic/Skelton';
import ActionText from '@/components/basic/text/ActionText';
import ThemeText from '@/components/basic/text/ThemeText';
import ThemeDivider from '@/components/basic/ThemeDivider';
import { InfoIcon } from '@/components/icons';
import API from '@/constants/api';
import useFarms from '@/hooks/use-farms';
import { useTheme } from '@/hooks/use-theme';
import { useThrottle } from '@/hooks/use-throttle';
import { useToast } from '@/hooks/useToast';
import { updateProcessingState } from '@/slices/processing-state-slice';
import { RootState } from '@/store/store';
import { dimensions } from '@/utils/app-helper';
import { FARM_NOTES } from '@/utils/notes';
import { router } from 'expo-router';
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Switch,
    TextInput,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// ─── Lazy imports ────────────────────────────────────────────────────────────
const LocationPicker = lazy(() => import('@/components/basic/location/locationPicker'));
const LocationForm = lazy(() => import('@/components/basic/location/locationForm'))
const GraphicPicker = lazy(() => import('@/components/basic/inputs/imageInput/graphicPicker'))

// ─── Constants ───────────────────────────────────────────────────────────────
const ACREAGE_REGEX = /^\d+(\.\d{1,2})?$/;
const SUBMIT_THROTTLE_MS = 4000;
const SUBMIT_TIMEOUT_MS = 30000;
const SUBMIT_BTN_MAX_WIDTH = 300;
const SUBMIT_BTN_WIDTH_RATIO = 0.7;


// ─── Types ───────────────────────────────────────────────────────────────────
export type CreateFarmFormValues = {
    farm_name: string;
    sub_district: string;
    village: string;
    district: string;
    state: string;
    pin: string;
    latitude: string;
    longitude: string;
    address: string;
    acerage: string;
    current_crop: string;
    iot_devices: string;
    status?: string
};

const DEFAULT_VALUES: CreateFarmFormValues = {
    farm_name: '',
    sub_district: '',
    village: '',
    district: '',
    state: '',
    pin: '',
    latitude: '',
    longitude: '',
    address: '',
    acerage: '',
    current_crop: '',
    iot_devices: '',
};

type FarmFormMode = 'create' | 'edit';

// FIX: MODE_CONFIG now holds only structural config (endpoints, HTTP verb,
// navigation, reset behavior) — nothing translated. Previously this object
// was a module-level `const` whose label strings were resolved once, at
// import time, via a standalone `i18n.t()` call. That meant the submit
// button, success toast, and section title would stay in whatever language
// was active when the JS module first loaded, and would NOT update if the
// user switched languages later without a full app restart — while every
// other string in this form (driven by the component-scoped `t` from
// useTranslation()) updated correctly. Labels are now computed inside the
// component via useMemo, using the live `t`. See `labels` below.
const MODE_CONFIG: Record<
    FarmFormMode,
    {
        endpoint: (farmId?: string | number) => string;
        httpMethod: 'post' | 'put' | 'patch';
        navigateOnSuccess: (farmId?: string | number) => void;
        resetOnSuccess: boolean;
    }
> = {
    create: {
        endpoint: () => '/v1/create-farm',
        httpMethod: 'post',
        navigateOnSuccess: () => router.navigate('/myFarms'),
        resetOnSuccess: true,
    },
    edit: {
        endpoint: () => '/v1/update-farm',
        httpMethod: 'post',
        navigateOnSuccess: () => router.back(),
        resetOnSuccess: false,
    },
};

export type FarmFormProps = {
    mode?: FarmFormMode;
    farmId?: string | number;
    initialValues?: Partial<CreateFarmFormValues>;
    initialLocation?: MapRegion | null;
    initialImageUri?: string;
    onSuccess?: (farmId?: string | number) => void;
};

const FarmForm = ({
    mode = 'create',
    farmId,
    initialValues,
    initialLocation = null,
    onSuccess,
}: FarmFormProps) => {
    const config = MODE_CONFIG[mode];
    const isMisconfiguredEdit = mode === 'edit' && !farmId;

    const theme = useTheme();
    const dispatch = useDispatch();
    const farmerId = useSelector(
        (state: RootState) => state.auth?.currentUser?.farmerDetails?.id,
    );
    const { showToast } = useToast()
    const { fetchFarms } = useFarms()
    const { t } = useTranslation()

    // FIX: labels are now derived live from the component-scoped `t`, so they
    // re-render correctly on language switch instead of being frozen at
    // module-load time (see MODE_CONFIG comment above).
    const labels = useMemo(
        () => ({
            submitLabel:
                mode === 'edit'
                    ? t('farmForm.buttons.saveChanges')
                    : t('farmForm.buttons.create'),
            submittingLabel:
                mode === 'edit'
                    ? t('farmForm.buttons.saving')
                    : t('farmForm.buttons.creating'),
            successMessage:
                mode === 'edit'
                    ? t('farmForm.successToast.updateMessage')
                    : t('farmForm.successToast.createMessage'),
            sectionTitle:
                mode === 'edit'
                    ? t('farmForm.sections.editDetails')
                    : t('farmForm.sections.basicDetails'),
        }),
        [mode, t],
    );

    const farmImage = useRef<GraphicPickerHandle>(null);

    // TextInput focus refs for keyboard navigation
    const farmNameRef = useRef<TextInput>(null);
    const acerageRef = useRef<TextInput>(null);
    const cropRef = useRef<TextInput>(null);
    const iotDevicesRef = useRef<TextInput>(null);

    const [location, setLocation] = useState<MapRegion | null>(initialLocation);
    const [status, setStatus] = useState<boolean>(true);

    const mergedDefaultValues = useMemo<CreateFarmFormValues>(
        () => ({ ...DEFAULT_VALUES, ...initialValues }),
        [],
    );

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        clearErrors,
        reset,
    } = useForm<CreateFarmFormValues>({
        defaultValues: mergedDefaultValues,
        mode: 'onBlur',
    });

    useEffect(() => {
        if (initialValues) {
            reset({ ...DEFAULT_VALUES, ...initialValues });
            if (initialValues.status !== undefined) {
                setStatus(String(initialValues.status) === '1');
            }
        }
        if (initialLocation) {
            setLocation(initialLocation);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues, initialLocation]);

    const resetForm = useCallback(() => {
        reset(DEFAULT_VALUES);
        setLocation(null);
        farmImage.current?.clearImage();
    }, [reset])

    const submitFarm = useCallback(
        async (values: CreateFarmFormValues) => {
            if (!farmerId) {
                Alert.alert('Error', t('farmForm.errorToast.farmerIdNotFound'));
                return;
            }
            if (mode === 'edit' && !farmId) {
                Alert.alert('Error', t('farmForm.errorToast.missingFarmRef'));
                return;
            }

            dispatch(updateProcessingState(true));
            try {
                const data = new FormData();
                data.append('farmer_id', String(farmerId));
                if (mode === 'edit' && farmId) {
                    data.append('farm_id', String(farmId));
                }
                data.append('field_area', values.farm_name.trim());
                data.append('sub_district', values.sub_district.trim());
                data.append('village', values.village.trim());
                data.append('district', values.district.trim());
                data.append('state', values.state.trim());
                data.append('pin_code', values.pin.trim());

                const latitude = values.latitude || initialValues?.latitude;
                const longitude = values.longitude || initialValues?.longitude;
                data.append(
                    'location_coordinates',
                    latitude ? `latitude: ${latitude}, longitude: ${longitude}` : '',
                );

                data.append('address', values.address.trim());
                data.append('acerage', values.acerage.trim());
                data.append('current_crop', values.current_crop.trim());
                data.append('iot_devices', values.iot_devices.trim());

                const imageUri = farmImage.current?.getImage();
                if (imageUri) {
                    // NOTE: mime type is hardcoded to image/jpeg regardless of the
                    // actual file GraphicPicker returns. If it can ever produce a
                    // PNG/HEIC and the backend validates content-type strictly,
                    // this will cause silent upload rejections — worth confirming
                    // against GraphicPicker's actual output format.
                    data.append('farm_image', {
                        uri: imageUri,
                        type: 'image/jpeg',
                        name: 'farm.jpg',
                    } as unknown as Blob);
                }
                if (mode === 'edit') {
                    data.append('status', !status ? '0' : '1');
                }

                const response = await API[config.httpMethod](config.endpoint(farmId), data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: SUBMIT_TIMEOUT_MS,
                });

                if (response.data?.status === 'success') {
                    showToast('Success', labels.successMessage, 'success')
                    fetchFarms({})
                    if (config.resetOnSuccess) {
                        resetForm()
                    }
                    onSuccess?.(farmId)
                    config.navigateOnSuccess(farmId)
                } else {
                    showToast('Error', response.data?.message || 'Something not working.', 'error')
                }
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } }; message?: string };
                const message =
                    err?.response?.data?.message ??
                    err?.message ??
                    (mode === 'edit' ? t('farmForm.errorToast.updateFailed') : t('farmForm.errorToast.createFailed'))
                showToast('Error', message, 'error')
            } finally {
                dispatch(updateProcessingState(false));
            }
        },
        [farmerId, farmId, mode, config, dispatch, fetchFarms, resetForm, showToast, onSuccess, status, initialValues, labels.successMessage, t],
    );

    const onSubmit = useThrottle((values: CreateFarmFormValues) => {
        void submitFarm(values);
    }, SUBMIT_THROTTLE_MS);

    // ── Location change handler ───────────────────────────────────────────────

    const handleLocationChange = useCallback(
        (data: LocationData) => {
            setLocation({ latitude: data.latitude, longitude: data.longitude, zoom: 15 });
            setValue('latitude', data.latitude.toFixed(7), { shouldValidate: true });
            setValue('longitude', data.longitude.toFixed(7), { shouldValidate: true });
            if (data.address) {
                setValue('address', data.address, { shouldValidate: true });
            }
        },
        [setValue],
    );

    const toggleStatus = useCallback(() => setStatus((prev) => !prev), []);

    const cardStyle = useMemo(
        () => [styles.card, { borderColor: `${theme?.text?.primary}25` }],
        [theme?.text?.primary],
    );
    const submitBtnStyle = useMemo(
        () => [
            styles.submitBtn,
            isSubmitting && styles.submitBtnDisabled,
            { backgroundColor: theme.text.primary },
        ],
        [isSubmitting, theme.text.primary],
    );

    if (isMisconfiguredEdit) {
        if (__DEV__) {
            console.warn('FarmForm: "farmId" is required when mode="edit"');
        }
        return (
            <ThemeText
                content={t('farmForm.errorToast.loadFailed')}
                severity="secondary"
            />
        );
    }

    return (
        <>
            {/* ── Basic details card ── */}
            <View
                style={cardStyle}
                accessibilityRole="none"
                accessible={false}
            >
                <ThemeText
                    content={labels.sectionTitle}
                    fontFamily="MontserratSemiBold"
                    variant="xs"
                    style={styles.sectionTitle}
                />

                {/* Farm name */}
                <Controller
                    control={control}
                    name="farm_name"
                    rules={{ required: t('farmForm.form.farmNameRequiredError') }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <ThemeInput
                            ref={farmNameRef}
                            value={value}
                            label={t('farmForm.form.farmNameLabel')}
                            required
                            size={38}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={t('farmForm.form.farmNamePlaceholder')}
                            helperText={errors.farm_name?.message ?? ' '}
                            error={!!errors.farm_name}
                            returnKeyType="next"
                            onSubmitEditing={() => acerageRef.current?.focus()}
                            variant="solid"
                        />
                    )}
                />

                {/* Acreage + Current crop row */}
                <View style={styles.row}>
                    <Controller
                        control={control}
                        name="acerage"
                        rules={{
                            required: t('farmForm.form.acreageRequiredError'),
                            pattern: {
                                value: ACREAGE_REGEX,
                                message: t('farmForm.form.acreageInvalidError'),
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <ThemeInput
                                ref={acerageRef}
                                value={value}
                                label={t('farmForm.form.acreageLabel')}
                                required
                                mainContainerStyle={styles.half}
                                size={42}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="e.g. 6.5"
                                keyboardType="decimal-pad"
                                helperText={errors.acerage?.message ?? ' '}
                                error={!!errors.acerage}
                                returnKeyType="next"
                                onSubmitEditing={() => cropRef.current?.focus()}
                                variant="solid"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="current_crop"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <ThemeInput
                                ref={cropRef}
                                value={value}
                                label={t('farmForm.form.cropLabel')}
                                mainContainerStyle={styles.half}
                                size={42}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder={t('farmForm.form.cropPlaceholder')}
                                helperText={errors.current_crop?.message ?? ' '}
                                error={!!errors.current_crop}
                                returnKeyType="next"
                                onSubmitEditing={() => iotDevicesRef.current?.focus()}
                                variant="solid"
                            />
                        )}
                    />
                </View>
                <Suspense
                    fallback={
                        <Skelton dimensions={{ height: 100 }} />
                    }
                >
                    <GraphicPicker ref={farmImage} label={t('farmForm.form.farmImageLabel')} />
                </Suspense>
            </View>

            <ThemeDivider size={16} />

            {/* ── Location card ── */}
            <View
                style={cardStyle}
                accessibilityRole="none"
                accessible={false}
            >
                <ThemeText
                    content={t('farmForm.sections.locationDetails')}
                    fontFamily="MontserratSemiBold"
                    variant="xs"
                    style={styles.sectionTitle}
                />

                <ThemeText
                    content={t('farmForm.sections.locateOnMap')}
                    severity="secondary"
                    style={styles.mapSubtitle}
                />

                <Suspense
                    fallback={
                        <Skelton dimensions={{ height: MAP_VIEW_HEIGHT }} />
                    }
                >
                    <LocationPicker
                        initialRegion={{
                            latitude: location?.latitude ?? 0,
                            longitude: location?.longitude ?? 0,
                            zoom: 15
                        }}
                        onLocationChange={handleLocationChange}
                    />
                </Suspense>

                <ThemeDivider size={16} />

                <Suspense
                    fallback={
                        <Skelton dimensions={{ height: 300 }} />
                    }
                >
                    <LocationForm
                        control={control}
                        errors={errors}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        size={42}
                        initialData={{
                            state: initialValues?.state?.toUpperCase(),
                            district: initialValues?.district?.toUpperCase(),
                            sub_district: initialValues?.sub_district?.toUpperCase(),
                            village: initialValues?.village?.toUpperCase(),
                        }}
                    />
                </Suspense>
            </View>

            {mode === 'edit' &&
                <>
                    <ThemeDivider size={24} />
                    <ModernDetailItem
                        onPress={toggleStatus}
                        icon={InfoIcon}
                        bg={status ? `${theme.success}15` : `${theme.error}15`}
                        label={{ content: t('farmForm.form.statusLabel') }}
                        description={{ content: status ? t('farmForm.form.statusActive') : t('farmForm.form.statusInactive'), severity: status ? 'success' : 'error', variant: 'sm' }}
                        actionIcon={
                            <Switch
                                value={status}
                                onValueChange={toggleStatus}
                                trackColor={{
                                    false: Platform.OS === 'android' ? '#d3d3d3' : theme?.error ?? '#e0e0e0',
                                    true: theme?.success ?? '#4cd964',
                                }}
                                thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
                                ios_backgroundColor={theme?.error ?? '#e0e0e0'}
                                accessibilityRole="switch"
                                accessibilityLabel={t('farmForm.form.statusLabel')}
                                accessibilityState={{ checked: status }}
                            />
                        }
                    />
                </>
            }

            <ThemeDivider size={42} />

            {/* ── Notes ── */}
            <NotesSection NOTES={FARM_NOTES()} />

            <ThemeDivider size={16} />

            {/* ── Submit ── */}
            <Pressable
                style={submitBtnStyle}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                accessibilityLabel={isSubmitting ? labels.submittingLabel : labels.submitLabel}
                accessibilityRole="button"
                accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
                testID="submit-farm-btn"
            >
                <ThemeText
                    content={isSubmitting ? labels.submittingLabel : labels.submitLabel}
                    size={16}
                    fontFamily="MontserratSemiBold"
                    color={theme.background.main}
                    style={styles.submitBtnLabel}
                />
            </Pressable>
            <ThemeDivider size={16} />
            <ActionText label={t('discardAndClose')} action={() => {
                resetForm()
                onSuccess?.(farmId)
            }} severity='main' withIcon={false} />
        </>
    )
}

export default memo(FarmForm)


const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 24,
        borderCurve: 'continuous',
        padding: 16,
    },
    sectionTitle: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    half: {
        flex: 1,
    },
    mapSubtitle: {
        marginLeft: 8,
        marginBottom: 4,
    },
    submitBtn: {
        borderRadius: 18,
        width: dimensions.width * SUBMIT_BTN_WIDTH_RATIO > SUBMIT_BTN_MAX_WIDTH
            ? SUBMIT_BTN_MAX_WIDTH
            : dimensions.width * SUBMIT_BTN_WIDTH_RATIO,
        alignSelf: 'stretch',
        marginHorizontal: 'auto',
        borderCurve: 'continuous',
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    submitBtnDisabled: {
        opacity: 0.6,
    },
    submitBtnLabel: {
        letterSpacing: 0.5,
    },
});