// import IconButton from '@/components/IconButton'
import { BinIcon, GallaryIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { useGlobalStyle } from '@/hooks/useGlobalStyle'
import * as ImagePicker from 'expo-image-picker'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native'
import IconButton from '../../buttons/IconButton'
import ThemeText from '../../text/ThemeText'


interface GraphicPickerProps {
    label?: string,
    required?: boolean
    error?: boolean
    helperText?: string
    source?: 'gallery' | 'camera'
}


// Inside GraphicPicker.tsx
export type GraphicPickerHandle = {
    getImage: () => string | null; // returns URI string only
    clearImage: () => void;
}
const GraphicPicker = forwardRef<GraphicPickerHandle, GraphicPickerProps>(({
    label,
    required = false,
    error = false,
    helperText = 'Choose Image',
    source = 'gallery'
}, ref) => {
    // const height = 120

    const theme = useTheme()
    const globalStyle = useGlobalStyle()

    const [image, setImage] = useState<string | null>(null)

    const pickImage = async () => {
        if (source === "camera") {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission needed", "Camera permission is required.");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"], // ✅ new way
                allowsEditing: true,
                quality: 0.7,
                base64: true,
            });

            if (!result.canceled) {
                setImage(result.assets[0]?.uri || null);
            }
        }

        if (source === "gallery") {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"], // ✅ new way
                quality: 0.7,
            });

            if (!result.canceled) {
                setImage(result.assets[0]?.uri || null);
            }
        }
    };

    // 👇 Expose methods to parent
    useImperativeHandle(ref, () => ({
        getImage: () => image,
        clearImage: () => setImage(null),
    }))

    return (
        <>
            {label && (
                <View style={styles.labelRow}>
                    <ThemeText
                        content={label}
                        fontFamily="InterRegular"
                        style={[
                            styles.label,
                            {
                                color: error
                                    ? theme.error
                                    : theme.text.secondary,
                                fontSize: 12,
                            },
                        ]}
                    />
                    {required && (
                        <ThemeText
                            content="*"
                            fontFamily="MontserratMedium"
                            style={{ color: theme.error, fontSize: 12 }}
                        />
                    )}
                </View>
            )}
            <Pressable
                onPress={pickImage}
                style={{
                    // height,
                    borderRadius: 16,
                    padding: 2,
                    paddingTop: 4,
                    justifyContent: 'space-between',
                    borderColor: `${theme.text.primary}25`,
                    borderWidth: 1,
                }}
            >
                {image ? (
                    <>
                        <Image
                            source={{ uri: image }}
                            style={{
                                height: 80,
                                resizeMode: 'cover',
                                borderRadius: 14,
                            }}
                        />
                        <IconButton
                            onPress={() => setImage(null)}
                            withoutBg
                            icon={<BinIcon height={14} width={14} color={theme?.error} />}
                            style={{
                                position: 'absolute',
                                bottom: 4,
                                right: 4,
                                backgroundColor: theme?.background.main,
                                borderRadius: 30,
                            }}
                        />
                    </>
                ) : (
                    <View
                        style={{
                            ...globalStyle.flexCenter,
                            height: 80,
                            borderRadius: 14,
                            backgroundColor: error ? `${theme?.error}10` : 'transparent',
                        }}
                    >
                        <GallaryIcon color={theme?.text.disabled} />
                        <ThemeText
                            content={helperText}
                            fontFamily="MontserratMedium"
                            severity="disabled"
                        />
                    </View>
                )}
            </Pressable>
        </>
    )
})

export default GraphicPicker



const styles = StyleSheet.create({
    labelRow: {
        flexDirection: 'row',
        gap: 4,
    },
    label: {
        paddingLeft: 16,
    },
    icon: {
        marginRight: 6,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    helperText: {
        marginHorizontal: 16,
    },
})