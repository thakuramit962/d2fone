import { BinIcon, CameraIcon, ImageIcon } from "@/components/icons";
import { useTheme } from "@/hooks/use-theme";
import { useGlobalStyle } from "@/hooks/useGlobalStyle";
import { updateToast } from "@/slices/toast-slice";
import { dimensions } from "@/utils/app-helper";
import * as ImagePicker from "expo-image-picker";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import ThemeText from "../../text/ThemeText";
import ThemeChip from "../../ThemeChip";

interface ImageInputProps {
    image: string | null;
    setImage: Dispatch<SetStateAction<string | null>>;
    label?: string;
    placeholder?: string;
    helperText?: string
    error?: string
    small?: boolean
}

const ImageInput: React.FC<ImageInputProps> = ({
    image,
    setImage,
    label = "Choose Image",
    placeholder = "Select a source to upload file",
    helperText,
    error,
    small = false
}) => {

    const theme = useTheme();
    const globalStyle = useGlobalStyle();
    const dispatch = useDispatch();

    const requestPermission = async (): Promise<boolean> => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus !== "granted" || mediaStatus !== "granted") {
            Alert.alert("Permission denied", "We need access to your camera and gallery.");
            return false;
        }
        return true;
    };

    const handleImage = async (action: () => Promise<ImagePicker.ImagePickerResult>) => {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
            dispatch(
                updateToast({
                    title: "Permission Error",
                    message: "Permission to access files or camera not allowed.",
                    severity: "error",
                })
            );
            return;
        }

        const result = await action();
        if (!result.canceled) {
            setImage(result.assets[0].uri)
        };
    };

    return (
        <View style={[styles.container, { backgroundColor: error ? `${theme?.error}10` : theme?.background.slate }]}>
            <View style={[globalStyle.rowCenter, styles.header]}>
                <View
                    style={[
                        globalStyle.flexCenter,
                        { backgroundColor: theme?.background.main },
                        styles.iconWrapper,
                    ]}
                >
                    <ImageIcon height={24} width={24} color={theme?.text.disabled} />
                </View>
                <ThemeText
                    content={label}
                    variant="sm"
                    fontFamily="MontserratMedium"
                    severity={error ? 'error' : 'main'}
                    style={{ flex: 1 }}
                />
            </View>

            <View style={[globalStyle.flexCenter, styles.body]}>
                {image ? (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: image }}
                            style={styles.preview}
                        />
                        <ThemeChip
                            label="Discard"
                            icon={BinIcon}
                            severity="error"
                            containerStyle={{ alignSelf: "flex-end" }}
                            onPress={() => setImage(null)}
                        />
                    </View>
                ) : (
                    <>
                        <View style={[globalStyle.rowCenter, styles.actions]}>
                            <PickerButton
                                color={theme?.primary as string}
                                icon={<CameraIcon color={theme?.primary} height={32} width={32} />}
                                label={small ? '' : "Capture"}
                                onPress={() =>
                                    handleImage(() =>
                                        ImagePicker.launchCameraAsync({
                                            mediaTypes: ['images'], // ✅ new format
                                            allowsEditing: true,
                                            quality: 1,
                                            cameraType: ImagePicker.CameraType.back,
                                            base64: true,
                                        })
                                    )
                                }
                            />
                            <PickerButton
                                color={theme?.primary as string}
                                icon={<ImageIcon color={theme?.primary} height={32} width={32} />}
                                label={small ? '' : "Upload"}
                                onPress={() =>
                                    handleImage(() =>
                                        ImagePicker.launchImageLibraryAsync({
                                            mediaTypes: ['images'], // ✅ new format
                                            allowsEditing: true,
                                            quality: 1,
                                            base64: true,
                                        })
                                    )
                                }
                            />
                        </View>
                        <ThemeText content={placeholder} color={theme?.text.disabled} />
                    </>
                )}
                {(helperText || error) && <ThemeText content={(error ?? helperText) ?? ""} severity={error ? 'error' : 'disabled'} />}
            </View>
        </View>
    );
};



const PickerButton = ({ color, icon, label, onPress }: { color: string, icon: ReactNode, label?: string, onPress: () => void }) => (
    <Pressable
        style={[styles.button, {
            backgroundColor: `${color}20`,
            paddingRight: label ? 24 : 12,
        }]}
        onPress={onPress}
    >
        {icon}
        {label &&
            <ThemeText
                content={label}
                variant="xs"
                fontFamily="MontserratSemiBold"
                color={color}
            />
        }
    </Pressable>
);

const styles = StyleSheet.create({
    container: {
        borderRadius: 22,
        padding: 4,
        minHeight: 180,
    },
    header: {
        gap: 8,
    },
    iconWrapper: {
        padding: 6,
        borderRadius: 23,
    },
    body: {
        flex: 1,
    },
    imageContainer: {
        flex: 1,
        alignSelf: "stretch",
        paddingHorizontal: 4,
        paddingBottom: 4,
    },
    preview: {
        width: dimensions.width * 0.7,
        height: 140,
        resizeMode: "contain",
        borderRadius: 12,
        alignSelf: "center",
    },
    actions: {
        gap: 16,
        flex: 1,
        minHeight: 140,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 18,
        padding: 12,
        gap: 8,
    },
});

export default ImageInput;
