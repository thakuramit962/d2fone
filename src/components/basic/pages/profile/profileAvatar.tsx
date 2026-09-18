import API from '@/constants/api'
import { s3BucketUrl } from '@/constants/appConstant'
import { useTheme } from '@/hooks/use-theme'
import { useUser } from '@/hooks/useUser'
import { User } from '@/models/user'
import { File } from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Image, Pressable, View } from 'react-native'
import { Image as ImageCompressor } from 'react-native-compressor'
import ThemeText from '../../text/ThemeText'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5MB — adjust to your backend's limit

const ProfileAvatar = ({ detail }: { detail: User }) => {
    const theme = useTheme()
    const { fetchUser } = useUser()

    const [previewUri, setPreviewUri] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    const uploadImage = useCallback(
        async (uri: string, fileName: string, mimeType: string) => {
            const formData = new FormData()
            // React Native's fetch/FormData expects this shape for file fields.
            formData.append('profile_image', {
                uri,
                name: fileName,
                type: mimeType,
            } as unknown as Blob)

            const res = await API.post('/v1/update-profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            if (res.data?.status !== 'success') {
                throw new Error(res.data?.message ?? 'Upload failed')
            }

            await fetchUser()
        },
        [fetchUser],
    )

    const pickMedia = useCallback(async () => {
        const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert(
                'Permission needed',
                canAskAgain
                    ? 'Please allow photo library access to change your profile picture.'
                    : 'Photo library access is disabled. Enable it from your device settings to change your profile picture.',
            )
            return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: false,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (result.canceled || !result.assets?.length) return

        const picked = result.assets[0]

        try {
            setUploading(true)

            // Compress before upload to keep payloads small and uploads fast.
            const compressedUri = await ImageCompressor.compress(picked.uri, {
                compressionMethod: 'auto',
                maxWidth: 1080,
                quality: 0.7,
            })

            // expo-file-system's new File class reads local file:// URIs directly —
            // avoids fetch().blob(), which isn't supported for local files on native.
            const file = new File(compressedUri)
            if (file.exists && (file.size ?? 0) > MAX_UPLOAD_BYTES) {
                Alert.alert('Image too large', 'Please choose a smaller image (under 5MB).')
                return
            }

            const fileName = picked.fileName ?? `avatar-${Date.now()}.jpg`
            const mimeType = picked.mimeType ?? 'image/jpeg'

            // Optimistic preview while the upload is in flight.
            setPreviewUri(compressedUri)

            await uploadImage(compressedUri, fileName, mimeType)
        } catch (err) {
            console.error('Error updating profile picture', err)
            setPreviewUri(null) // roll back optimistic preview on failure
            Alert.alert('Upload failed', 'Something went wrong while updating your profile picture.')
        } finally {
            setUploading(false)
        }
    }, [uploadImage])

    const imageSource = previewUri
        ? { uri: previewUri }
        : detail?.profile_image
            ? { uri: `${s3BucketUrl}/${detail.profile_image}` }
            : require('@/assets/images/static/user.png')

    return (
        <View>
            <Image
                source={imageSource}
                style={{
                    borderRadius: 48,
                    borderTopRightRadius: 2,
                    backgroundColor: theme.background.slate,
                    height: 150,
                    width: 150,
                    resizeMode: 'cover',
                }}
                accessibilityLabel="Profile picture"
            />
            {uploading && (
                <View
                    style={{
                        ...StyleSheetAbsoluteFillCenter,
                        backgroundColor: `${theme.background.slate}80`,
                        borderRadius: 48,
                        borderTopRightRadius: 2,
                    }}
                >
                    <ActivityIndicator color={theme.text.primary} />
                </View>
            )}
            <Pressable
                onPress={pickMedia}
                disabled={uploading}
                accessibilityRole="button"
                accessibilityLabel="Change profile picture"
                hitSlop={8}
                style={{
                    position: 'absolute',
                    top: 4,
                    right: 0,
                    backgroundColor: theme.text.primary,
                    paddingVertical: 2,
                    paddingHorizontal: 8,
                    borderRadius: 2,
                    borderBottomLeftRadius: 10,
                    opacity: uploading ? 0.6 : 1,
                }}
            >
                <ThemeText
                    content={uploading ? 'Uploading...' : 'Change'}
                    color={theme.background.main}
                    fontFamily="MontserratSemiBold"
                />
            </Pressable>
        </View>
    )
}

const StyleSheetAbsoluteFillCenter = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
}

export default ProfileAvatar