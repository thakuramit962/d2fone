import ThemeInput from '@/components/basic/inputs/ThemeInput'
import ThemeButton from '@/components/basic/ThemeButton'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { useThrottle } from '@/hooks/use-throttle'
import { useToast } from '@/hooks/useToast'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { PRODUCT_REQUEST_NOTES } from '@/utils/notes'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import InputLabel from '../../inputs/inputLabel'
import NotesSection from '../../notesSection'
import NumberCounter from '../../numberCounter'
import ThemeText from '../../text/ThemeText'
import ThemeDivider from '../../ThemeDivider'



const RequestForm = ({ productId, callback }: { productId: number, callback?: () => void }) => {

    const theme = useTheme()
    const dispatch = useDispatch()
    const { showToast } = useToast()

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        defaultValues: {
            product_id: String(productId),
            quantity: '1',
            address: 'f',
            remark: '',
        }
    })


    const submitResponse: SubmitHandler<FieldValues> = useCallback(async (data) => {
        if (+data?.quantity < 1) return showToast('Quantity is Required', '', 'error')
        dispatch(updateProcessingState(true))
        API.post('/v1/product-requests', data)
            .then((res) => {
                if (res.data?.status == 'success') {
                    showToast('Request submitted successfully!', '', 'success')
                    callback?.()
                }
                if (res.data?.status == 'error') {
                    showToast('Error', res.data?.msg || "Couldn't submit request, try again", 'success')
                }
            })
            .catch((err) => console.error(err || 'Error while requesting product'))
            .finally(() => {
                dispatch(updateProcessingState(false))
            })
    }, [productId, dispatch])

    const handleSubmitReposne = useThrottle(handleSubmit(submitResponse), 5000)

    return (
        <LinearGradient
            colors={['#b0e3f65e', '#b0e3f604']}
            style={{
                borderRadius: 24,
                padding: 16,
                marginHorizontal: 8,
                flex: 1,
            }}>
            <View style={{
                flex: 1
            }}>
                <ThemeText content={'Intersted in Buying?'} fontFamily='MontserratBlack' variant='md' />
                <ThemeText content={"Fill the required details to buy this product and we'll deliver it to your doorstep."} variant='xxs' severity='secondary' />

                <ThemeDivider size={24} />

                <Controller
                    control={control}
                    name="remark"
                    rules={{
                        required: { value: true, message: 'Required' },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <ThemeInput
                            variant='solid'
                            label='Requirement Details' required
                            placeholder='Your requirement details'
                            size={42} multiline numberOfLines={5} maxLength={300}
                            value={value}
                            onChangeText={onChange}
                            error={Boolean(errors.remark)}
                            helperText={errors?.remark?.message || ''}
                        />
                    )}
                />

                <ThemeDivider size={16} />
                <InputLabel label='Quantity' required />
                <NumberCounter hideSpeedCounter speed={1}
                    min={1}
                    onChange={(qty) => {
                        setValue('quantity', String(qty), { shouldValidate: true })
                    }} />


            </View>
            <ThemeDivider size={24} />
            <NotesSection NOTES={PRODUCT_REQUEST_NOTES()} />
            <ThemeButton onPress={handleSubmitReposne} label='Submit Request' variant='md' style={{ width: 260, marginHorizontal: 'auto' }} />
        </LinearGradient>
    )
}

export default RequestForm