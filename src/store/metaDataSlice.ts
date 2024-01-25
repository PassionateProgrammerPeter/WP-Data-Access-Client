/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
import log from "loglevel"

export const metaDataSlice = createSlice({

	name: "metaData",

	initialState: {} as {
		[key: string]: any,
	},

	reducers: {

		addMetaData: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, metaData } = action.payload

			state[appId] = metaData
			
		},

		deleteMetaData: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId } = action.payload

			delete state[appId]
			
		},

	},

})

export const {
	addMetaData,
	deleteMetaData
} = metaDataSlice.actions

export default metaDataSlice.reducer

export const selectMetaDataById = (
	state: RootState,
	appId: string,
): any => {

	return state.metaData[appId]

}

export const selectColumnByIndex = (
	state: RootState,
	appId: string,
	columnIndex: number,
): number | undefined => {

	return state.metaData[appId]?.metaData?.columns[columnIndex]

}

export const selectColumnByName = (
	state: RootState,
	appId: string,
	columnName: string,
): number | undefined => {

	if (!state.metaData[appId]?.metaData?.columns) {
		return undefined
	}

	for (let i = 0; i < state.metaData[appId]?.metaData?.columns.length; i++) {
		if (state.metaData[appId]?.metaData?.columns[i].column_name === columnName) {
			return state.metaData[appId]?.metaData?.columns[i]
		}
	}

	return undefined

}

export const selectColumnIndex = (
	state: RootState,
	appId: string,
	columnName: string,
): number | undefined => {

	if (
		!state.metaData[appId] ||
		!state.metaData[appId]?.metaData?.columns
	) {
		return undefined
	}

	for (let i = 0; i < state.metaData[appId]?.metaData?.columns.length; i++) {
		if (state.metaData[appId]?.metaData?.columns[i].column_name === columnName) {
			return i
		}
	}

	return undefined

}