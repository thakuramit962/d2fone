import ThemeInput from '@/components/basic/inputs/ThemeInput'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeDivider from '@/components/basic/ThemeDivider'
import useSprayRequests, { SprayRequestPayload } from '@/hooks/useSprayRequests'
import { SprayRequest } from '@/models/sprayRequest'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

const ALLOWED_REMARKS_PATTERN = /[^A-Za-z0-9\s\-_%&*=+!$?/{};:'"~₹`]/g

const DeleteRequest = ({ callback, detail }: { callback?: () => void, detail: SprayRequest }) => {

    const { updateRequest, fetchMyRequests } = useSprayRequests()
    const { t } = useTranslation()
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SprayRequestPayload>({
        defaultValues: {
            farmer_rejected_remarks: '',
            request_id: detail.request_id
        }
    })

    const onSuccess = () => {
        fetchMyRequests()
        callback?.()
    }

    const onError = () => {
        // TODO: surface a user-facing error (toast/inline message) — cancellation failed
    }

    const updateDetails = async (data: SprayRequestPayload) => {
        updateRequest(
            { ...data, status: '0' },
            onSuccess,
            onError
        )
        // Do NOT call callback?.() here — closing must wait for onSuccess/onError,
        // otherwise the sheet dismisses before we know the request actually succeeded.
    }

    return (
        <View
            style={{
                padding: 16,
                flex: 1,
            }}
        >
            <ThemeText content={t('farmerActionSheet.deleteRequest.title')} variant="xs" fontFamily="MontserratSemiBold" />
            <ThemeText content={t('farmerActionSheet.deleteRequest.subtitle')} severity='secondary' />
            <ThemeDivider size={8} />

            <View style={{ flex: 1, paddingTop: 24 }}>
                <Controller
                    control={control}
                    name="farmer_rejected_remarks"
                    rules={{ required: { value: true, message: t('required') } }}
                    render={({ field: { onChange, value } }) => (
                        <ThemeInput
                            value={value}
                            maxLength={120}
                            multiline numberOfLines={4}
                            onChangeText={(value) => onChange(value.replace(ALLOWED_REMARKS_PATTERN, ''))}
                            variant="solid"
                            placeholder={t('farmerActionSheet.deleteRequest.placeholder')}
                            label={t('farmerActionSheet.deleteRequest.remarks')}
                            helperText={t('farmerActionSheet.deleteRequest.helper')}
                            returnKeyType="next"
                            error={Boolean(errors.farmer_rejected_remarks)}
                            clearTextOnFocus
                            enablesReturnKeyAutomatically
                            mainContainerStyle={{ flex: 1 }}
                            accessibilityLabel="remarks"
                        />
                    )}
                />
            </View>
            <ThemeButton
                onPress={handleSubmit(updateDetails)}
                label={isSubmitting ? t('deleting') : t('delete')}
                variant="md"
                disabled={isSubmitting}
                loading={isSubmitting}
                severity='error'
                style={{
                    width: 280,
                    marginHorizontal: 'auto',
                }}
            />
            <ThemeDivider size={12} />

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

export default DeleteRequest