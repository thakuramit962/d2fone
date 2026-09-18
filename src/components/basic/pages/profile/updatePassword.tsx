import { WarningIcon } from '@/components/icons'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { useToast } from '@/hooks/useToast'
import { useUser } from '@/hooks/useUser'
import { dimensions } from '@/utils/app-helper'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import ThemeInput from '../../inputs/ThemeInput'
import ModernDetailItem from '../../modernDetailItem'
import ThemeText from '../../text/ThemeText'
import ThemeChip from '../../ThemeChip'
import ThemeDivider from '../../ThemeDivider'

const MIN_PASSWORD_LENGTH = 8

const UpdatePassword = ({ callback }: { callback?: () => void }) => {

    const theme = useTheme()
    const { showToast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const { logout, fetchUser } = useUser()
    const { t } = useTranslation()

    const [data, setData] = useState({
        old: '',
        new: '',
        confirmNew: ''
    })

    // BUG FIXED: passwords should never be silently trimmed on every keystroke
    const updateField = useCallback((field: keyof typeof data) => (txt: string) => {
        setData(prev => ({ ...prev, [field]: txt }))
        if (error) setError('')
    }, [error])

    const validationError = useMemo(() => {
        if (!data.old || !data.new || !data.confirmNew) {
            return null // don't show an error until they try to submit
        }
        if (data.new.length < MIN_PASSWORD_LENGTH) {
            return t('updatePassword.minLength', { min: MIN_PASSWORD_LENGTH })
        }
        if (data.new !== data.confirmNew) {
            return t('updatePassword.mismatch')
        }
        if (data.new === data.old) {
            return t('updatePassword.sameAsOld')
        }
        return null
    }, [data])

    const canSubmit = Boolean(data.old && data.new && data.confirmNew) && !validationError && !isSubmitting

    const updatePassword = useCallback(async () => {
        // BUG FIXED: guard against submitting empty/invalid fields
        if (!data.old || !data.new || !data.confirmNew) {
            setError(t('updatePassword.allFieldsRequired'))
            return
        }
        if (data.new.length < MIN_PASSWORD_LENGTH) {
            setError(t('updatePassword.minLength', { min: MIN_PASSWORD_LENGTH }))
            return
        }
        if (data.new !== data.confirmNew) {
            setError(t('updatePassword.mismatch'))
            return
        }
        if (data.new === data.old) {
            setError(t('updatePassword.sameAsOld'))
            return
        }

        setError('')
        setIsSubmitting(true)

        API
            .post('/v1/update-profile', {
                old_password: data.old,
                password: data.new,
            })
            .then((res) => {
                if (res.data?.status == 'success') {
                    showToast(t('updatePassword.successTitle'), t('updatePassword.successMessage'), 'success')
                    setData({ old: '', new: '', confirmNew: '' })
                    fetchUser()
                    callback?.()
                }
                if (res.data?.status == 'error') {
                    showToast('Error', res.data?.msg || 'Error while updating password.', 'error')
                }
            })
            .catch((err) => {
                console.error('Error', err)
                showToast('Error', err || 'Error while updating password.', 'error')
            })
            .finally(() => {
                setIsSubmitting(false)
            })

    }, [data, callback, logout])

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView keyboardShouldPersistTaps='handled'>
                <ModernDetailItem
                    icon={WarningIcon} iconSize={32}
                    label={{ content: t('updatePassword.title'), variant: 'xs', fontFamily: 'MontserratSemiBold', severity: 'main' }}
                    description={{ content: t('updatePassword.description'), variant: 'xxs', fontFamily: 'InterRegular', severity: 'secondary' }}
                />

                <View style={{
                    padding: 16,
                    gap: 8,
                    flex: 1
                }}>
                    <ThemeInput
                        value={data.old}
                        onChangeText={updateField('old')}
                        required
                        placeholder='xxxxxxxx'
                        label={t('updatePassword.oldPasswordLabel')}
                        variant='solid'
                        size={42}
                        isSecure
                        editable={!isSubmitting}
                    />
                    <ThemeInput
                        value={data.new}
                        onChangeText={updateField('new')}
                        required
                        placeholder='xxxxxxxx'
                        label={t('updatePassword.newPasswordLabel')}
                        variant='solid'
                        size={42}
                        isSecure
                        editable={!isSubmitting}
                    />
                    <ThemeInput
                        value={data.confirmNew}
                        onChangeText={updateField('confirmNew')}
                        required
                        placeholder='xxxxxxxx'
                        label={t('updatePassword.confirmNewPasswordLabel')}
                        variant='solid'
                        size={42}
                        isSecure
                        editable={!isSubmitting}
                    />

                    {(error || validationError) ? (
                        <ThemeText
                            content={error || validationError || ''}
                            severity='error'
                            variant='xxs'
                            fontFamily='InterRegular'
                        />
                    ) : null}

                    <ThemeDivider size={42} />

                    <View style={{
                        gap: 8,
                        width: dimensions.width * 0.65, marginHorizontal: 'auto', alignSelf: 'stretch'
                    }}>

                        <ThemeChip
                            label={isSubmitting ? t('updating') : t('update')}
                            onPress={updatePassword}
                            disabled={!canSubmit}
                            variant='sm'
                            textStyle={{
                                color: theme.error,
                                fontFamily: 'MontserratMedium'
                            }}
                            containerStyle={{
                                height: 48,
                                minWidth: 140,
                                justifyContent: 'center',
                                backgroundColor: `${theme.error}25`,
                                opacity: !canSubmit ? 0.6 : 1,
                            }}
                        />
                        <ThemeChip
                            label={t('discardChangesConfirmationDiscard')}
                            onPress={() => !isSubmitting && callback?.()}
                            disabled={isSubmitting}
                            variant='sm'
                            textStyle={{
                                color: theme.text.primary,
                                fontFamily: 'MontserratMedium'
                            }}
                            containerStyle={{
                                height: 48,
                                minWidth: 200,
                                justifyContent: 'center',
                                backgroundColor: theme.background.slate,
                            }}
                        />
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default UpdatePassword