import ListItem from "@/components/basic/ListItem"
import ThemeText from "@/components/basic/text/ThemeText"
import ThemeDivider from "@/components/basic/ThemeDivider"
import { s3BucketUrl } from "@/constants/appConstant"
import { useTheme } from "@/hooks/use-theme"
import { useGlobalStyle } from "@/hooks/useGlobalStyle"
import { RootState } from "@/store/store"
import { currencyFormatter } from "@/utils/app-helper"
import { Image, Linking, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import { IdeaBulbIcon } from "../../../explorePage/icon"


const CompletedDetails = ({ details }: { details: any }) => {

    const theme = useTheme()
    const globalStyle = useGlobalStyle()
    const user = useSelector((state: RootState) => state.auth)

    return (
        details?.key === 'completed' && (
            <>
                <ListItem
                    icon={<IdeaBulbIcon height={12} width={12} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Requested Acreage'
                    actionElement={<ThemeText content={`${details?.requestedAcreage}`} fontFamily='MontserratMedium' />}
                />
                <ListItem
                    icon={<IdeaBulbIcon height={12} width={12} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Sprayed Acreage'
                    actionElement={<ThemeText content={`${details?.sprayedAcreage}`} fontFamily='MontserratMedium' />}
                />
                {user.isLoggedIn && !(user.currentUser?.role == 'cso' || user.currentUser?.role == 'client') && (
                    <ListItem
                        icon={<IdeaBulbIcon height={12} width={12} style={{ opacity: 0.6 }} color={details.color} />}
                        label='Drone Acreage'
                        actionElement={<ThemeText content={`${details?.droneAcreage}`} fontFamily='MontserratMedium' />}
                    />
                )}

                <ListItem
                    icon={<IdeaBulbIcon height={12} width={12} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Effective Amount'
                    actionElement={<ThemeText content={`${currencyFormatter(+(details?.effectiveAmount ?? 0))}`} fontFamily='MontserratMedium' />}
                />
                <ListItem
                    icon={<IdeaBulbIcon height={12} width={12} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Effective Discount'
                    actionElement={<ThemeText content={`${currencyFormatter(+(details?.effectiveDiscount ?? 0))}`} fontFamily='MontserratMedium' />}
                />
                <ListItem
                    icon={<IdeaBulbIcon height={12} width={12} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Effective Payable'
                    actionElement={<ThemeText content={`${currencyFormatter(+(details?.effectivePayable ?? 0))}`} fontFamily='MontserratMedium' />}
                />
                <ListItem
                    icon={<IdeaBulbIcon height={12} width={12} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Access Amount'
                    actionElement={<ThemeText content={`${currencyFormatter(+(details?.accessAmount ?? 0))}`} fontFamily='MontserratMedium' />}
                />
                <ListItem
                    icon={<IdeaBulbIcon height={12} width={12} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Refund Amount'
                    actionElement={<ThemeText content={`${currencyFormatter(+(details?.refundAmount ?? 0))}`} fontFamily='MontserratMedium' />}
                />

                <ThemeDivider size={24} />
                <View style={[]}>
                    <View>
                        <ThemeText content={'Delivery Proof'} fontFamily='MontserratMedium' severity='secondary' />

                        <View style={[globalStyle.rowCenter, { gap: 4, }]}>
                            <View style={[{ flex: 1 }]}>
                                <TouchableOpacity
                                    onPress={() =>
                                        Linking.openURL(
                                            `${s3BucketUrl}/farmer_img_/${details?.farmerImage}`
                                        )
                                    }
                                >
                                    <Image
                                        source={{
                                            uri: `${s3BucketUrl}/farmer_img_/${details?.farmerImage}`,
                                        }}
                                        style={{
                                            height: 100,
                                            flex: 1,
                                            borderRadius: 12,
                                            backgroundColor: theme?.background.main
                                        }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={[{ flex: 1 }]}>
                                <TouchableOpacity onPress={() => Linking.openURL(details?.farmerSign)} >
                                    <Image source={{ uri: details?.farmerSign }} resizeMode="contain"
                                        style={{
                                            height: 100,
                                            flex: 1,
                                            borderRadius: 12,
                                            backgroundColor: theme?.background.main
                                        }} />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>

                <ThemeDivider size={16} />

                {details?.farmImage && (
                    <View style={[{
                        gap: 4,
                    }]}>
                        <ThemeText content={'Farm Image'} fontFamily='MontserratMedium' severity='secondary' />
                        <View style={[globalStyle.rowCenter]}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() =>
                                        Linking.openURL(
                                            `${s3BucketUrl}/refund_img_/${details?.farmImage}`
                                        )
                                    }
                                >
                                    <Image
                                        source={{
                                            uri: `${s3BucketUrl}/refund_img_/${details?.farmImage}`,
                                        }}
                                        style={{
                                            height: 100,
                                            flex: 1,
                                            borderRadius: 12,
                                            backgroundColor: theme?.background.main
                                        }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </>
        )
    )
}

export default CompletedDetails