import { ThemeToastProps } from '@/components/basic/ThemeToast'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const initialState: ThemeToastProps = {
    key: '',
    title: '',
    message: '',
    severity: "info",
}

export const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        updateToast: (state, action: PayloadAction<ThemeToastProps>) => {
            state.key = action.payload?.key
            state.title = action.payload?.title
            state.message = action.payload?.message
            state.severity = action.payload?.severity
        },
    },
})

export const { updateToast } = toastSlice.actions

export default toastSlice.reducer