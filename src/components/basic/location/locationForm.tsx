import API from '@/constants/api';
import { capitalizeWords, dimensions, states } from '@/utils/app-helper';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
    Control,
    Controller,
    FieldErrors,
    FieldValues,
    Path,
    UseFormClearErrors,
    UseFormSetValue,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import SelectInput from '../inputs/SelectInput/NewSelectInput';
import ThemeInput from '../inputs/ThemeInput';

const LOCATION_ENDPOINT = 'get_location_data';
const PIN_CODE_PATTERN = /^[1-9][0-9]{5}$/;

export interface SelectionItemsType {
    id: string;
    label: string;
    value: string;
}

export interface LocationFormInitialData {
    state?: string;
    district?: string;
    sub_district?: string;
    village?: string;
}

export interface LocationFormProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    setValue: UseFormSetValue<TFieldValues>;
    clearErrors: UseFormClearErrors<TFieldValues>;
    size?: number;
    initialData?: LocationFormInitialData;
}

type LocationLevel = 'district' | 'subDistrict' | 'village';

interface LocationListState {
    selected: SelectionItemsType[];
    list: SelectionItemsType[];
}

type LocationState = Record<LocationLevel, LocationListState>;

type LocationAction =
    | { type: 'SET'; level: LocationLevel; payload: Partial<LocationListState> }
    | { type: 'RESET_BELOW'; level: LocationLevel }
    | { type: 'RESET_ALL' };

const EMPTY_LIST_STATE: LocationListState = { selected: [], list: [] };

const toSelectionItem = (value: string, index = 1): SelectionItemsType => ({
    id: `location-${index}`,
    label: value,
    value,
});

const createInitialLocationState = (initialData?: LocationFormInitialData): LocationState => ({
    district: initialData?.district
        ? { selected: [toSelectionItem(initialData.district)], list: [] }
        : { ...EMPTY_LIST_STATE },
    subDistrict: initialData?.sub_district
        ? { selected: [toSelectionItem(initialData.sub_district)], list: [] }
        : { ...EMPTY_LIST_STATE },
    village: initialData?.village
        ? { selected: [toSelectionItem(initialData.village)], list: [] }
        : { ...EMPTY_LIST_STATE },
});

function locationReducer(state: LocationState, action: LocationAction): LocationState {
    switch (action.type) {
        case 'SET':
            return { ...state, [action.level]: { ...state[action.level], ...action.payload } };
        case 'RESET_BELOW':
            if (action.level === 'district') {
                return {
                    ...state,
                    subDistrict: { ...EMPTY_LIST_STATE },
                    village: { ...EMPTY_LIST_STATE },
                };
            }
            if (action.level === 'subDistrict') {
                return { ...state, village: { ...EMPTY_LIST_STATE } };
            }
            return state;
        case 'RESET_ALL':
            return {
                district: { ...EMPTY_LIST_STATE },
                subDistrict: { ...EMPTY_LIST_STATE },
                village: { ...EMPTY_LIST_STATE },
            };
        default:
            return state;
    }
}

const generateStatesList = (): SelectionItemsType[] =>
    states
        .map((state, index) => ({
            id: `state-${index + 1}`,
            label: state,
            value: capitalizeWords(state),
        }))
        .sort((a, b) => a.value.replace(/\s/g, '').localeCompare(b.value.replace(/\s/g, '')));

export const STATES_LIST: SelectionItemsType[] = generateStatesList();

