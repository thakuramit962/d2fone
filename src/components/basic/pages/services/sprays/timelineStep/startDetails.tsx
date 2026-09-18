

import ListItem from "@/components/basic/ListItem"
import ThemeText from "@/components/basic/text/ThemeText"
import ThemeChip from "@/components/basic/ThemeChip"
import ThemeDivider from "@/components/basic/ThemeDivider"
import { s3BucketUrl } from "@/constants/appConstant"
import { dimensions } from "@/utils/app-helper"
import { Image, Linking, View } from "react-native"
import { IrrigationIcon } from "../../../explorePage/icon"



const StartDetails = ({ details }: { details: any }) => {

    return (
        details?.key === 'started' && (
            <>
                <ThemeDivider size={8} />
                <ThemeText
                    variant='xs'
                    severity='secondary'
                    style={{ textAlign: 'center' }}
                    content={`Spray started by ${details?.by} in the presence of ${details?.availablePerson} ${details?.freshWater === '1' ? 'with' : 'without'} fresh water.`} />


                <ThemeDivider size={24} />

                <ListItem
                    icon={<IrrigationIcon height={14} width={14} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Chemical'
                />
                <ThemeText content={`${details?.chemicals}`} fontFamily='MontserratMedium' />

                <ThemeChip
                    label={details?.noc ? 'View NOC' : 'NOC not uploaded'}
                    severity='warning'
                    textStyle={{ textAlign: 'center' }}
                    onPress={() => {
                        if (details?.noc) {
                            Linking.openURL(`${s3BucketUrl}/noc_image/${details?.noc}`)
                        }
                    }}
                    type='solid'
                    containerStyle={{ justifyContent: 'center', height: 32, marginTop: 16 }}
                />


                {details?.noc && (
                    <View >
                        <Image
                            source={{
                                uri: `${s3BucketUrl}/noc_image/${details?.noc}`,
                            }}
                            resizeMode="contain"
                            style={{
                                width: dimensions.width * 0.8,
                            }}
                        />
                    </View>
                )}
            </>
        )
    )
}


export default StartDetails