
import ActionText from "@/components/basic/text/ActionText"
import ThemeText from "@/components/basic/text/ThemeText"
import { FocusIcon } from "@/components/icons"
import { useTheme } from "@/hooks/use-theme"
import { updateToast } from "@/slices/toast-slice"
import { Camera, CameraView } from "expo-camera"
import { useEffect, useState } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { useDispatch } from "react-redux"



const QRScanner = ({ callback }: { callback: (params: any) => void }) => {

    const dimensions = Dimensions.get('screen')
    const theme = useTheme()
    const dispatch = useDispatch()


    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);


    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);

    const handleBarcodeScanned = ({ data }: { data: any }) => {
        if (data?.length == 10) {
            callback(data?.toUpperCase())
            setScanned(true);

        } else {
            dispatch(updateToast({ title: 'Error', message: 'Inavlid Referance Code', severity: 'error' }))
        }
    }


    if (hasPermission === null) {
        return <ThemeText content={'Requesting for camera permission'} />;
    }
    if (hasPermission === false) {
        return <ThemeText content={'No access to camera'} />;
    }

    return (
        <>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                }}
                style={[StyleSheet.absoluteFill]}

            />
            <View
                style={[StyleSheet.absoluteFill, {
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                }]}>
                <>
                    <FocusIcon color={theme?.warning} height={dimensions.width * 0.75} width={dimensions.width * 0.75} />
                    {scanned && (
                        <ActionText label='Tap to Scan Again' action={() => setScanned(false)} />
                    )}
                </>
            </View>
        </>
    );
}


export default QRScanner