import { useTheme } from '@/hooks/use-theme';
import dayjs, { Dayjs } from 'dayjs';
import React, { ReactNode } from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch } from 'react-redux';
import CalenderView from './CalenderView';



export interface DateInputProps {
    onDateSelect: (date: Dayjs) => void
    defaultDate?: Dayjs

    disableFuture?: boolean
    disablePast?: boolean
    minDate?: Dayjs
    maxDate?: Dayjs

    disabled?: boolean;

    content: ReactNode
}


const DateInput: React.FC<DateInputProps> = ({
    onDateSelect,
    defaultDate = dayjs(),

    disableFuture = false,
    disablePast = false,
    minDate,
    maxDate,

    disabled = false,

    content
}) => {


    const theme = useTheme()

    const [open, setOpen] = React.useState(false)

    const dispatch = useDispatch()

    const handleDateSelect = (date: Dayjs) => {
        onDateSelect(date)
        setOpen(false)
        // dispatch(updateTabBarSlice({ visible: false }))
    }

    return (
        <View>
            <TouchableWithoutFeedback
                onPress={() => {
                    !disabled && setOpen(true)
                }}>
                {content}
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
                        flex: 1,
                        gap: 8,
                        justifyContent: 'flex-end',
                        backgroundColor: theme?.background.main,

                    }}>
                        <CalenderView
                            returnAction={handleDateSelect}
                            defaultDate={defaultDate}
                            disableFuture={disableFuture}
                            disablePast={disablePast}
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    </View>
                </Modal>
            }
        </View>
    )
}

export default DateInput