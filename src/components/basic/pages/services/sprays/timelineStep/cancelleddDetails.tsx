import ListItem from "@/components/basic/ListItem"
import ThemeText from "@/components/basic/text/ThemeText"
import { InfoIcon } from "@/components/icons"




const CancelleddDetails = ({ details }: { details: any }) => {

    return (
        details?.key === 'cancel' && (
            <>
                <ListItem
                    icon={<InfoIcon style={{ opacity: 0.7 }} color={details.color} />}
                    label='Remarks'
                />
                <ThemeText content={`${details?.cancelRemarks}`} variant='xs' fontFamily='MontserratMedium' style={{ marginTop: 16 }} />
            </>
        )
    )
}


export default CancelleddDetails