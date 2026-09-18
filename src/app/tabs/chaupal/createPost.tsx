import BottomSheet from '@/components/basic/bottomSheet'
import ScreenView from '@/components/basic/containers/screenView'
import InputLabel from '@/components/basic/inputs/inputLabel'
import ThemeInput from '@/components/basic/inputs/ThemeInput'
import ModernDetailItem from '@/components/basic/modernDetailItem'
import MediaUpload from '@/components/basic/pages/chaupal/create/mediaUpload'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeChip from '@/components/basic/ThemeChip'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { AlertIcon, ArrowRightIcon, Link2Icon, PlayIcon, WarningIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import API from '@/constants/api'
import { useTheme } from '@/hooks/use-theme'
import { useToast } from '@/hooks/useToast'
import { updateProcessingState } from '@/slices/processing-state-slice'
import { dimensions } from '@/utils/app-helper'
import { Image } from 'expo-image'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'

type Step = 'media' | 'text'
const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'heic', 'bmp'])
const VIDEO_EXTS = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v', '3gp', 'flv', 'mpeg'])

type FormValues = {
    title: string
    description: string
    readmore_url: string
}

function getExtension(url: string): string {
    return url.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase() ?? ''
}
function classifyFile(url: string): 'image' | 'video' | 'unknown' {
    const ext = getExtension(url)
    if (IMAGE_EXTS.has(ext)) return 'image'
    if (VIDEO_EXTS.has(ext)) return 'video'
    return 'unknown'
}
function isValidUrl(value: string): boolean {
    if (!value.trim()) return true
    try {
        const parsed = new URL(value.trim())
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
        return false
    }
}

