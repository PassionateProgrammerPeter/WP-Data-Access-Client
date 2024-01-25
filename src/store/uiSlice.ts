/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { Constants } from "../utils/Constants"
import { AnchorEnum } from "../enums/AnchorEnum"
import { UiSettingsData } from "../types/UiSettingsData"
import { DatabaseTreeActionType } from "../types/DatabaseTreeActionType"
import log from "loglevel"

export const uiSlice = createSlice({

	name: "ui",

	initialState: {

		tableSettings: {
			isOpen: false,
			appId: null
		},

		formSettings: {
			isOpen: false,
			appId: null
		},

		drawer: {
			anchor: AnchorEnum.RIGHT,
			width: Constants.drawerMinWidth
		},

		action: undefined,

	} as UiSettingsData,

	reducers: {

		openTableSettings: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId } = action.payload

			state.tableSettings.isOpen = true
			state.tableSettings.appId = appId

		},

		closeTableSettings: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			state.tableSettings.isOpen = false

		},

		openFormSettings: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId } = action.payload

			state.formSettings.isOpen = true
			state.formSettings.appId = appId

		},

		closeFormSettings: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			state.formSettings.isOpen = false

		},

		setDrawerAnchor: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { anchor } = action.payload

			state.drawer.anchor = anchor

		},

		setDrawerWidth: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { width } = action.payload

			if (width >= Constants.drawerMinWidth && width <= Constants.drawerMaxWidth) {
				state.drawer.width = width
			}

		},

		doAction: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs, tbl, typ, doaction } = action.payload
			log.debug(dbs, tbl, typ, doaction)

			state.action = {
				dbs: dbs,
				tbl: tbl,
				typ: typ,
				action: doaction,
			}

		},

		stopAction: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			state.action = undefined

		},

	}

})

export const {
	openTableSettings,
	closeTableSettings,
	openFormSettings,
	closeFormSettings,
	setDrawerAnchor,
	setDrawerWidth,
	doAction,
	stopAction
} = uiSlice.actions

export default uiSlice.reducer

export const selectTableSettingsOpen = (
	state: RootState,
	appId: string
) => {

	return state.ui.tableSettings.isOpen && state.ui.tableSettings.appId === appId

}

export const selectFormSettingsOpen = (
	state: RootState,
	appId: string
) => {

	return state.ui.formSettings.isOpen && state.ui.formSettings.appId === appId

}

export const selectDrawerAnchor = (
	state: RootState
) => {

	return state.ui.drawer.anchor

}

export const selectDrawerWidth = (
	state: RootState
) => {

	return state.ui.drawer.width

}

export const selectAction = (
	state: RootState
): DatabaseTreeActionType | undefined => {

	return state.ui.action

}