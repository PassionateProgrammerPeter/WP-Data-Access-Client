/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from "../store/store"
import { selectTableById } from "../store/tableSlice"
import { selectFormById } from "../store/formSlice"
import { RestApi } from "./RestApi"
import { Config } from "../utils/Config"
import { ScopeEnum } from "../enums/ScopeEnum"
import { TargetEnum } from "../enums/TargetEnum"
import log from "loglevel"

export const selectRow = (
	dbs: string,
	tbl: string,
	primaryKey: object,
	media: object,
	callback: any
): void => {

	log.debug(
		dbs,
		tbl,
		primaryKey,
		media
	)

	RestApi(
		Config.appUrlGet,
		{
			dbs: dbs,
			tbl: tbl,
			key: primaryKey,
			media: media
		},
		function (response: any) {
			log.debug(response)

			if (
				response?.data?.length === 1
			) {
				callback(response)
				return
			}

			callback(null)
		}
	)

}

export const insertRow = (
	dbs: string,
	tbl: string,
	data: object,
	callback: any
): void => {

	log.debug(
		dbs,
		tbl,
		data
	)


	RestApi(
		Config.appUrlInsert,
		{
			dbs: dbs,
			tbl: tbl,
			val: data
		},
		function (response: any) {
			log.debug(response)

			if (
				response?.data
			) {
				callback(response)
				return
			}

			callback(null)
		}
	)

}

export const updateRow = (
	dbs: string,
	tbl: string,
	primaryKey: object,
	data: object,
	callback: any
): void => {

	log.debug(
		dbs,
		tbl,
		primaryKey,
		data
	)

	RestApi(
		Config.appUrlUpdate,
		{
			dbs: dbs,
			tbl: tbl,
			key: primaryKey,
			val: data
		},
		function (response: any) {
			log.debug(response)

			if (
				response?.data
			) {
				callback(response)
				return
			}

			callback(null)
		}
	)

}

export const deleteRow = (
	dbs: string,
	tbl: string,
	primaryKey: object,
	callback: any
): void => {

	log.debug(
		dbs,
		tbl,
		primaryKey
	)

	RestApi(
		Config.appUrlDelete,
		{
			dbs: dbs,
			tbl: tbl,
			key: primaryKey
		},
		function (response: any) {
			log.debug(response)

			if (
				response?.data
			) {
				callback(response)
				return
			}

			callback(null)
		}
	)

}

export const saveExplorerSettings = (
	dbs: string,
	tbl: string,
	settings: any,
	callback: any
): void => {

	log.debug(
		dbs,
		tbl,
		settings
	)

	RestApi(
		Config.appUrlSettings,
		{
			action: "explorer_settings",
			dbs: dbs,
			tbl: tbl,
			settings: settings,
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function (response: any) {
			log.debug(response)

			callback(response)
		}
	)

}

export const saveSettings = (
	scope: ScopeEnum,
	target: TargetEnum,
	dbs: string,
	tbl: string,
	settings: any,
	callback: any
): void => {

	log.debug(
		scope,
		target,
		dbs,
		tbl,
		settings
	)

	RestApi(
		Config.appUrlSettings,
		{
			action: "admin_settings",
			dbs: dbs,
			tbl: tbl,
			settings: {
				scope: scope,
				target: target,
				data: settings
			}
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function (response: any) {
			log.debug(response)

			callback(response)
		}
	)

}

export const saveTableSettings = (
	id: string,
	scope: ScopeEnum,
	dbs: string,
	tbl: string,
	callback: any,
) => {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { state, ...settings } = selectTableById(Store.getState(), id)

	saveSettings(
		scope,
		TargetEnum.TABLE,
		dbs,
		tbl,
		settings,
		callback,
	)

}

export const saveFormSettings = (
	id: string,
	scope: ScopeEnum,
	dbs: string,
	tbl: string,
	callback: any,
) => {

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { data, ...settings } = selectFormById(Store.getState(), id)

	saveSettings(
		scope,
		TargetEnum.FORM,
		dbs,
		tbl,
		settings,
		callback,
	)

}


export const lov = (
	dbs: string,
	tbl: string,
	col: string,
	callback: any
) => {

	RestApi(
		Config.appUrlLov,
		{
			action: "table_lov",
			dbs: dbs,
			tbl: tbl,
			col: col
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function (response: any) {
			log.debug(response)

			callback(response)
		}
	)

}

export const actionRename = (
	dbs: string,
	fromTbl: string,
	toTbl: string,
	callback: any
): void => {

	log.debug(
		dbs,
		fromTbl,
		toTbl
	)

	RestApi(
		Config.appUrlActionRename,
		{
			dbs: dbs,
			from_tbl: fromTbl,
			to_tbl: toTbl
		},
		function (response: any) {
			log.debug(response)

			if (
				response
			) {
				callback(response)
				return
			}

			callback(null)
		}
	)

}

export const actionCopy = (
	fromDbs: string,
	toDbs: string,
	fromTbl: string,
	toTbl: string,
	copyData: boolean,
	callback: any
): void => {

	log.debug(
		fromDbs,
		toDbs,
		fromTbl,
		toTbl,
		copyData
	)

	RestApi(
		Config.appUrlActionCopy,
		{
			from_dbs: fromDbs,
			to_dbs: toDbs,
			from_tbl: fromTbl,
			to_tbl: toTbl,
			copy_data: copyData
		},
		function (response: any) {
			log.debug(response)

			if (
				response
			) {
				callback(response)
				return
			}

			callback(null)
		}
	)

}

export const actionTruncate = (
	dbs: string,
	tbl: string,
	callback: any
): void => {

	log.debug(
		dbs,
		tbl
	)

	RestApi(
		Config.appUrlActionTruncate,
		{
			dbs: dbs,
			tbl: tbl
		},
		function (response: any) {
			log.debug(response)

			if (
				response
			) {
				callback(response)
				return
			}

			callback(null)
		}
	)

}

export const actionDrop = (
	dbs: string,
	tbl: string,
	callback: any
): void => {

	log.debug(
		dbs,
		tbl
	)

	RestApi(
		Config.appUrlActionDrop,
		{
			dbs: dbs,
			tbl: tbl
		},
		function (response: any) {
			log.debug(response)

			if (
				response
			) {
				callback(response)
				return
			}

			callback(null)
		}
	)

}