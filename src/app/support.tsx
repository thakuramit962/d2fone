import BottomSheet from '@/components/basic/bottomSheet'
import CompanyFooter from '@/components/basic/companyFooter'
import ScreenView from '@/components/basic/containers/screenView'
import ModernDetailItem from '@/components/basic/modernDetailItem'
import { IdeaBulbIcon } from '@/components/basic/pages/explorePage/icon'
import ActionText from '@/components/basic/text/ActionText'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { ArrowRightIcon, EmailIcon, MobileIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import { SERVER_URL } from '@/constants/appConstant'
import { useTheme } from '@/hooks/use-theme'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { callNumber, copyData, sendEmail } from '@/utils/app-helper'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Image, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface FAQ_TYPE {
    ques: string
    ans: string
}

const FAQ_URL = `${SERVER_URL}/faq.json`

const Support = () => {

    const theme = useTheme()
    const scrollRef = useScrollToTop()
    const { bottom, top } = useSafeAreaInsets()
    const [selectedFaq, setSelectedFaq] = useState<FAQ_TYPE | null>(null)
    const [faqs, setFaqs] = useState<FAQ_TYPE[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const openSheet = useCallback((faq: FAQ_TYPE) => setSelectedFaq(faq), [])
    const closeSheet = useCallback(() => setSelectedFaq(null), [])

    const loadFaqs = useCallback(async () => {
        try {
            setLoading(true)
            setError(false)
            const res = await fetch(FAQ_URL)
            if (!res.ok) throw new Error('Failed to fetch FAQs')
            const data: FAQ_TYPE[] = await res.json()
            setFaqs(Array.isArray(data) ? data : [])
        } catch (e) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadFaqs()
    }, [loadFaqs])

    return (
        <>
            <ScreenView bg={'transparent'}>
                <Header withoutTopPadding withPadding={false} style={{ marginHorizontal: 8, marginTop: 8, }}
                    bottomSlot={
                        <View style={{
                            borderRadius: 24,
                            borderCurve: 'continuous',
                            alignItems: 'center',
                        }}>
                            <ThemeText content={'Help Center'} fontFamily='MontserratExtraBold' variant='sm' />
                            <ThemeText content={'Share your thoughts or issues with our agent.'} severity='secondary' variant='xs' />
                            <ThemeText content={'24X7'} fontFamily='InterBold' variant='xs' />
                            <ThemeDivider size={8} />
                            <Image source={require('@/assets/images/static/help.png')}
                                style={{
                                    height: 110, width: 300, resizeMode: 'contain',
                                    borderRadius: 24,
                                    tintColor: theme.text.disabled
                                }} />
                        </View>
                    } />
                <ScrollView
                    ref={scrollRef}
                    style={{
                        padding: 16,
                    }}>

                    <View style={{
                        flexDirection: 'row',
                        gap: 8,
                        maxWidth: 460,
                        marginHorizontal: 'auto'
                    }}>
                        <Pressable
                            onPress={() => callNumber('+91 9889161313')}
                            onLongPress={async () => await copyData('+91 9889161313')}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 94,
                                backgroundColor: `${theme.background.slate}`,
                                padding: 16,
                                flex: 1,
                                gap: 8,
                                borderRadius: 24,
                                borderCurve: 'continuous',
                                borderWidth: 1, borderBottomWidth: 3, borderRightWidth: 2,
                                borderColor: `${theme.text.primary}25`
                            }}>
                            <MobileIcon size={38} color={`${theme.text.primary}`} />
                            <ThemeText content={'+91 9889161313'} fontFamily='MontserratSemiBold' variant='xxs' />
                        </Pressable>
                        <Pressable
                            onPress={() => sendEmail('support@agriwings.in')}
                            onLongPress={async () => await copyData('support@agriwings.in')}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 94,
                                backgroundColor: `${theme.background.slate}`,
                                paddingVertical: 16,
                                flex: 1,
                                gap: 8,
                                borderRadius: 24,
                                borderCurve: 'continuous',
                                borderWidth: 1, borderBottomWidth: 3, borderRightWidth: 2,
                                borderColor: `${theme.text.primary}25`
                            }}>
                            <EmailIcon size={38} color={`${theme.text.primary}`} />
                            <ThemeText content={'support@agriwings.in'} fontFamily='MontserratSemiBold' variant='xxs' />
                        </Pressable>
                    </View>

                    <ThemeDivider size={32} />
                    <ThemeText content={"FAQ's"} fontFamily='MontserratBold' variant='xs' />
                    <ThemeDivider size={8} />


                    {loading ? (
                        <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                            <ActivityIndicator color={theme.text.primary} />
                        </View>
                    ) : error ? (
                        <View style={{ paddingVertical: 16, gap: 8, alignItems: 'center' }}>
                            <ThemeText content={'Could not load FAQs. Please try again.'} severity='secondary' variant='xs' />
                            <Pressable onPress={loadFaqs}>
                                <ThemeText content={'Retry'} fontFamily='MontserratSemiBold' variant='xs' />
                            </Pressable>
                        </View>
                    ) : (
                        <View style={{ gap: 1 }}>
                            {faqs.map((faq, index) => (
                                <ModernDetailItem
                                    key={index}
                                    isFirst={index == 0}
                                    isLast={index == faqs?.length - 1}
                                    single={false}
                                    minHeight={24}
                                    iconOnTop
                                    icon={IdeaBulbIcon} iconSize={16}
                                    label={{ content: faq.ques, variant: 'xxs', severity: 'main' }}
                                    onPress={() => openSheet(faq)}
                                    actionIcon={<ArrowRightIcon size={14} />}
                                />
                            ))}
                        </View>
                    )}

                    <CompanyFooter withoutBottomPadding />
                </ScrollView>
            </ScreenView>

            {selectedFaq &&
                <BottomSheet
                    visible={Boolean(selectedFaq)}
                    onClose={closeSheet}
                    children={
                        <>
                            <ScrollView
                                contentContainerStyle={{
                                    padding: 16,
                                }}>

                                {selectedFaq
                                    ? <>
                                        <ThemeText content={selectedFaq.ques} fontFamily='MontserratBold' variant='xs' />
                                        <ThemeDivider size={8} />
                                        <ThemeText content={selectedFaq.ans} severity='secondary' variant='xs' />


                                        <ThemeDivider size={bottom + 12} />
                                        <ActionText
                                            label='Still need assitance? Talk to our agent.'
                                            containerStyle={{ alignSelf: 'flex-start' }}
                                            withIcon={false}
                                            action={() => callNumber('+91 9889161313')}

                                        />
                                    </>
                                    : null}
                            </ScrollView>
                            <ActionText label='Close' action={closeSheet} severity='main' withIcon={false} />
                            <ThemeDivider size={bottom + 12} />
                        </>
                    }
                />}
        </>
    )
}

export default Support