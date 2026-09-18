import { AlertIcon, PasswordIcon, VerifyIcon, WarningIcon } from '@/components/icons'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import { useUser } from '@/hooks/useUser'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { updateToast } from '@/slices/toast-slice'
import { dimensions } from '@/utils/app-helper'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    NativeModules,
    View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import ThemeInput from '../../inputs/ThemeInput'
import ModernDetailItem from '../../modernDetailItem'
import ThemeText from '../../text/ThemeText'
import ThemeChip from '../../ThemeChip'
import ThemeDivider from '../../ThemeDivider'

interface DeleteAccountProps {
    callback?: () => void
}

interface DeleteAccountForm {
    username: string
    password: string
}

const INITIAL_FORM: DeleteAccountForm = { username: '', password: '' }

const DeleteAccount = ({ callback }: DeleteAccountProps) => {

    const theme = useTheme()
    const dispatch = useDispatch()
    const globalStyle = useGlobalStyle()
    const { bottom } = useSafeAreaInsets()
    const { logout } = useUser()
    const { t } = useTranslation()


    const [showForm, setShowForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [data, setData] = useState<DeleteAccountForm>(INITIAL_FORM)

    const deleteAccount = useCallback(() => {
        const username = data.username.trim()
        const password = data.password.trim()

        if (!username || !password) {
            setError(t('deleteAccount.required'))
            return
        }

        if (isSubmitting) return

        setIsSubmitting(true)
        dispatch(updateProcessingState(true))

        API.post('/inactive-user', { emp_id: username, password })
            .then((res) => {
                if (res.data.status === 'success') {
                    dispatch(updateToast({ title: t('deleteAccount.successTitle'), message: 'Your account is removed successfully from Agriwings', severity: 'info' }))
                    setData(INITIAL_FORM)
                    logout()
                    NativeModules.AppControl.closeApp();
                } else {
                    setError(res.data.message ?? t('deleteAccount.genericError'))
                }
            })
            .catch(() => {
                setError(t('deleteAccount.networkError'))
            })
            .finally(() => {
                dispatch(updateProcessingState(false))
                setIsSubmitting(false)
            })
    }, [data.username, data.password, isSubmitting, dispatch, logout])

    useEffect(() => {
        setShowForm(false)
        setData(INITIAL_FORM)
    }, [])

    return (
        <View style={{
            padding: 16,
            flex: 1,
        }}>
            <View style={[{
                flex: 1,
                alignSelf: 'stretch',
                alignItems: 'center'
            }]}>
                {showForm
                    ? <>
                        <ThemeText
                            content={t('deleteAccount.confirmTitle')}
                            severity='error'
                            variant='lg'
                            fontFamily='MontserratSemiBold'
                            style={{
                                alignSelf: 'flex-start'
                            }}
                        />
                        <ThemeText
                            content={t('deleteAccount.confirmDescription')}
                            severity='secondary'
                            variant='xs'
                            style={{
                                alignSelf: 'flex-start'
                            }} />
                        <View style={{
                            alignSelf: 'stretch',
                            alignItems: 'stretch',
                            flex: 1,
                            marginTop: 24,
                            gap: 16,
                            width: dimensions.width * 0.8,
                            maxWidth: 400, marginHorizontal: 'auto'
                        }}>
                            <ThemeInput
                                label={t('deleteAccount.codeLabel')}
                                placeholder={t('deleteAccount.codePlaceholder')}
                                required
                                value={data.username}
                                size={42}
                                variant='solid'
                                icon={VerifyIcon}
                                autoCapitalize='none'
                                autoCorrect={false}
                                editable={!isSubmitting}
                                onChangeText={(text) => setData(prev => ({ ...prev, username: text }))}
                            />

                            <ThemeInput
                                isSecure
                                label={t('deleteAccount.passwordLabel')}
                                icon={PasswordIcon}
                                placeholder='XXXXXXXX'
                                required
                                size={42}
                                variant='solid'
                                value={data.password}
                                autoCapitalize='none'
                                autoCorrect={false}
                                textContentType='password'
                                editable={!isSubmitting}
                                onChangeText={(text) => setData(prev => ({ ...prev, password: text }))}
                            />
                        </View>
                    </>
                    : <>
                        <AlertIcon height={100} width={100} color={theme?.error} />
                        <ThemeText
                            content={t('deleteAccount.initialTitle')}
                            severity='error'
                            variant='lg'
                            fontFamily='MontserratBold'
                        />
                        <ThemeText
                            content={t('deleteAccount.initialDescription')}
                            variant='xs'
                            severity='secondary'
                            style={{
                                paddingHorizontal: 8,
                                textAlign: 'center',
                                marginTop: 8,
                            }}
                        />
                        <ThemeText
                            content={t('deleteAccount.caution')}
                            variant='xs'
                            severity='secondary'
                            style={{
                                paddingHorizontal: 8,
                                textAlign: 'center',
                                marginTop: 8,
                            }}
                        />
                    </>
                }
            </View>

            {error &&
                <>
                    <ModernDetailItem
                        bg={`${theme.error}15`}
                        icon={WarningIcon} iconColor={theme.error}
                        label={{ content: 'Error' }}
                        description={{ content: error }}
                    />
                    <ThemeDivider size={8} />
                </>
            }

            <View style={[
                globalStyle.rowCenter,
                {
                    gap: 12,
                    alignSelf: 'stretch',
                    paddingBottom: Math.max(bottom, 32),
                    paddingHorizontal: 24,
                }
            ]}>
                {showForm
                    ?
                    <>
                        <ThemeChip
                            label={isSubmitting ? t('removing') : t('remove')}
                            onPress={deleteAccount}
                            disabled={isSubmitting}
                            variant='sm'
                            textStyle={{
                                color: theme.error,
                                fontFamily: 'MontserratMedium'
                            }}
                            containerStyle={{
                                height: 48,
                                minWidth: 140,
                                flex: 1,
                                justifyContent: 'center',
                                backgroundColor: `${theme.error}25`,
                                opacity: isSubmitting ? 0.6 : 1,
                            }}
                        />

                        <ThemeChip
                            label={t('deleteAccount.changeMind')}
                            onPress={() => !isSubmitting && callback?.()}
                            disabled={isSubmitting}
                            variant='sm'
                            textStyle={{
                                color: theme.background.main,
                                fontFamily: 'MontserratMedium'
                            }}
                            containerStyle={{
                                height: 48,
                                minWidth: 200,
                                flex: 1,
                                justifyContent: 'center',
                                backgroundColor: theme.text.primary,

                            }}
                        />
                    </>
                    :
                    <>
                        <ThemeChip
                            label={t('deleteAccount.continue')}
                            onPress={() => setShowForm(true)}
                            variant='sm'
                            textStyle={{
                                color: theme.text.primary,
                                fontFamily: 'MontserratMedium'
                            }}
                            containerStyle={{
                                height: 48,
                                minWidth: 140,
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                                borderWidth: 1,
                                borderColor: `${theme.text.primary}25`,

                            }}
                        />
                        <ThemeChip
                            label={t('deleteAccount.cancel')}
                            onPress={() => callback?.()}
                            variant='sm'
                            textStyle={{
                                color: theme.background.main,
                                fontFamily: 'MontserratMedium'
                            }}
                            containerStyle={{
                                height: 48,
                                minWidth: 140,
                                flex: 1,
                                justifyContent: 'center',
                                backgroundColor: theme.text.primary,

                            }}
                        />
                    </>
                }
            </View>
        </View>
    )
}

export default DeleteAccount