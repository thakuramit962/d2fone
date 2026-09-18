import { InfoIcon, LinkIcon } from '@/components/icons'
import { useTheme } from '@/hooks/use-theme'
import { CommunityPostReel } from '@/models/communityPost'
import { dimensions } from '@/utils/app-helper'
import { memo, useCallback, useMemo } from 'react'
import { Linking, ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomSheet from '../../bottomSheet'
import ModernDetailItem from '../../modernDetailItem'
import ActionText from '../../text/ActionText'
import ThemeDivider from '../../ThemeDivider'

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16 },
})

type FeedDetailProps = {
    detail: CommunityPostReel | null | undefined
    closeAction: () => void
}

const FeedDetail = ({ detail, closeAction }: FeedDetailProps) => {
    const theme = useTheme()
    const { top, bottom } = useSafeAreaInsets()

    const containerStyle = useMemo(
        () => [styles.container, { paddingBottom: bottom }],
        [bottom]
    )

    const sheetHeight = useMemo(
        () => dimensions.height - top,
        [top]
    )

    const minHeight = useMemo(
        () => dimensions.height * 0.35,
        []
    )

    const hasSourceUrl = Boolean(detail?.readmore_url)

    const handleOpenSource = useCallback(() => {
        if (detail?.readmore_url) {
            Linking.openURL(detail.readmore_url).catch(() => {
            })
        }
    }, [detail?.readmore_url])

    if (!detail) return null

    return (
        <BottomSheet
            closeOnDragDown
            height={sheetHeight}
            onClose={closeAction}
            visible={Boolean(detail)}
        >
            <View style={containerStyle}>
                <ScrollView contentContainerStyle={styles.content}>
                    <ModernDetailItem
                        minHeight={minHeight}
                        iconOnTop
                        bg={theme.background.slate}
                        icon={InfoIcon}
                        label={{ content: detail.title, fontFamily: 'MontserratBold', variant: 'xs', severity: 'main' }}
                        description={{ content: detail.description, variant: 'xs', severity: 'secondary', fontFamily: 'InterRegular' }}
                    />
                    <ThemeDivider size={16} />

                    {hasSourceUrl && (
                        <ModernDetailItem
                            bg={theme.background.slate}
                            icon={LinkIcon}
                            label={{ content: 'Source' }}
                            description={{ content: detail.readmore_url, variant: 'xs' }}
                            onPress={handleOpenSource}
                        />
                    )}
                </ScrollView>

                <ActionText label="Close" action={closeAction} />
                <ThemeDivider size={16} />
            </View>
        </BottomSheet>
    )
}

export default memo(FeedDetail)