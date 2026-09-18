

import ListItem from "@/components/basic/ListItem"
import ThemeText from "@/components/basic/text/ThemeText"
import { useTheme } from "@/hooks/use-theme"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { IdeaBulbIcon } from "../../../explorePage/icon"




const UpdatedDetails = ({ details }: { details: any }) => {

    const theme = useTheme()

    const user = useSelector((state: RootState) => state.auth)

    return (
        details?.key === 'updated' && (
            <>
                <>
                    <ThemeText
                        content={'Updated Details'}
                        fontFamily='MontserratBold'
                        style={{
                            opacity: 0.3,
                            borderBottomWidth: 0.5,
                            marginBottom: 8,

                        }} color={theme?.text.secondary} />

                    {details?.remarks
                        ? details.remarks
                            .split(',')
                            .slice(0, -1)
                            .map((text: string, idx: number) =>
                                (!text.includes('Spray date') && !text.includes('Acreage') && !user.isLoggedIn) ||
                                    !text
                                    ? null
                                    : (
                                        <ListItem
                                            key={idx}
                                            label={text.split(':')[0]}
                                            icon={<IdeaBulbIcon height={12} width={12} color={details.color} style={{ opacity: 0.7 }} />}
                                            actionElement={<>
                                                <ThemeText content={`${text.split(':')[1]}`} fontFamily='MontserratMedium' /></>}
                                        />
                                    )
                            )
                        : null}


                </>

                {user && (
                    <>
                        {details?.remarks
                            ? details.remarks
                                .split(',')
                                .slice(-1)
                                .map((text: string, idx: number) => (
                                    <ThemeText
                                        key={idx}
                                        content={`Remraks: ${text}`}
                                        style={{ marginTop: 16 }}
                                    />
                                ))
                            : null}
                    </>
                )}

            </>
        )
    )
}


export default UpdatedDetails