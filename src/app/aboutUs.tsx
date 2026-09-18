import CompanyFooter from '@/components/basic/companyFooter'
import ScreenView from '@/components/basic/containers/screenView'
import ModernDetailItem from '@/components/basic/modernDetailItem'
import ThemeText from '@/components/basic/text/ThemeText'
import ThemeDivider from '@/components/basic/ThemeDivider'
import { InfoIcon, VerifyIcon } from '@/components/icons'
import Header from '@/components/layout/navigation/Header'
import { useTheme } from '@/hooks/use-theme'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { router } from 'expo-router'
import { Image, ScrollView, View } from 'react-native'
const logo = require('@/assets/images/transparent-black-logo.png')


const AboutUs = () => {

    const theme = useTheme()

    const scrollRef = useScrollToTop()

    return (
        <ScreenView >
            <Header withoutTopPadding backIcon />
            <ScrollView ref={scrollRef}>
                <View style={{
                    padding: 16
                }}>
                    <Image source={logo}
                        style={{
                            height: 72, width: 300, resizeMode: 'contain',
                            marginBottom: 32, marginHorizontal: 'auto'
                        }}
                    />

                    <ThemeText
                        selectable
                        variant="xs"
                        content={`D2F Services is a leading Precision Agriculture Service Provider, bridging the gap between farmers and advanced precision technologies. We connect farmers with the right technology, products, expertise, and on-ground services to improve productivity, efficiency, sustainability, and profitability.`}
                    />
                    <ThemeText
                        selectable
                        variant="xs"
                        content={`We believe technology creates real value only when it reaches the field and delivers measurable outcomes. Our strength lies in last-mile execution—converting innovative agricultural technologies into practical, accessible, and scalable solutions for farmers across India.`}
                    />
                    <ThemeText
                        selectable
                        variant="xs"
                        content={`From precision drone spraying and farm intelligence to emerging AgriTech solutions, D2F Services works with technology companies, manufacturers, FPOs, rural entrepreneurs, and farmers to create an integrated precision agriculture ecosystem.`}
                    />

                    <ThemeDivider size={16} />
                    <ThemeText
                        selectable
                        fontFamily="MontserratSemiBold"
                        variant="xs"
                        content="Our Industry Position"
                    />
                    <ThemeText
                        selectable
                        variant="xs"
                        content="We aspire to be the best-in-industry Precision Agriculture Service Provider, setting new benchmarks in service quality, technology adoption, operational excellence, farmer experience, and measurable on-field outcomes."
                    />
                    <ThemeText
                        selectable
                        variant="xs"
                        content="We don't just deliver technology. We make technology work for farmers."
                    />
                    <ThemeText
                        selectable
                        variant="xs"
                        content="Our focus is to empower our “bread growers” — the farmers who feed the nation—with reliable, affordable, and outcome-driven precision solutions, helping them farm smarter, better, and more sustainably."
                    />

                    <ThemeDivider size={16} />
                    <ThemeText
                        selectable
                        fontFamily="MontserratSemiBold"
                        variant="xs"
                        content="What We Stand For"
                    />
                    <ThemeText
                        selectable
                        variant="xs"
                        content="From Technology to the Field. From Productivity to Prosperity."
                    />

                    <ThemeDivider size={16} />
                    <ThemeText
                        selectable
                        fontFamily="MontserratSemiBold"
                        variant="xs"
                        content="Our Vision"
                    />
                    <ThemeText
                        selectable
                        variant="xs"
                        content="By leveraging our expertise and partnerships, we are dedicated to creating value for all stakeholders, from farmers to consumers. Through our commitment to farming efficiency, affordability, and environmental stewardship, we aim to enhance crop yields, reduce environmental impact, and improve livelihoods, one flight at a time."
                    />

                    <ThemeDivider size={16} />
                    <ThemeText
                        selectable
                        fontFamily="MontserratSemiBold"
                        variant="xs"
                        content="Our Mission"
                    />
                    <ThemeText
                        selectable
                        variant="xs"
                        content="To lead the Agriculture Industry into a sustainable future by providing farmers with safe, efficient and affordable technological solutions. We aim to revolutionize the way food is produced, ensuring that our entire value chain – from farmers to our customers – benefit from the latest advancements in Agritech."
                    />

                    <ThemeDivider size={32} />
                    <ModernDetailItem bg={theme.background.slate} isFirst icon={InfoIcon} description={{ content: 'Contact Us', variant: 'xs' }} onPress={() => router.navigate('/support')} />
                    <ThemeDivider size={2} />
                    <ModernDetailItem bg={theme.background.slate} isLast icon={VerifyIcon} description={{ content: 'Privacy Policies', variant: 'xs' }} onPress={() => router.navigate('/policies')} />

                </View>


                <CompanyFooter withoutBottomPadding />
            </ScrollView>
        </ScreenView>
    )
}

export default AboutUs