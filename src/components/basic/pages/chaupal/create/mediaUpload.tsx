import ModernDetailItem from '@/components/basic/modernDetailItem';
import ActionText from '@/components/basic/text/ActionText';
import ThemeText from '@/components/basic/text/ThemeText';
import { AddMediaIcon, ArrowRightIcon, Plus2Icon, WarningIcon } from '@/components/icons';
import API from '@/constants/api';
import { API_URL } from '@/constants/appConstant';
import { useTheme } from '@/hooks/use-theme';
import { updateProcessingState } from '@/slices/processing-state-slice';
import { dimensions } from '@/utils/app-helper';
import { File } from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image as CompressorImage, Video as CompressorVideo } from 'react-native-compressor';
import { useDispatch } from 'react-redux';

type Props = {
    onUploadComplete: (urls: string[]) => void;
    maxFiles?: number;
};

type LocalAsset = {
    id: string;
    uri: string;
    originalUri: string;
    type: 'image' | 'video';
    fileName: string;
    mimeType: string;
    fileSize?: number;
};

const MAX_IMAGE_MB = 5;
const MAX_VIDEO_MB = 25;
const MAX_TOTAL_MB = 125;
const MB = 1024 * 1024;
const COMPRESSION_CONCURRENCY = 2;

function formatMB(bytes?: number) {
    if (!bytes) return '';
    return `${(bytes / MB).toFixed(2)} MB`;
}

function safeDeleteFile(uri: string) {
    try {
        const file = new File(uri);
        if (file.exists) {
            file.delete();
        }
    } catch { }
}

async function mapWithConcurrency<T, R>(
    items: T[],
    limit: number,
    fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let cursor = 0;
    const workers = new Array(Math.min(limit, items.length)).fill(null).map(async () => {
        while (cursor < items.length) {
            const current = cursor++;
            results[current] = await fn(items[current], current);
        }
    });
    await Promise.all(workers);
    return results;
}

