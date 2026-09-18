import DateSelection from '@/components/basic/inputs/DateInput/DateSelection'
import InputLabel from '@/components/basic/inputs/inputLabel'
import SelectInput, { Option } from '@/components/basic/inputs/SelectInput/NewSelectInput'
import ThemeInput from '@/components/basic/inputs/ThemeInput'
import ModernDetailItem from '@/components/basic/modernDetailItem'
import Skelton from '@/components/basic/Skelton'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { Field2Icon, InfoIcon, PlantIcon } from '@/components/icons'
import { useAllCrops } from '@/hooks/useAllCrops'
import useSprayRequests, { SprayRequestPayload } from '@/hooks/useSprayRequests'
import { SprayRequest } from '@/models/sprayRequest'
import { capitalizeWords } from '@/utils/app-helper'
import dayjs, { Dayjs } from 'dayjs'
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

const ChooseFarmForm = lazy(() => import('../../../farms/chooseFarmForm'))

const INPUT_SIZE = 44
const MAX_ACREAGE = 300
const DATE_FORMAT = 'YYYY-MM-DD'

interface EditRequestProps {
    callback?: () => void
    detail: SprayRequest
}

const EditRequest = ({ callback, detail }: EditRequestProps) => {
    const { updateRequest, fetchMyRequests } = useSprayRequests()
    const { allCrops, fetchAllCrops, fetchingAllCrops } = useAllCrops()
    const { t } = useTranslation();

    const [sprayDate, setSprayDate] = useState<Dayjs>(dayjs(detail?.request_date))
    const [cropSelection, setCropSelection] = useState<Option[]>([])

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<SprayRequestPayload>({
        defaultValues: {
            acreage: `${detail.acreage}`,
            crop_id: detail.crop_id,
            crop_name: detail.crop_name,
            farm_id: detail.farm_id,
            farmer_rejected_remarks: '',
            rejected_remarks: '',
            request_date: detail.request_date,
            request_id: detail.request_id,
        },
    })

    const generatedCropList = useMemo(
        () =>
            allCrops
                .map((crop) => ({
                    id: `${crop?.id}`,
                    label: crop?.crop_name,
                    value: capitalizeWords(crop?.crop_name),
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [allCrops]
    )

    const handleCropChange = useCallback(
        (selectedItems: Option[]) => {
            setCropSelection(selectedItems)
            if (selectedItems?.length > 0) {
                setValue('crop_name', `${selectedItems[0]?.value}`, { shouldValidate: true })
                setValue('crop_id', `${selectedItems[0]?.id}`, { shouldValidate: true })
            } else {
                setValue('crop_name', '', { shouldValidate: true })
                setValue('crop_id', '', { shouldValidate: true })
            }
        },
        [setValue]
    )

    useEffect(() => {
        fetchAllCrops()
        // Only run once on mount; fetchAllCrops identity is assumed stable.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const oldCrop = allCrops.find((el) => String(el.id) === String(detail.crop_id))
        if (!oldCrop) return

        setCropSelection([
            {
                id: `${oldCrop.id}`,
                label: oldCrop.crop_name,
                value: capitalizeWords(oldCrop.crop_name),
            },
        ])
    }, [allCrops, detail.crop_id])

    const onSuccess = () => {
        fetchMyRequests()
        callback?.()
    }

    const onError = () => {
        // TODO: surface a user-facing error (toast/inline message) — update failed
    }

    const updateDetails = async (data: SprayRequestPayload) => {
        updateRequest(
            {
                ...data,
                request_date: sprayDate.format(DATE_FORMAT),
            },
            onSuccess,
            onError
        )
        // Do NOT call callback?.() here — closing must wait for onSuccess/onError,
        // otherwise the sheet dismisses before we know the update actually succeeded.
    }

    return (
        <View
            style={{
                padding: 16,
                gap: 8,
                flex: 1,
            }}
        >
            <ThemeText content={t('farmerActionSheet.editRequest.title')} variant="xs" fontFamily="MontserratSemiBold" />
            <ThemeDivider size={8} />

            <View style={{ flex: 1, gap: 12 }}>
                <View>
                    <InputLabel label={t('farmerActionSheet.editRequest.chooseFarm')} required />
                    <Suspense fallback={<Skelton dimensions={{ height: 72 }} />}>
                        <ChooseFarmForm
                            selectedId={String(detail.farm_id)}
                            onChange={(frm) =>
                                setValue('farm_id', frm ? String(frm?.id) : '', { shouldValidate: true })
                            }
                        />
                    </Suspense>
                    {!!errors.farm_id && (
                        <ThemeText content={t('required')} variant="xs" style={{ color: 'red' }} />
                    )}
                </View>

                <ThemeDivider size={2} />

                <DateSelection
                    required
                    onChange={(date) => setSprayDate(date)}
                    disablePast
                    size={INPUT_SIZE}
                    defaultDate={sprayDate}
                    label={t('farmerActionSheet.editRequest.sprayDate')}
                />

                <SelectInput
                    label={t('farmerActionSheet.editRequest.crop')}
                    required
                    size={INPUT_SIZE}
                    loading={fetchingAllCrops}
                    options={generatedCropList}
                    defaultValues={cropSelection}
                    icon={PlantIcon}
                    onSelectionchange={handleCropChange}
                    multiple={false}
                    helperText={errors.crop_id ? t('required') : ''}
                    error={!!errors.crop_id ? t('required') : ''}
                />

                <Controller
                    control={control}
                    name="acreage"
                    rules={{
                        required: { value: true, message: t('required') },
                        min: {
                            value: detail.apply_coin != '0' ? detail.acreage : 0.1,
                            message: t('farmerActionSheet.editRequest.acreageMinWithCoins', { max: detail.acreage })
                        },
                        max: {
                            value: MAX_ACREAGE,
                            message: t('farmerActionSheet.editRequest.acreageMaxError', { max: MAX_ACREAGE })
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <ThemeInput
                            value={value as string | undefined}
                            size={INPUT_SIZE}
                            maxLength={5}
                            variant="solid"
                            onChangeText={(text) => {
                                const numericValue = text.replace(/[^0-9]/g, '')
                                if (numericValue !== '' && +numericValue > MAX_ACREAGE) return
                                onChange(numericValue)
                            }}
                            label={t('farmerActionSheet.editRequest.acreage')}
                            placeholder={t('farmerActionSheet.editRequest.acreagePlaceholder')}
                            required
                            keyboardType="numeric"
                            helperText={errors.acreage ? errors.acreage.message : `Max ${MAX_ACREAGE} acres`}
                            returnKeyType="next"
                            error={Boolean(errors.acreage)}
                            clearTextOnFocus
                            enablesReturnKeyAutomatically
                            icon={Field2Icon}
                            accessibilityLabel="Acreage"
                        />
                    )}
                />
                {+detail?.apply_coin > 0 &&
                    <ModernDetailItem
                        icon={InfoIcon}
                        description={{ content: t('farmerActionSheet.editRequest.agricoinsApplied'), variant: 'xs' }}
                        // description={{ content: `AgriCoins used: ${Number(detail?.apply_coin).toFixed(0)}` }}
                        actionIcon={
                            <Image
                                source={require('@/assets/images/static/agricoin-side.png')}
                                style={{
                                    height: 32, width: 32, resizeMode: 'contain'
                                }}
                            />
                        }
                    />
                }
            </View>

            <ThemeButton
                onPress={handleSubmit(updateDetails)}
                label={isSubmitting ? t('updating') : t('update')}
                variant="md"
                disabled={isSubmitting}
                loading={isSubmitting}
                style={{
                    width: 280,
                    marginHorizontal: 'auto',
                }}
            />
            <ThemeDivider size={2} />

            <ActionText
                label={t('discardAndClose')}
                severity="secondary"
                withIcon={false}
                onPress={callback}
            />

            <ThemeDivider size={32} />
        </View>
    )
}

export default EditRequest