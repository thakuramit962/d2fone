import { ArrowDownIcon, CircleCloseIcon, CloseIcon, SearchIcon } from '@/components/icons';
import { useTheme } from '@/hooks/use-theme';
import { capitalizeWords, dimensions, isObject, runHaptics } from '@/utils/app-helper';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import Svg, { Path, SvgProps } from 'react-native-svg';
import ThemeChip from '../../ThemeChip';
import ThemeText from '../../text/ThemeText';
import ThemeInput from '../ThemeInput';
import InputLabel from '../inputLabel';


export type Option = {
    id: string | number;
    label: string;
    value: any;
    [key: string]: any;
};


type AutoSelectProps = {
    options: Option[];
    defaultValues?: any[];
    onSelectionchange: (selectedItems: any[]) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    maxHeight?: number;
    chipDisplay?: boolean;
    searchable?: boolean;
    multiple?: boolean;
    searchPlaceholder?: string;
    loading?: boolean
    helperText?: string
    icon?: React.FC<SvgProps>;
    size?: number
    variant?: 'filled' | 'outlined';
    mainContainerStyle?: ViewStyle

};




const SelectInput: React.FC<AutoSelectProps> = ({
    options,
    defaultValues = [],
    onSelectionchange,
    placeholder = 'search...',
    label,
    error,
    disabled = false,
    required = false,
    maxHeight = dimensions.height * 0.25,
    chipDisplay = true,
    searchable = true,
    multiple = false, // Defaulting to multiple selection
    searchPlaceholder = 'Search...',
    size = 56,
    helperText,
    icon: Icon,
    loading,
    variant = 'filled',
    mainContainerStyle
}) => {


    const theme = useTheme()

    const [color, setColor] = React.useState<string | undefined>(theme?.text.disabled)

    const [open, setOpen] = React.useState(false)

    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleSelection = (option: Option) => {
        if (defaultValues?.find((el) => el.value == option.value)) {
            onSelectionchange(multiple ? defaultValues.filter((item) => item.value !== option.value) : [])
        }
        else {
            if (multiple) {
                onSelectionchange([...defaultValues, option])
            } else {
                onSelectionchange([option])
            }
        }
    }

    const displayValue = capitalizeWords(isObject(defaultValues[0]) ? defaultValues[0]?.label : defaultValues[0] || (placeholder ?? 'Choose'))


    React.useEffect(() => {
        error ? setColor(theme?.error) : setColor(theme?.text.disabled)
    }, [error])


    React.useEffect(() => {
        setSearchQuery('')
    }, [])


    return (
        <View style={[mainContainerStyle]}>

            {label &&
                <InputLabel
                    label={label}
                    editable={!disabled}
                    error={Boolean(error)}
                    required={required}
                />
            }
            <TouchableWithoutFeedback
                onPress={() => {
                    if (!disabled) {
                        runHaptics()
                        setOpen(true)
                    }
                }}>
                <View>
                    <View style={{
                        borderColor: `${color}25`,
                        borderWidth: variant == 'outlined' ? 1 : 0,
                        backgroundColor: disabled ? `${theme?.text.disabled}30` : (variant == 'filled' || error) ? `${color}20` : 'transparent',
                        minHeight: size,
                        maxHeight: dimensions.height * 0.4,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingLeft: 16,
                        paddingRight: 16,
                        borderRadius: 14,
                        gap: 4,
                    }}>
                        {Icon && <Icon color={error ? theme?.error : theme?.text.disabled} height={22} width={22} style={{ marginRight: 6 }} />}
                        {
                            !multiple
                                ? <ThemeText
                                    content={displayValue}
                                    fontFamily='MontserratRegular'
                                    variant='sm'
                                    color={disabled ? theme?.text.disabled : (displayValue == 'Choose' || displayValue == placeholder) ? `${theme?.primary}40` : theme?.text.primary}
                                    severity={disabled ? 'disabled' : 'primary'}
                                    numberOfLines={1}
                                    ellipsizeMode='tail'
                                    style={[{
                                        flex: 1,
                                        fontSize: dimensions.width * 0.04 > 14 ? 14 : dimensions.width * 0.04,
                                        lineHeight: dimensions.width * 0.04 > 14 ? 14 : dimensions.width * 0.04,
                                        color: error ? color : theme?.text.primary,
                                    }]}
                                />
                                : <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    paddingBottom: 4,
                                    gap: 4,
                                    padding: 8,
                                    flex: 1,
                                }}>
                                    {defaultValues?.map((val) => {
                                        const selectedOption = options.find((opt) => opt.value === val.value);
                                        return (
                                            selectedOption && (
                                                <ThemeChip
                                                    key={selectedOption.label}
                                                    label={selectedOption.label}
                                                    variant="sm"
                                                    severity="primary"
                                                    icon={CloseIcon}
                                                    iconColor={theme?.error}
                                                    iconPosition="right"
                                                    textStyle={{ textAlign: 'left' }}
                                                    onPress={() => toggleSelection(selectedOption)}
                                                    numberOfLines={1}
                                                    ellipsizeMode='tail'
                                                />
                                            )
                                        )
                                    })}
                                </View>
                        }
                        {!disabled && <ArrowDownIcon color={theme?.text.secondary} />}
                    </View>

                    {helperText &&
                        <ThemeText
                            numberOfLines={1}
                            ellipsizeMode='tail'
                            content={helperText ? `${helperText}` : ''}
                            color={error ? theme?.error : theme?.text.disabled}
                            style={{ marginHorizontal: 16 }}
                        />}
                </View>

            </TouchableWithoutFeedback>

            {open &&
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={open}
                    onRequestClose={() => setOpen(false)}
                    style={{
                        justifyContent: 'flex-end',
                    }}
                >
                    <View style={{
                        gap: 8,
                        flex: 1,
                        justifyContent: 'flex-end',
                        backgroundColor: theme?.background.main,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        paddingBottom: 8,

                    }}>

                        <View style={{
                            backgroundColor: theme?.background.main,
                            padding: 16,
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            gap: 8,
                            flex: 1,
                        }}>
                            <ThemeText severity='secondary' content={`Choose ${label ?? ''} ____`} fontFamily='MontserratSemiBold' variant='xs' />

                            <ThemeInput
                                placeholder={placeholder}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onFocus={() => setOpen(true)}
                                icon={SearchIcon}
                                clearButtonMode='always'
                                selectTextOnFocus
                                clearTextOnFocus
                                size={42}
                                variant='outlined'
                            />

                            <ScrollView
                                nestedScrollEnabled
                                showsVerticalScrollIndicator
                                keyboardShouldPersistTaps="handled"
                                style={{
                                    paddingHorizontal: 8,
                                    borderRadius: 24,
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: '#83838340',
                                }}
                                contentContainerStyle={{
                                    flexGrow: 1,

                                }}
                            >
                                {loading
                                    ? (
                                        <ActivityIndicator size="large" color={theme?.warning} />
                                    )
                                    : filteredOptions.length > 0
                                        ? (
                                            <>
                                                {filteredOptions.map((option, i) => {
                                                    const isSelected = defaultValues?.some((el) => el.value === option.value);
                                                    return (
                                                        <Pressable
                                                            key={option.id}
                                                            onPress={() => toggleSelection(option)}
                                                            style={({ pressed }) => [
                                                                {
                                                                    minHeight: 38,
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    gap: 8,
                                                                    // justifyContent: 'space-between',
                                                                    backgroundColor: theme?.background.main,
                                                                    padding: 8,
                                                                    paddingLeft: 12,
                                                                    borderColor: '#83838340',
                                                                    borderBottomWidth: 1,
                                                                    marginBottom: 4,

                                                                },
                                                            ]}
                                                        >
                                                            <Svg
                                                                width={20}
                                                                height={20}
                                                                viewBox="0 0 24 24"
                                                                color={isSelected ? theme?.success : `${theme?.text.disabled}30`}
                                                                fill="none"
                                                            >
                                                                <Path
                                                                    d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.5"
                                                                />
                                                                {isSelected && (
                                                                    <Path
                                                                        d="M8 12.75s1.6.913 2.4 2.25c0 0 2.4-5.25 5.6-7"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.5"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                )}
                                                            </Svg>

                                                            <ThemeText
                                                                content={option.label}
                                                                fontFamily={isSelected ? 'MontserratSemiBold' : 'MontserratMedium'}
                                                                color={isSelected ? theme?.text.primary : theme?.text.secondary}
                                                            />


                                                        </Pressable>
                                                    );
                                                })}
                                            </>
                                        )
                                        : (
                                            <NoMatchFound />
                                        )
                                }
                            </ScrollView>

                        </View>

                        <LinearGradient
                            colors={[`${theme.background.main}`, `${theme.text.secondary}10`, `${theme.text.secondary}10`]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                padding: 4,
                                borderRadius: 24,
                                minHeight: defaultValues.length > 0 ? 140 : 'auto',
                                justifyContent: defaultValues.length > 0 ? 'space-between' : 'flex-end',
                                gap: 8,
                                backgroundColor: theme.background.main,
                                marginHorizontal: 8,
                                borderWidth: 1,
                                borderColor: '#83838320'
                            }}>

                            {chipDisplay && defaultValues.length > 0 && (
                                <View>
                                    <ThemeText style={{ paddingLeft: 12, paddingTop: 4 }} variant='xxs' fontFamily='MontserratMedium' content={'Selected Items ___'} />
                                    <ScrollView
                                        nestedScrollEnabled
                                        showsVerticalScrollIndicator
                                        keyboardShouldPersistTaps="handled"
                                        showsHorizontalScrollIndicator
                                        style={{
                                            paddingHorizontal: 8,
                                            maxHeight: dimensions.height * 0.25 < 180 ? 180 : dimensions.height * 0.25,
                                            // backgroundColor: `${theme?.text.primary}15`,
                                            // borderRadius: 24,
                                        }}
                                        contentContainerStyle={{ flexGrow: 1 }}
                                    >
                                        <View style={{
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            paddingBottom: 4,
                                            gap: 4,
                                        }}>
                                            {defaultValues?.map((val) => {
                                                const selectedOption = options.find((opt) => opt.value === val.value);
                                                return (
                                                    selectedOption && (
                                                        <Pressable
                                                            key={selectedOption.label}
                                                            onPress={() => toggleSelection(selectedOption)}

                                                        >
                                                            <LinearGradient colors={[`${theme.text.disabled}10`, `${theme.error}10`]}
                                                                start={{ x: 0, y: 0 }}
                                                                end={{ x: 1, y: 1 }}
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',

                                                                    gap: 4,
                                                                    borderRadius: 6,
                                                                    paddingLeft: 6,
                                                                    paddingVertical: 2,
                                                                }}>

                                                                <ThemeText content={selectedOption?.label} />
                                                                <CircleCloseIcon height={14} width={14} color={theme.error} />
                                                            </LinearGradient>
                                                            {/* <ThemeChip
                                                        key={selectedOption.label}
                                                        label={selectedOption.label}
                                                        variant="xs"
                                                        severity="primary"
                                                        type='default'
                                                        icon={CloseIcon}
                                                        iconColor={theme?.error}
                                                        iconPosition="right"
                                                        textStyle={{ textAlign: 'left' }}
                                                        onPress={() => toggleSelection(selectedOption)}
                                                    /> */}
                                                        </Pressable>
                                                    )
                                                )
                                            })}
                                        </View>
                                    </ScrollView>
                                </View>
                            )}

                            <LinearGradient
                                colors={[`${theme.background.main}`, `${theme.background.main}`]}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    padding: 8,
                                    borderRadius: 20,
                                }}>
                                <Pressable
                                    onPress={() => setOpen(false)}
                                    android_ripple={{
                                        color: `${theme?.info}30`,
                                        borderless: false
                                    }}
                                    style={{
                                        borderRadius: 20,
                                        paddingHorizontal: 24,
                                        paddingVertical: 8,
                                        alignItems: 'center',
                                    }}>
                                    <ThemeText content={'CLOSE'} variant='xs' fontFamily="MontserratMedium" style={{ letterSpacing: 1, }} />
                                </Pressable>

                                <Pressable
                                    onPress={() => setOpen(false)}
                                    style={({ pressed }) => [
                                        styles.ctaButton,
                                    ]}
                                    android_ripple={{ color: '#ffffff30', borderless: false }}
                                    accessibilityRole="button"
                                    accessibilityLabel={'Select'}
                                >
                                    <ThemeText
                                        content={'Done'}
                                        fontFamily="MontserratBold"
                                        size={14}
                                        color="#ffffff"
                                    />
                                </Pressable>

                            </LinearGradient>

                        </LinearGradient>

                    </View>
                </Modal>
            }
        </View>
    )
}

export default SelectInput


const NoMatchFound = () => {
    const theme = useTheme();
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 16,
        }}>
            <Text style={{ color: theme?.text.disabled }}>No match found</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    ctaButton: {
        backgroundColor: '#141414',
        borderRadius: 12,
        width: 80,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
})