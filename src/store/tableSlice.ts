/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { StoreTableType } from "../types/StoreTableType"
import { ProcessingEnum } from "../enums/ProcessingEnum"
import { PaneOrientationEnum } from "../enums/PaneOrientationEnum"
import { OverflowEnum } from "../enums/OverflowEnum"
import { StoreTableColumnType } from "../types/StoreTableColumnType"
import { StoreTableSettingsType } from "../types/StoreTableSettingsType"
import { ComputedFieldType } from "../types/ComputedFieldType"
import { ComputedFieldTypeEnum } from "../enums/ComputedFieldTypeEnum"
import { BulkActionsType } from "../types/BulkActionsType"
import { FieldVariantEnum } from "../enums/FieldVariantEnum"
import { DensityEnum } from "../enums/DensityEnum"
import { AlignmentEnum } from "../enums/AlignmentEnum"
import { InlineSearchEnum } from "../enums/InlineSearchEnum"
import merge from "lodash.merge"
import log from "loglevel"


export const defaultTableColumn = (
	columnName: string,
	columnLabel?: string,
): StoreTableColumnType => {

	return {
		columnName: columnName,
		columnLabel: columnLabel ?? columnName,
		visible: true,
		visibleTablet: true,
		visibleMobile: true,
		queryable: true,
		orderable: true,
		inlineSearch: false,
		inlineSearchEnum: InlineSearchEnum.SEARCHBOX,
		inlineEditing: false,
		inlineEditingEnum: undefined,
		inlineNumericMin: undefined,
		inlineNumericMax: undefined,
		computedField: undefined,
		alignment: AlignmentEnum.LEFT,
		width: 180,
		prefix: "",
		suffix: "",
		localize: true,
		decimals: 2,
		dateZeros: true,
		timeZeros: true,
		classNames: "",
	}

}

export const defaultTableState: StoreTableType = {

	columns: [],

	table: {
		processing: ProcessingEnum.SERVERSIDE,
		locale: "en-US",
		design: {
			overflow: OverflowEnum.RESPONSIVE,
			density: {
				default: DensityEnum.SPACIOUS,
				userCanChange: true,
			},
		},
		viewLink: true,
		transactions: {
			insert: false,
			update: false,
			delete: false,
		},
		searchSettings: {
			estimatedRowCount: false,
			forceSearch: false,
			forceInline: false,
			forceEnterOnSearch: false,
			highlightMatches: true,
		},
		advancedSearch: {
			searchPanes: {
				enabled: false,
				columns: [],
				orientation: PaneOrientationEnum.HORIZONTAL,
				cascade: false,
			}
		},
		inlineEditing: {
			fieldVariant: FieldVariantEnum.OUTLINED,
			spacing: {
				fieldTop: 8,
				fieldTopUnit: "px",
				fieldBottom: 8,
				fieldBottomUnit: "px",
				fieldLeft: 8,
				fieldLeftUnit: "px",
				fieldRight: 8,
				fieldRightUnit: "px",

			},
		},
		bulkActions: {
			pdf: false,
			csv: false,
			json: false,
			excel: false,
			xml: false,
			sql: false,
			delete: false,
		}
	},

	state: {
		exploring: false,
		fullScreen: false,
	},

}

const initTableSlice = (
	tableState: any
): StoreTableType => {

	log.debug("initTableSlice", defaultTableState, tableState)

	return merge({}, defaultTableState, tableState)

}

export const tableSlice = createSlice({

	name: "tables",

	initialState: {} as {
		[key: string]: StoreTableType
	},

	reducers: {

		initTable: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, tableState, tableAccess, isView, exploring } = action.payload

			if (!state[appId]) {
				state[appId] = initTableSlice(tableState)
				state[appId].state.exploring = exploring

				if (isView || !tableAccess.update) {
					state[appId].table.transactions.update = false
				}
				if (isView || !tableAccess.insert) {
					state[appId].table.transactions.insert = false
				}
				if (isView || !tableAccess.delete) {
					state[appId].table.transactions.delete = false
				}

				if (isView) {
					state[appId].table.design.overflow = OverflowEnum.SCROLL
				}
			}

		},

		rollbackTable: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, tableState } = action.payload

			state[appId] = tableState

		},

		deleteTable: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId } = action.payload

			delete state[appId]

		},

		deleteTableComputeColumn: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, index } = action.payload

			state[appId].columns.splice(index, 1)

		},

		columnVisible: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, index, visible } = action.payload

			if (state[appId].columns[index] !== undefined) {
				state[appId].columns[index].visible = visible
			}
		},

		columnQueryable: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, index, queryable } = action.payload

			if (state[appId].columns[index] !== undefined) {
				state[appId].columns[index].queryable = queryable
			}

		},

		columnOrderable: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, index, orderable } = action.payload

			if (state[appId].columns[index] !== undefined) {
				state[appId].columns[index].orderable = orderable
			}

		},

		columnAlignment: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, index, alignment } = action.payload

			state[appId].columns[index].alignment = alignment

		},

		columnWidth: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, index, width } = action.payload

			if (width >= 60 && width <= 420) {
				state[appId].columns[index].width = width
			}

		},

		tableSettings: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, tableSettings } = action.payload

			state[appId].table = tableSettings
		},


	}

})

export const {
	initTable,
	rollbackTable,
	deleteTable,
	deleteTableComputeColumn,
	columnVisible,
	columnQueryable,
	columnOrderable,
	columnAlignment,
	columnWidth,
	tableSettings,
} = tableSlice.actions

export default tableSlice.reducer

export const selectTableById = (
	state: RootState,
	appId: string
): StoreTableType => {

	return state.tables[appId]

}

export const selectTableColumnsById = (
	state: RootState,
	appId: string
): StoreTableColumnType[] => {

	return state.tables[appId].columns

}

export const selectTableColumnById = (
	state: RootState,
	appId: string,
	index: number
): StoreTableColumnType => {

	return state.tables[appId].columns[index]

}

export const selectTableSettingsById = (
	state: RootState,
	appId: string
): StoreTableSettingsType => {

	return state.tables[appId].table

}

export const selectComputedField = (
	state: RootState,
	appId: string,
	columnIndex: number
): ComputedFieldType => {

	const column: StoreTableColumnType = state.tables[appId].columns[columnIndex]
	if (
		column !== undefined &&
		column.computedField !== undefined
	) {
		return column.computedField
	} else {
		return {
			label: "",
			type: ComputedFieldTypeEnum.TEXT,
			expression: ""
		}
	}

}

export const selectBulkActions = (
	state: RootState,
	appId: string
): BulkActionsType => {

	return state.tables[appId].table.bulkActions

}

export const selectTableExploring = (
	state: RootState,
	appId: string
): boolean => {

	return state.tables[appId].state.exploring

}

export const selectTableFullscreen = (
	state: RootState,
	appId: string
): boolean => {

	return state.tables[appId].state.fullScreen

}
