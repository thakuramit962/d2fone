import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ProcessingState {
    working: boolean;

}

const initialState: ProcessingState = { working: false }

export const processingStateSlice = createSlice({
    name: 'processingState',
    initialState,
    reducers: {
        updateProcessingState: (state, action: PayloadAction<boolean>) => {
            state.working = action.payload
        },
    },
})

export const { updateProcessingState } = processingStateSlice.actions

export default processingStateSlice.reducer