const CreatePost = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { showToast } = useToast()
    const { t } = useTranslation()
    const [step, setStep] = useState<Step>('media')
    const [files, setFiles] = useState<string[]>([])
    const [error, setError] = useState('')
    const [isPosting, setIsPosting] = useState(false)
    const [backDialog, setBackDialog] = useState(false)

    const titleRef = useRef<TextInput>(null)
    const descriptionRef = useRef<TextInput>(null)
    const sourceRef = useRef<TextInput>(null)
    const submittingRef = useRef(false)
    const mountedRef = useRef(true)

    useEffect(() => () => { mountedRef.current = false }, [])

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: { title: '', description: '', readmore_url: '' },
    })

    const { imageLinks, videoLinks, unknownCount } = useMemo(() => {
        const image: string[] = []
        const video: string[] = []
        let unknown = 0
        for (const url of files) {
            const kind = classifyFile(url)
            if (kind === 'image') image.push(url)
            else if (kind === 'video') video.push(url)
            else unknown++
        }
        return { imageLinks: image, videoLinks: video, unknownCount: unknown }
    }, [files])

    const handleUploadComplete = useCallback(
        (urls: Array<string | { url?: string; path?: string }>) => {
            const normalized = (urls || [])
                .map((u) => (typeof u === 'string' ? u : u.url || u.path))
                .filter((u): u is string => Boolean(u))

            if (normalized.length === 0) {
                if (urls?.length) showToast(t('createPost.toast.errorTitle'), t('createPost.toast.processFailed'))
                setStep('text')
                return
            }
            if (normalized.length < urls.length) {
                showToast(t('createPost.toast.warningTitle'), t('createPost.toast.someFailed'))
            }
            setFiles(normalized)
            setStep('text')
        },
        [showToast, t],
    )

    const handleRemoveFile = useCallback((index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
        if (error) setError('')
    }, [error])

    const handleCreatePost = useCallback(
        async (values: FormValues) => {
            if (submittingRef.current) return
            if (unknownCount > 0) {
                setError(t('createPost.validation.unsupportedFormat', { count: unknownCount }))
                return
            }
            if (!values.description.trim() && files.length === 0) {
                setError(t('createPost.validation.emptyPost'))
                return
            }

            submittingRef.current = true
            setIsPosting(true)
            setError('')

            try {
                dispatch(updateProcessingState(true))
                const payload = {
                    title: values.title.trim(),
                    description: values.description.trim(),
                    image_url: imageLinks,
                    video_link: videoLinks,
                    readmore_url: values.readmore_url.trim(),
                    category: 'Agriculture',
                }
                const res = await API.post('/v1/create-community-post', payload)
                if (res.data?.status === 'success') {
                    reset()
                    setFiles([])
                    showToast(t('createPost.toast.successTitle'), '', 'success')
                    router.replace('/tabs/chaupal/myPosts')
                    return
                }
                if (res.data?.status == 'error') setError(res.data?.msg || t('createPost.error.generic'))
                if (mountedRef.current) setError(res.data?.msg || t('createPost.error.generic'))
            } catch (e: any) {
                if (!mountedRef.current) return
                if (!e?.response) setError(t('createPost.error.noInternet'))
                else if ([401, 403].includes(e.response.status)) setError(t('createPost.error.sessionExpired'))
                else if (e.response.status >= 500) setError(t('createPost.error.serverError'))
                else setError(e.response.data?.msg || t('createPost.error.generic2'))
            } finally {
                submittingRef.current = false
                if (mountedRef.current) setIsPosting(false)
                dispatch(updateProcessingState(false))
            }
        },
        [files.length, imageLinks, videoLinks, unknownCount, reset, t, dispatch, showToast],
    )

    const handleBackToMedia = useCallback(() => {
        if (step !== 'text') return
        if (files.length > 0) setBackDialog(true)
        else setStep('media')
    }, [files.length, step])

    const confirmDiscard = useCallback(() => {
        setFiles([])
        setBackDialog(false)
        setStep('media')
        setError('')
    }, [])

    useFocusEffect(
        useCallback(() => {
            const sub = BackHandler.addEventListener('hardwareBackPress', () => {
                if (step === 'text') {
                    handleBackToMedia()
                    return true
                }
                return false
            })
            return () => sub.remove()
        }, [step, handleBackToMedia]),
    )

    return (
        <>
            <ScreenView>
                <Header
                    backIcon
                    label={step === 'media' ? t('createPost.header.shareThoughts') : t('createPost.header.addDetails')}
                    withoutTopPadding
                    description={step === 'media' ? t('createPost.header.shareThoughtsDesc') : t('createPost.header.mediaSelected', { count: files.length })}
                    backAction={step === 'text' ? handleBackToMedia : undefined}
                />

                {step === 'media' ? (
                    <MediaUpload onUploadComplete={handleUploadComplete} maxFiles={5} />
                ) : (
                    <>
                        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                            <View style={{ gap: 8 }}>
                                <Controller
                                    control={control}
                                    name="title"
                                    rules={{ required: t('createPost.form.topic.required'), validate: (v) => !!v.trim() || t('createPost.form.topic.required') }}
                                    render={({ field: { onChange, value } }) => (
                                        <ThemeInput
                                            ref={titleRef}
                                            variant="solid"
                                            required
                                            label={t('createPost.form.topic.label')}
                                            placeholder={t('createPost.form.topic.placeholder')}
                                            value={value}
                                            onChangeText={(tVal) => { onChange(tVal); if (error) setError('') }}
                                            autoCapitalize="words"
                                            maxLength={120}
                                            helperText={errors.title?.message ?? ' '}
                                            returnKeyType="next"
                                            error={!!errors.title}
                                            onSubmitEditing={() => descriptionRef.current?.focus()}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="description"
                                    rules={{ validate: (v) => (files.length === 0 && !v.trim() ? t('createPost.form.caption.requiredWhenNoMedia') : true) }}
                                    render={({ field: { onChange, value } }) => (
                                        <ThemeInput
                                            ref={descriptionRef}
                                            variant="solid"
                                            label={t('createPost.form.caption.label')}
                                            required={files.length === 0}
                                            placeholder={t('createPost.form.caption.placeholder')}
                                            multiline
                                            numberOfLines={6}
                                            value={value}
                                            onChangeText={(tVal) => { onChange(tVal); if (error) setError('') }}
                                            maxLength={1000}
                                            helperText={errors.description?.message ?? ' '}
                                            returnKeyType="next"
                                            error={!!errors.description}
                                            onSubmitEditing={() => sourceRef.current?.focus()}
                                        />
                                    )}
                                />

                                {files.length > 0 && (
                                    <>
                                        <ThemeDivider size={16} />
                                        <InputLabel label={t('createPost.form.attachments.label', { count: files.length })} />
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaListContent}>
                                            {files.map((item, index) => (
                                                <View key={`${item}-${index}`} style={styles.mediaWrapHorizontal}>
                                                    <Image source={{ uri: item }} style={styles.mediaImage} contentFit="cover" transition={200} />
                                                    {classifyFile(item) === 'video' && (
                                                        <View style={styles.videoOverlay} pointerEvents="none">
                                                            <PlayIcon size={28} color="#fff" />
                                                        </View>
                                                    )}
                                                    <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveFile(index)} hitSlop={8}>
                                                        <Text style={styles.removeText}>✕</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </ScrollView>
                                        <ThemeDivider size={16} />
                                    </>
                                )}

                                <Controller
                                    control={control}
                                    name="readmore_url"
                                    rules={{ validate: (v) => isValidUrl(v) || t('createPost.form.source.invalid') }}
                                    render={({ field: { onChange, value } }) => (
                                        <ThemeInput
                                            ref={sourceRef}
                                            variant="solid"
                                            label={t('createPost.form.source.label')}
                                            placeholder={t('createPost.form.source.placeholder')}
                                            value={value}
                                            onChangeText={(tVal) => { onChange(tVal); if (error) setError('') }}
                                            icon={Link2Icon}
                                            autoCapitalize="none"
                                            keyboardType="url"
                                            autoCorrect={false}
                                            helperText={errors.readmore_url?.message ?? ' '}
                                            returnKeyType="done"
                                            error={!!errors.readmore_url}
                                            onSubmitEditing={handleSubmit(handleCreatePost)}
                                        />
                                    )}
                                />
                            </View>

                            {!!error && (
                                <ModernDetailItem
                                    bg={`${theme.error}15`}
                                    icon={AlertIcon}
                                    iconColor={theme.error}
                                    label={{ content: t('createPost.genericErrorLabel') }}
                                    description={{ content: error, severity: 'error', variant: 'xs' }}
                                />
                            )}
                        </ScrollView>

                        <Pressable
                            onPress={handleSubmit(handleCreatePost)}
                            disabled={isPosting}
                            style={({ pressed }) => ({
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                backgroundColor: theme.text.primary,
                                opacity: isPosting ? 0.6 : pressed ? 0.85 : 1,
                                borderRadius: 24,
                                height: 56,
                                paddingHorizontal: 16,
                                marginHorizontal: 16,
                                marginBottom: 16,
                            })}
                        >
                            <ThemeText style={{ flex: 1, textAlign: 'center' }} color={theme.background.main} content={isPosting ? t('createPost.actions.posting') : t('createPost.actions.post')} variant="lg" fontFamily="MontserratSemiBold" />
                            {!isPosting && <ArrowRightIcon size={24} color={theme.background.main} />}
                        </Pressable>
                    </>
                )}
            </ScreenView>

            {backDialog &&
                <BottomSheet visible={backDialog} height={320} closeOnDragDown onClose={() => setBackDialog(false)}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <WarningIcon size={72} color={theme.warning} />
                            <ThemeText content={t('createPost.dialog.discardMediaTitle')} variant="sm" fontFamily="MontserratSemiBold" />
                            <ThemeText content={t('createPost.dialog.discardMediaDesc')} variant="xs" severity="secondary" />
                        </View>
                        <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: dimensions.width * 0.1, paddingBottom: 48, width: '100%' }}>
                            <ThemeChip onPress={confirmDiscard} label={t('createPost.actions.discard')} variant="sm" severity="warning" type="solid" containerStyle={{ height: 42, flex: 1, justifyContent: 'center' }} />
                            <ThemeChip onPress={() => setBackDialog(false)} label={t('createPost.actions.cancel')} variant="sm" type="solid" textColor={theme.text.primary} containerStyle={{ height: 42, flex: 1, justifyContent: 'center', backgroundColor: theme.background.slate }} />
                        </View>
                    </View>
                </BottomSheet>
            }
        </>
    )
}

export default CreatePost

const styles = StyleSheet.create({
    content: { padding: 12, gap: 16, paddingBottom: 24 },
    mediaListContent: { gap: 10, paddingRight: 12 },
    mediaWrapHorizontal: { width: 110, height: 110, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f1f5f9' },
    mediaImage: { width: '100%', height: '100%' },
    videoOverlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)' },
    removeBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.7)', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    removeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
})