import ScreenView from '@/components/basic/containers/screenView'
import ThemeInput from '@/components/basic/inputs/ThemeInput'
import LocationForm from '@/components/basic/location/locationForm'
import NotesSection from '@/components/basic/notesSection'
import ActionText from '@/components/basic/text/ActionText'
import DetailLine from '@/components/basic/text/detailLine'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeButton from '@/components/basic/ThemeButton'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { WarningIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { useUser } from '@/hooks/useUser'
import { RootState } from '@/store/store'
import { PROFILE_UPDATE_NOTES } from '@/utils/notes'
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

interface ProfileFields {
    name: string
    farmer_mobile_no: string
    farmer_pincode: string
    farmer_address: string
    farmer_sub_district: string
    farmer_district: string
    farmer_state: string
    farmer_village: string
    profile_image: string
    email: string
    password: string

    // used by LocationForm
    address?: string
    state?: string
    district?: string
    sub_district?: string
    village?: string
    pin?: string
}

const Editprofile = () => {
    const theme = useTheme()

    const currentUser = useSelector((state: RootState) => state?.auth?.currentUser)
    const farmerDetails = currentUser?.farmerDetails

    const { fetchUser } = useUser()
    const { t } = useTranslation()
    const scrollRef = useScrollToTop()

    const [submitError, setSubmitError] = useState<string | null>(null)

    const defaultValues = useMemo<Partial<ProfileFields>>(
        () => ({
            name: farmerDetails?.farmer_name ?? '',
            address: farmerDetails?.farmer_address ?? '',
            state: farmerDetails?.farmer_state ?? '',
            district: farmerDetails?.farmer_district ?? '',
            sub_district: farmerDetails?.farmer_sub_district ?? '',
            village: farmerDetails?.farmer_village ?? '',
            pin: farmerDetails?.farmer_pincode ?? '',
        }),
        [farmerDetails],
    )

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        clearErrors,
        reset,
    } = useForm<Partial<ProfileFields>>({
        defaultValues,
        mode: 'onBlur',
    })

    const update = useCallback(
        async (values: Partial<ProfileFields>) => {
            setSubmitError(null)

            const data = {
                farmer_address: values.address ?? '',
                farmer_district: values.district ?? '',
                farmer_pincode: values.pin ?? '',
                farmer_state: values.state ?? '',
                farmer_sub_district: values.sub_district ?? '',
                farmer_village: values.village ?? '',
                name: values.name ?? '',
            }

            try {
                const res = await API.post('/v1/update-profile', data)
                if (res.data?.status === 'success') {
                    await fetchUser()
                    router.navigate('/tabs/profile')
                } else {
                    setSubmitError(res.data?.message ?? t('editProfile.unableToUpdate'))
                }
            } catch (err) {
                setSubmitError(t('editProfile.serverIssue'))
            }
        },
        [fetchUser],
    )

    const handleDiscard = useCallback(() => {
        reset(defaultValues)
        router.back()
    }, [reset, defaultValues])

    useEffect(() => {
        reset(defaultValues)
    }, [defaultValues, reset])

    return (
        <ScreenView bg={`${theme.text.disabled}20`}>
            <Header
                backIcon
                label={t('editProfile.title')}
                withoutTopPadding
                bottomSlot={
                    <View style={styles.headerDetails}>
                        <DetailLine
                            label={{ content: t('code'), variant: 'xs' }}
                            description={{ content: currentUser?.emp_id ? String(currentUser.emp_id) : '-', variant: 'xs', fontFamily: 'MontserratMedium' }}
                        />
                        <DetailLine
                            label={{ content: t('mobile'), variant: 'xs' }}
                            description={{ content: currentUser?.phone ? `+91 ${currentUser.phone}` : '-', variant: 'xs', fontFamily: 'MontserratMedium' }}
                        />
                        <DetailLine
                            icon={!currentUser?.email_verified_at ? WarningIcon : undefined}
                            iconColor={theme.warning}
                            iconSize={16}
                            label={{ content: t('email'), variant: 'xs' }}
                            description={{ content: currentUser?.email ?? '-', variant: 'xs', fontFamily: 'MontserratMedium' }}
                        />
                    </View>
                }
            />
            <ScrollView
                ref={scrollRef}
                style={[styles.scroll, { backgroundColor: theme.background.main }]}
                keyboardShouldPersistTaps="handled"
            >
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: t('editProfile.fullName.required') }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <ThemeInput
                            variant="solid"
                            label={t('editProfile.fullName.label')}
                            required
                            size={42}
                            placeholder={t('editProfile.fullName.label')}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            error={Boolean(errors.name)}
                            helperText={errors.name?.message ?? ' '}
                        />
                    )}
                />

                <View style={[styles.addressBlock, { borderColor: `${theme.text.primary}25` }]}>
                    <ThemeText content={`${t('editForm.addressDetails')} ___`} fontFamily="MontserratSemiBold" variant="xs" severity="disabled" />

                    <LocationForm
                        control={control}
                        errors={errors}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        size={42}
                        initialData={{
                            adress: defaultValues.address,
                            state: defaultValues.state,
                            district: defaultValues.district,
                            sub_district: defaultValues.sub_district,
                            village: defaultValues.village,
                        }}
                    />
                </View>
                <ThemeDivider size={48} />
                <NotesSection NOTES={PROFILE_UPDATE_NOTES()} />
                <ThemeDivider size={72} />
            </ScrollView>
            <View style={styles.footer}>
                <ThemeDivider size={24} />
                {submitError ? (
                    <>
                        <ThemeText content={submitError} variant="xs" severity="error" />
                        <ThemeDivider size={8} />
                    </>
                ) : null}
                <ThemeButton
                    label={isSubmitting ? t('updating') : t('update')}
                    disabled={isSubmitting}
                    onPress={handleSubmit(update)}
                />
                <ThemeDivider size={8} />
                <ActionText
                    label={t('discardAndClose')}
                    variant="sm"
                    severity="main"
                    withIcon={false}
                    onPress={handleDiscard}
                    containerStyle={styles.discardAction}
                />
            </View>

        </ScreenView>
    )
}

const styles = StyleSheet.create({
    headerDetails: {
        padding: 8,
    },
    scroll: {
        padding: 16,
        borderRadius: 24,
    },
    addressBlock: {
        borderWidth: 1,
        borderRadius: 24,
        padding: 16,
        paddingBottom: 4,
    },
    footer: {
        paddingHorizontal: 32,
    },
    discardAction: {
        height: 38,
        paddingHorizontal: 32,
    },
})

export default Editprofile