function LocationForm<TFieldValues extends FieldValues = FieldValues>({
    control,
    errors,
    setValue,
    clearErrors,
    size = 42,
    initialData,
}: any) {
    const { t } = useTranslation();
    const INPUT_SIZE = size;

    const levelErrorLabel: Record<LocationLevel, string> = {
        district: t('locationForm.levels.district'),
        subDistrict: t('locationForm.levels.sub-district'),
        village: t('locationForm.levels.village'),
    };

    const fieldName = (name: 'address' | 'state' | 'district' | 'sub_district' | 'village' | 'pin') =>
        name as Path<TFieldValues>;

    const [selectedState, setSelectedState] = useState<SelectionItemsType[]>(() =>
        initialData?.state ? STATES_LIST.filter((s) => s.value === initialData.state) : []
    );

    const [locations, dispatch] = useReducer(locationReducer, initialData, createInitialLocationState);
    const [loading, setLoading] = useState<LocationLevel | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const requestIdRef = useRef(0);

    const fetchLocationOptions = useCallback(
        async (
            level: LocationLevel,
            params: { state: string; district?: string; subDistrict?: string },
            options?: { preserveSelected?: boolean }
        ) => {
            const requestId = ++requestIdRef.current;
            setLoading(level);
            setFetchError(null);
            try {
                const res = await API.post(LOCATION_ENDPOINT, {
                    state: params.state,
                    district: params.district ?? '',
                    sub_district: params.subDistrict ?? '',
                });
                if (requestId !== requestIdRef.current) return;
                const rawList: string[] = res?.data?.data ?? [];
                const list = rawList.map((value, index) => toSelectionItem(value, index + 1));
                dispatch({
                    type: 'SET',
                    level,
                    payload: { list, ...(options?.preserveSelected ? {} : { selected: [] }) },
                });
            } catch (err) {
                if (requestId !== requestIdRef.current) return;
                console.error(`Error fetching ${level} options:`, err);
                setFetchError(t('locationForm.fetchError', { level: levelErrorLabel[level] }));
                dispatch({ type: 'SET', level, payload: { list: [] } });
            } finally {
                if (requestId === requestIdRef.current) setLoading(null);
            }
        },
        [t]
    );

    useEffect(() => {
        let cancelled = false;
        const hydrate = async () => {
            if (!initialData?.state) return;
            await fetchLocationOptions('district', { state: initialData.state }, { preserveSelected: true });
            if (cancelled || !initialData.district) return;
            await fetchLocationOptions(
                'subDistrict',
                { state: initialData.state, district: initialData.district },
                { preserveSelected: true }
            );
            if (cancelled || !initialData.sub_district) return;
            await fetchLocationOptions(
                'village',
                {
                    state: initialData.state,
                    district: initialData.district,
                    subDistrict: initialData.sub_district,
                },
                { preserveSelected: true }
            );
        };
        hydrate();
        return () => { cancelled = true; };
    }, []);

    const onStateChange = useCallback(
        (selectedItems: SelectionItemsType[]) => {
            const value = selectedItems[0]?.value ?? '';
            setSelectedState(selectedItems);
            dispatch({ type: 'RESET_ALL' });
            setValue(fieldName('state'), value as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            setValue(fieldName('district'), '' as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            setValue(fieldName('sub_district'), '' as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            setValue(fieldName('village'), '' as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            clearErrors((['state', 'district', 'sub_district', 'village'] as const).map(fieldName));
            if (value) fetchLocationOptions('district', { state: value });
        },
        [clearErrors, fetchLocationOptions, setValue]
    );

    const onDistrictChange = useCallback(
        (selectedItems: SelectionItemsType[]) => {
            const value = selectedItems[0]?.value ?? '';
            dispatch({ type: 'SET', level: 'district', payload: { selected: selectedItems } });
            dispatch({ type: 'RESET_BELOW', level: 'district' });
            setValue(fieldName('district'), value as any, { shouldValidate: true });
            setValue(fieldName('sub_district'), '' as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            setValue(fieldName('village'), '' as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            clearErrors((['district', 'sub_district', 'village'] as const).map(fieldName));
            const stateValue = selectedState[0]?.value;
            if (value && stateValue) {
                fetchLocationOptions('subDistrict', { state: stateValue, district: value });
            }
        },
        [selectedState, clearErrors, fetchLocationOptions, setValue]
    );

    const onSubDistrictChange = useCallback(
        (selectedItems: SelectionItemsType[]) => {
            const value = selectedItems[0]?.value ?? '';
            dispatch({ type: 'SET', level: 'subDistrict', payload: { selected: selectedItems } });
            dispatch({ type: 'RESET_BELOW', level: 'subDistrict' });
            setValue(fieldName('sub_district'), value as any, { shouldValidate: true });
            setValue(fieldName('village'), '' as any, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            clearErrors((['sub_district', 'village'] as const).map(fieldName));
            const stateValue = selectedState[0]?.value;
            const districtValue = locations.district.selected[0]?.value;
            if (value && districtValue && stateValue) {
                fetchLocationOptions('village', { state: stateValue, district: districtValue, subDistrict: value });
            }
        },
        [selectedState, locations.district.selected, clearErrors, fetchLocationOptions, setValue]
    );

    const onVillageChange = useCallback(
        (selectedItems: SelectionItemsType[]) => {
            dispatch({ type: 'SET', level: 'village', payload: { selected: selectedItems } });
            setValue('village', selectedItems[0]?.value ?? '', { shouldValidate: true });
            clearErrors('village');
        },
        [clearErrors, setValue]
    );

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 8 }}>
            <Controller
                name="address"
                control={control}
                rules={{ required: { value: true, message: t('locationForm.validation.addressRequired') } }}
                render={({ field: { onChange, value } }) => (
                    <ThemeInput
                        value={value}
                        size={INPUT_SIZE}
                        onChangeText={(text: string) => onChange(text)}
                        numberOfLines={5}
                        multiline
                        label={t('locationForm.addressLine1')}
                        required
                        placeholder={t('locationForm.addressLine1')}
                        autoComplete="postal-address"
                        helperText={errors.address?.message || ' '}
                        returnKeyType="done"
                        error={!!errors.address}
                        clearTextOnFocus
                        selectTextOnFocus
                        enablesReturnKeyAutomatically
                        variant="solid"
                        mainContainerStyle={{ flexGrow: 1, minWidth: dimensions.width * 0.7 }}
                    />
                )}
            />

            <Controller
                control={control}
                name="state"
                rules={{ required: { value: true, message: t('locationForm.validation.stateRequired') } }}
                render={() => (
                    <SelectInput
                        label={t('locationForm.state')}
                        required
                        placeholder={t('locationForm.selectState')}
                        variant="filled"
                        options={STATES_LIST}
                        defaultValues={selectedState}
                        onSelectionchange={onStateChange}
                        size={INPUT_SIZE - 8}
                        error={!!errors.state ? 'true' : ''}
                        mainContainerStyle={{ flexGrow: 1, minWidth: dimensions.width * 0.5 }}
                    />
                )}
            />

            <Controller
                control={control}
                name="district"
                rules={{ required: { value: true, message: t('locationForm.validation.required') } }}
                render={() => (
                    <SelectInput
                        label={t('locationForm.district')}
                        required
                        placeholder={t('locationForm.selectDistrict')}
                        disabled={selectedState.length === 0}
                        size={INPUT_SIZE - 8}
                        variant="filled"
                        loading={loading === 'district'}
                        options={locations.district.list}
                        defaultValues={locations.district.selected}
                        onSelectionchange={onDistrictChange}
                        error={!!errors.district ? 'true' : ''}
                        mainContainerStyle={{ flexGrow: 1, minWidth: dimensions.width * 0.4 }}
                    />
                )}
            />

            <Controller
                control={control}
                name="sub_district"
                rules={{ required: { value: true, message: t('locationForm.validation.required') } }}
                render={() => (
                    <SelectInput
                        label={t('locationForm.subDistrict')}
                        required
                        placeholder={t('locationForm.selectSubDistrict')}
                        disabled={locations.district.selected.length === 0}
                        size={INPUT_SIZE - 8}
                        variant="filled"
                        loading={loading === 'subDistrict'}
                        options={locations.subDistrict.list}
                        defaultValues={locations.subDistrict.selected}
                        onSelectionchange={onSubDistrictChange}
                        error={!!errors.sub_district ? 'true' : ''}
                        mainContainerStyle={{ flexGrow: 1, minWidth: dimensions.width * 0.4 }}
                    />
                )}
            />

            <Controller
                control={control}
                name="village"
                rules={{ required: { value: true, message: t('locationForm.validation.required') } }}
                render={() => (
                    <SelectInput
                        label={t('locationForm.village')}
                        required
                        placeholder={t('locationForm.selectVillage')}
                        disabled={locations.subDistrict.selected.length === 0}
                        size={INPUT_SIZE - 8}
                        loading={loading === 'village'}
                        options={locations.village.list}
                        defaultValues={locations.village.selected}
                        onSelectionchange={onVillageChange}
                        error={!!errors.village ? 'true' : ''}
                        variant="filled"
                        mainContainerStyle={{ flexGrow: 1, minWidth: dimensions.width * 0.4 }}
                    />
                )}
            />

            <Controller
                name="pin"
                control={control}
                rules={{
                    required: { value: true, message: t('locationForm.validation.pincodeRequired') },
                    pattern: { value: PIN_CODE_PATTERN, message: t('locationForm.validation.invalidPincode') },
                }}
                render={({ field: { onChange, value } }) => (
                    <ThemeInput
                        value={value}
                        size={INPUT_SIZE - 8}
                        maxLength={6}
                        onChangeText={(text: string) => onChange(text.replace(/[^0-9]/g, ''))}
                        label={t('locationForm.pinZip')}
                        required
                        placeholder={t('locationForm.pinZipPlaceholder')}
                        keyboardType="number-pad"
                        autoComplete="postal-code"
                        helperText={errors.pin?.message || ' '}
                        returnKeyType="done"
                        error={!!errors.pin}
                        clearTextOnFocus
                        selectTextOnFocus
                        enablesReturnKeyAutomatically
                        variant="solid"
                        mainContainerStyle={{ flexGrow: 1, minWidth: dimensions.width * 0.4 }}
                    />
                )}
            />

            {fetchError ? (
                <Text accessibilityRole="alert" style={{ color: '#B3261E', width: '100%' }}>
                    {fetchError}
                </Text>
            ) : null}
        </View>
    );
};

export default LocationForm;