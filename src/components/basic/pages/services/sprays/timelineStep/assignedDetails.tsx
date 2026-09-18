import ListItem from "@/components/basic/ListItem"
import ThemeText from "@/components/basic/text/ThemeText"
import { AuthUserIcon, DroneIcon, MobileIcon, } from "@/components/icons"


const AssignedDetails = ({ details }: { details: any }) => {

    return (
        details?.key === 'assigned' && (
            <>
                <ListItem
                    icon={<AuthUserIcon height={14} width={14} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Operator'
                    actionElement={<ThemeText content={`${details?.name}`} fontFamily='MontserratMedium' />}
                />
                <ListItem
                    icon={<MobileIcon height={14} width={14} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Phone'
                    actionElement={<ThemeText content={`${details?.phone}`} fontFamily='MontserratMedium' />}
                />
                <ListItem
                    icon={<DroneIcon height={14} width={14} style={{ opacity: 0.6 }} color={details.color} />}
                    label='Asset'
                    actionElement={<ThemeText content={`${details?.asset}`} fontFamily='MontserratMedium' />}
                />
            </>
        )
    )
}


export default AssignedDetails