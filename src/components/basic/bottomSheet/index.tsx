import { CloseIcon } from "@/components/icons";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    Pressable,
    StyleSheet,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetProps } from "./bottomSheetTypes";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function BottomSheet({
    visible,
    onClose,
    children,
    height = SCREEN_HEIGHT * 0.6,
    animationDuration = 280,
    closeOnBackdropPress = true,
    closeOnDragDown = true,
    showCloseIcon = false
}: BottomSheetProps) {

    const theme = useTheme()
    const { top } = useSafeAreaInsets()

    const translateY = useRef(new Animated.Value(height)).current;

    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            open();
        } else {
            close();
        }
    }, [visible]);

    const open = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }),

            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const close = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: height,
                duration: animationDuration,
                useNativeDriver: true,
            }),

            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) =>
                Math.abs(gesture.dy) > 5,

            onPanResponderMove: (_, gesture) => {
                if (!closeOnDragDown) return;

                if (gesture.dy > 0) {
                    translateY.setValue(gesture.dy);
                }
            },

            onPanResponderRelease: (_, gesture) => {
                if (!closeOnDragDown) return;

                if (gesture.dy > 120 || gesture.vy > 1.3) {
                    onClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        visible
            ? <Modal
                visible={visible}
                transparent
                animationType="none"
                statusBarTranslucent
            >
                <View style={styles.root}>

                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => {
                            if (closeOnBackdropPress) onClose();
                        }}
                    >
                        <Animated.View
                            style={[
                                {
                                    flex: 1,
                                    backgroundColor: `${theme?.text?.primary}80`,
                                    opacity: backdropOpacity,
                                },
                            ]}
                        />

                    </Pressable>
                    {showCloseIcon &&
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            paddingTop: top, paddingBottom: 16,

                        }}>
                            <Pressable
                                onPress={() => {
                                    if (closeOnBackdropPress) onClose();
                                }}
                                style={{
                                    height: 42,
                                    width: 42,
                                    borderRadius: 18,
                                    backgroundColor: `${theme?.text?.primary}80`,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }} >
                                <CloseIcon color={`${theme?.background?.main}90`} />
                            </Pressable>
                        </View>
                    }

                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            {
                                backgroundColor: theme?.background?.main,
                                borderTopLeftRadius: 28,
                                borderTopRightRadius: 28,
                                overflow: "hidden",
                                elevation: 30,
                                shadowColor: theme?.text?.primary,
                                shadowOpacity: 0.15,
                                shadowRadius: 20,
                                shadowOffset: {
                                    width: 0,
                                    height: -5,
                                },
                                height,
                                transform: [
                                    {
                                        translateY,
                                    },
                                ],
                            },
                        ]}
                    >

                        <View style={styles.handle} />

                        {children}

                    </Animated.View>

                </View>
            </Modal>
            : null
    );
}

const styles = StyleSheet.create({

    root: {
        flex: 1,
        justifyContent: "flex-end",
    },
    sheet: {

    },

    handle: {
        width: 50,
        height: 5,
        borderRadius: 10,
        backgroundColor: "#D0D0D0",
        alignSelf: "center",
        marginVertical: 12,
    },
});