export default function CommunityUpload({ onUploadComplete, maxFiles = 5 }: Props) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [assets, setAssets] = useState<LocalAsset[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [compressing, setCompressing] = useState(false);
    const [error, setError] = useState('')

    const isMountedRef = useRef(true);
    const xhrRef = useRef<XMLHttpRequest | null>(null);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            xhrRef.current?.abort();
        };
    }, []);

    const getFileSize = useCallback(async (uri: string): Promise<number> => {
        try {
            const file = new File(uri);
            return file.exists ? (file.size ?? 0) : 0;
        } catch {
            return 0;
        }
    }, []);

    const cleanupTempFile = useCallback(async (asset: LocalAsset) => {
        if (asset.uri !== asset.originalUri) {
            safeDeleteFile(asset.uri);
        }
    }, []);

    const pickMedia = useCallback(async () => {
        setError(``)
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return Alert.alert(t('createPost.upload.permission.neededTitle'));
        if (assets.length >= maxFiles) return Alert.alert(t('createPost.upload.alert.maxFiles', { count: maxFiles }));

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsMultipleSelection: true,
            selectionLimit: maxFiles - assets.length,
            quality: 0.8,
            videoMaxDuration: 60,
        });

        if (result.canceled) return;

        dispatch(updateProcessingState(true))

        let totalSize = assets.reduce((s, a) => s + (a.fileSize || 0), 0);
        const sizes = await Promise.all(
            result.assets.map(a =>
                typeof a.fileSize === 'number' && a.fileSize > 0
                    ? Promise.resolve(a.fileSize)
                    : getFileSize(a.uri)
            )
        );

        const validated: LocalAsset[] = [];
        for (let i = 0; i < result.assets.length; i++) {
            const a = result.assets[i];
            const fileSize = sizes[i];
            const type = a.type === 'video' ? 'video' : 'image';
            const maxAllowed = type === 'video' ? MAX_VIDEO_MB * MB : MAX_IMAGE_MB * MB;

            if (!fileSize) {
                setError(t('createPost.upload.validation.couldNotReadSize', { name: a.fileName || type }))
                continue;
            }

            if (fileSize > maxAllowed) {
                setError(t('createPost.upload.validation.sizeNotAllowed', {
                    name: a.fileName || type,
                    size: formatMB(fileSize),
                    max: type === 'video' ? MAX_VIDEO_MB : MAX_IMAGE_MB
                }))
                continue;
            }

            if (totalSize + fileSize > MAX_TOTAL_MB * MB) {
                setError(t('createPost.upload.validation.totalExceeded', { max: MAX_TOTAL_MB }))
                break;
            }
            totalSize += fileSize;
            validated.push({
                id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
                uri: a.uri,
                originalUri: a.uri,
                type,
                fileName: a.fileName || `media_${Date.now()}_${i}.${type === 'video' ? 'mp4' : 'jpg'}`,
                mimeType: a.mimeType || (type === 'video' ? 'video/mp4' : 'image/jpeg'),
                fileSize,
            });
        }

        if (validated.length) {
            setAssets(prev => [...prev, ...validated]);
        }
        dispatch(updateProcessingState(false))
    }, [assets, maxFiles, getFileSize, t, dispatch]);

    const removeAsset = useCallback((id: string) => {
        setAssets(prev => {
            const toRemove = prev.find(a => a.id === id);
            if (toRemove) cleanupTempFile(toRemove);
            return prev.filter(a => a.id !== id);
        });
    }, [cleanupTempFile]);

    const compress = useCallback(async (asset: LocalAsset): Promise<LocalAsset> => {
        try {
            if (asset.type === 'image') {
                const uri = await CompressorImage.compress(asset.uri, { compressionMethod: 'auto', maxWidth: 1280, quality: 0.7 });
                const fileSize = await getFileSize(uri);
                if (fileSize > MAX_IMAGE_MB * MB) {
                    safeDeleteFile(uri);
                    throw new Error(t('createPost.upload.validation.compressedImageStill', { size: formatMB(fileSize), max: MAX_IMAGE_MB }));
                }
                return { ...asset, uri, fileSize };
            } else {
                const uri = await CompressorVideo.compress(asset.uri, { compressionMethod: 'auto', maxSize: 1280 });
                const fileSize = await getFileSize(uri);
                if (fileSize > MAX_VIDEO_MB * MB) {
                    safeDeleteFile(uri);
                    throw new Error(t('createPost.upload.validation.compressedVideoStill', { size: formatMB(fileSize), max: MAX_VIDEO_MB }));
                }
                return { ...asset, uri, fileSize };
            }
        } catch {
            return asset;
        }
    }, [getFileSize, t]);

    const uploadWithProgress = useCallback((
        formData: FormData,
        onProgress: (percent: number) => void
    ): Promise<any> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhrRef.current = xhr;
            const baseURL = (API.defaults as any).baseURL || API_URL;
            const url = `${baseURL}/v1/upload-community-post-media`;

            const apiKey = process.env.EXPO_PUBLIC_API_KEY ?? '';
            const API_KEY = apiKey ? btoa(apiKey) : '';
            const token = (API.defaults.headers?.common as any)?.Authorization || '';

            xhr.open('POST', url);
            xhr.timeout = 60000;
            if (API_KEY) xhr.setRequestHeader('x-api-key', API_KEY);
            if (token) xhr.setRequestHeader('Authorization', typeof token === 'string' ? token : `Bearer ${token}`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    onProgress(percent);
                }
            };

            xhr.onload = () => {
                try {
                    const res = JSON.parse(xhr.responseText);
                    xhr.status >= 200 && xhr.status < 300 ? resolve(res) : reject(res);
                } catch {
                    xhr.status >= 200 && xhr.status < 300 ? resolve(xhr.responseText) : reject({ message: xhr.responseText });
                }
            };
            xhr.onerror = () => reject({ message: t('createPost.upload.alert.networkError') });
            xhr.ontimeout = () => reject({ message: t('createPost.upload.alert.timeout') });
            xhr.onabort = () => reject({ message: t('createPost.upload.alert.cancelled') });
            xhr.send(formData);
        });
    }, [t]);

    const upload = useCallback(async () => {
        if (!assets.length) return;
        let compressed: LocalAsset[] = [];
        try {
            dispatch(updateProcessingState(true));
            setUploading(true);
            setCompressing(true);

            compressed = await mapWithConcurrency(assets, COMPRESSION_CONCURRENCY, compress);

            if (!isMountedRef.current) return;
            setCompressing(false);

            const finalTotal = compressed.reduce((s, a) => s + (a.fileSize || 0), 0);
            if (finalTotal > MAX_TOTAL_MB * MB) {
                Alert.alert(
                    t('createPost.upload.alert.uploadBlockedTitle'),
                    t('createPost.upload.alert.uploadBlockedDesc', { total: formatMB(finalTotal), max: MAX_TOTAL_MB })
                );
                return;
            }

            const formData = new FormData();
            compressed.forEach((asset) => {
                formData.append('file[]', {
                    uri: asset.uri,
                    name: asset.fileName,
                    type: asset.mimeType,
                } as any);
            });

            const responseData = await uploadWithProgress(formData, (p) => {
                if (isMountedRef.current) setProgress(p);
            });
            const urls: string[] = responseData.data?.urls || responseData.data?.data?.urls || [];

            if (!urls.length) throw new Error(t('createPost.upload.alert.noUrls'));

            onUploadComplete(urls);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (isMountedRef.current) setAssets([]);
        } catch (error: any) {
            console.error('UPLOAD ERROR:', error);
            if (isMountedRef.current) {
                Alert.alert(t('createPost.upload.alert.uploadFailedTitle'), error?.message || t('createPost.upload.alert.uploadFailedDesc'));
            }
        } finally {
            await Promise.all(compressed.map(cleanupTempFile));
            xhrRef.current = null;
            if (isMountedRef.current) {
                setUploading(false);
                setCompressing(false);
                setProgress(0);
            }
            dispatch(updateProcessingState(false));
        }
    }, [assets, compress, uploadWithProgress, onUploadComplete, dispatch, cleanupTempFile, t]);

    const justSkip = useCallback(() => onUploadComplete([]), [onUploadComplete]);

    const totalSize = useMemo(
        () => assets.reduce((s, a) => s + (a.fileSize || 0), 0),
        [assets]
    );

    const keyExtractor = useCallback((item: LocalAsset) => item.id, []);

    const renderItem = useCallback(({ item }: { item: LocalAsset }) => (
        <View style={styles.thumbWrap}>
            <Image source={{ uri: item.uri }} style={styles.thumb} contentFit="cover" cachePolicy="memory-disk" />
            <View style={styles.sizeBadge}>
                <Text style={styles.sizeText}>{formatMB(item.fileSize)}</Text>
            </View>
            <TouchableOpacity
                style={styles.remove}
                onPress={() => removeAsset(item.id)}
                accessibilityRole="button"
                accessibilityLabel={t('createPost.upload.list.removeA11y', { type: item.type })}
            >
                <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
            {item.type === 'video' && (
                <View style={styles.videoDot}>
                    <Text style={{ color: '#fff', fontSize: 8, fontWeight: '700' }}>{t('createPost.upload.list.videoBadge')}</Text>
                </View>
            )}
        </View>
    ), [removeAsset, t]);

    const listEmptyComponent = useMemo(() => (
        <Pressable
            onPress={pickMedia}
            accessibilityRole="button"
            accessibilityLabel={t('createPost.upload.list.chooseA11y')}
            style={{ alignItems: 'center', justifyContent: 'center', height: dimensions.height * 0.6 }}
        >
            <AddMediaIcon size={72} strokeWidth={1} color={theme.text.disabled} />
            <ThemeText content={t('createPost.upload.empty.noMedia')} variant='sm' fontFamily='MontserratBold' severity='disabled' />
            <ThemeText content={t('createPost.upload.empty.tapToChoose', { image: MAX_IMAGE_MB, video: MAX_VIDEO_MB })} variant='xs' severity='secondary' />
        </Pressable>
    ), [pickMedia, theme, t]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background.slate, borderRadius: 24, padding: 8 }}>
            <FlatList
                data={assets}
                numColumns={2}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListEmptyComponent={listEmptyComponent}
                initialNumToRender={maxFiles}
                removeClippedSubviews
            />

            {error && <ModernDetailItem bg={`${theme.error}15`} icon={WarningIcon} iconColor={theme.error} label={{ content: t('createPost.upload.actions.errorLabel') }}
                description={{ content: error }} />}
            {assets.length > 0 && (
                <View style={{ paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ThemeText content={t('createPost.upload.list.filesCount', { current: assets.length, max: maxFiles })} variant='xs' severity='secondary' />
                    <ThemeText content={t('createPost.upload.list.totalSize', { current: formatMB(totalSize), max: MAX_TOTAL_MB })} variant='xs' severity={totalSize > MAX_TOTAL_MB * MB ? 'error' : 'secondary'} />
                </View>
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'stretch', padding: 16 }}>
                <Pressable
                    onPress={pickMedia}
                    disabled={uploading || compressing}
                    accessibilityRole="button"
                    accessibilityLabel={t('createPost.upload.list.selectA11y')}
                    style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                        backgroundColor: theme.background.main, borderWidth: 1, borderRadius: 24, height: 72,
                        width: assets.length > 0 ? 72 : 'auto', flex: assets.length > 0 ? undefined : 1,
                        paddingLeft: assets.length > 0 ? 0 : 24, opacity: uploading || compressing ? 0.5 : 1
                    }}>
                    {assets.length > 0
                        ? <Plus2Icon strokeWidth={0.75} size={32} color={theme.text.primary} />
                        : <ThemeText style={{ flex: 1, textAlign: 'center' }} content={t('createPost.upload.actions.select')} variant='md' fontFamily='MontserratSemiBold' />}
                </Pressable>

                {assets.length > 0 && (
                    <Pressable
                        onPress={upload}
                        disabled={uploading || compressing}
                        accessibilityRole="button"
                        accessibilityLabel={t('createPost.upload.list.continueA11y')}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: theme.text.primary, borderRadius: 24, height: 72, flex: 1, paddingLeft: 24, opacity: uploading || compressing ? 0.6 : 1 }}>
                        <ThemeText
                            style={{ flex: 1, textAlign: 'center' }}
                            color={theme.background.main}
                            content={
                                compressing
                                    ? t('createPost.upload.actions.processing')
                                    : uploading
                                        ? t('createPost.upload.actions.uploading', { progress })
                                        : t('createPost.upload.actions.continue')
                            }
                            variant='lg'
                            fontFamily='MontserratSemiBold'
                        />
                        <ArrowRightIcon size={32} color={theme.background.main} />
                    </Pressable>
                )}
            </View>

            {!assets?.length && <ActionText label={t('createPost.upload.actions.continueWithout')} severity='main' action={justSkip} />}
        </View>
    );
}

const styles = StyleSheet.create({
    thumbWrap: { width: '48%', aspectRatio: 1, margin: '1%', borderRadius: 12, overflow: 'hidden', backgroundColor: '#eee' },
    thumb: { width: '100%', height: '100%' },
    remove: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.7)', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    removeText: { color: '#fff', fontSize: 10 },
    sizeBadge: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    sizeText: { color: '#fff', fontSize: 9, fontWeight: '600' },
    videoDot: { position: 'absolute', top: 4, left: 4, backgroundColor: '#ef4444', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
});