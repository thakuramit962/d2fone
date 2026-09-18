import ThemeText from '@/components/basic/text/ThemeText';
import ThemeChip from '@/components/basic/ThemeChip';
import { CheckmarkCircleIcon } from '@/components/icons';
import useLanguage from '@/hooks/useLanguage';
import { updateAppState } from '@/slices/appSlice';
import { RootState } from '@/store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const ILLUSTRATION_SIZE = Math.min(SCREEN_WIDTH - 48, 380);

const logo = require('../../assets/images/transparent-black-logo.png')
const illustration = require('../../assets/images/d2f-illustration.png')

function Landing() {
    const dispatch = useDispatch()
    const { top, bottom } = useSafeAreaInsets()
    const { t } = useTranslation()
    const { changeLanguage, languageOptions } = useLanguage();
    const appLanguage = useSelector(
        (state: RootState) => state?.appSlice?.language,
    );
    const illustrationStyle = useMemo(
        () => ({
            height: Math.min(SCREEN_HEIGHT * 0.375, 380),
            width: ILLUSTRATION_SIZE,
            resizeMode: 'contain' as const,
            marginTop: 32,
            marginBottom: 16,
        }),
        [],
    );

    return (
        <>
            <LinearGradient
                colors={['#ffffff', '#CFE159']}
                style={[styles.gradient, {
                    paddingTop: top + 8,
                    paddingBottom: bottom + 16,
                }]}
            >
                <View style={styles.heroSection}>
                    <Image
                        source={logo}
                        style={styles.logo}
                    />

                    <ThemeText
                        content="______ Together we grow better tomorrow ______"
                        variant="xxs"
                        fontFamily="MontserratSemiBold"
                        color="#141414"
                        style={{
                            textAlign: 'center',
                        }}
                    />

                    <Image
                        source={illustration}
                        style={illustrationStyle}
                    />
                </View>

                <View style={styles.ctaSection}>

                    <ScrollView>
                        <View style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            paddingHorizontal: 32,
                            paddingBottom: 24,
                        }}>
                            {languageOptions.map((lang) =>
                                <ThemeChip
                                    key={lang.value}
                                    label={lang.label}
                                    type={appLanguage == lang.value ? 'solid' : 'default'}
                                    variant={'xs'}
                                    containerStyle={{
                                        backgroundColor: appLanguage == lang.value ? '#2f3a02' : '#a3aa8765',
                                        height: 32,
                                        paddingLeft: 16,
                                        paddingRight: appLanguage == lang.value ? 8 : 16,
                                    }}
                                    icon={appLanguage == lang.value ? CheckmarkCircleIcon : undefined}
                                    iconPosition='right'
                                    iconColor='#fbffea'
                                    textStyle={{
                                        color: appLanguage == lang.value ? '#fbffea' : '#2f3a02',

                                    }}
                                    onPress={() => changeLanguage(lang)}

                                />
                            )}
                        </View>
                    </ScrollView>

                    <Pressable
                        onPress={() => {
                            dispatch(updateAppState({ hasOnboarded: true }));
                            router.replace('/login')
                        }}
                        // onPress={() => setShowPermissionDrawer(true)}
                        style={styles.ctaButton}
                        android_ripple={{ color: '#ffffff30', borderless: false }}
                        accessibilityRole="button"
                        accessibilityLabel="Get Started"
                    >
                        <ThemeText
                            content={t('getStarted')}
                            fontFamily="MontserratBold"
                            size={18}
                            color="#ffffff"
                        />
                    </Pressable>
                </View>
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        paddingTop: 16,
        paddingBottom: 24,
    },
    heroSection: {
        paddingTop: 72,
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    logo: {
        height: 72,
        width: 300,
        resizeMode: 'contain',
        // marginBottom: 16,
    },
    ctaSection: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    ctaButton: {
        backgroundColor: '#141414',
        borderRadius: 16,
        width: '100%',
        maxWidth: 300,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default memo(Landing);