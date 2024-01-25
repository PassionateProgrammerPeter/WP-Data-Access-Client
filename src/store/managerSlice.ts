/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
import log from "loglevel"
import merge from "lodash.merge"
import { ManagerSettingsType } from "../types/ManagerSettingsType"

export const defaultActionSettings: ManagerSettingsType = {
	table_settings: {
		row_count_estimate: null,
		row_count_estimate_value: "plugin",
		row_count_estimate_value_hard: "",
		row_level_security: "false",
		query_buffer_size: "",
		hyperlink_definition: "json",
	},
	list_labels: {},
	form_labels: {},
	column_media: {},
	rest_api: null,
}

export const managerSlice = createSlice({

	name: "manager",

	initialState: {
		settings: {} as ManagerSettingsType,
		metaData: {},
	},

	reducers: {

		initManager: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { settings, metaData } = action.payload
			log.debug(settings, metaData)

			state.settings = merge({}, defaultActionSettings, settings)
			state.metaData = metaData

		},

		updateSettings: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { settings } = action.payload
			log.debug(settings)

			state.settings = settings

		},

		restApiOff: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			state.settings.rest_api = null

		},

		restApiOn: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			state.settings.rest_api = {
				select: {
					authorization: "authorized",
					methods: [],
					authorized_roles: [],
					authorized_users: [],
				},
				insert: {
					authorization: "authorized",
					methods: [],
					authorized_roles: [],
					authorized_users: [],
				},
				update: {
					authorization: "authorized",
					methods: [],
					authorized_roles: [],
					authorized_users: [],
				},
				delete: {
					authorization: "authorized",
					methods: [],
					authorized_roles: [],
					authorized_users: [],
				}
			}

		},

		deleteManager: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			state.settings = {} as ManagerSettingsType
			state.metaData = {}
		}

	}

})

export const {
	initManager,
	updateSettings,
	restApiOff,
	restApiOn,
	deleteManager
} = managerSlice.actions

export default managerSlice.reducer

export const selectManagerSettings = (
	state: RootState
): ManagerSettingsType => {

	return state.manager.settings

}

export const selectManagerMetaData = (
	state: RootState
): any => {

	return state.manager.metaData

}