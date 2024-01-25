/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { StoreFormType } from "../types/StoreFormType"
import { StoreFormColumnType } from "../types/StoreFormColumnType"
import { StoreFormSpacingType } from "../types/StoreFormSpacingType"
import { StoreFormDetailsType } from "../types/StoreFormDetailsType"
import { ColumnPositioningEnum } from "../enums/ColumnPositioningEnum"
import { FieldVariantEnum } from "../enums/FieldVariantEnum"
import { ColumnValidationType } from "../types/ColumnValidationType"
import { ComputedFieldType } from "../types/ComputedFieldType"
import { ComputedFieldTypeEnum } from "../enums/ComputedFieldTypeEnum"
import { AlignmentEnum } from "../enums/AlignmentEnum"
import merge from "lodash.merge"
import log from "loglevel"


export const defaultFormColumn = (
	columnName: string,
	columnLabel?: string,
): StoreFormColumnType => {

	return {
		columnName: columnName,
		columnLabel: columnLabel ?? columnName,
		visible: true,
		updatable: true,
		updatableEnum: undefined,
		cells: 1,
		cellClass: ColumnPositioningEnum.AUTO,
		numericMin: undefined,
		numericMax: undefined,
		computedField: undefined,
		alignment: AlignmentEnum.LEFT,
		prefix: "",
		suffix: "",
		classNames: "",
	}
}

export const defaultSpacing: StoreFormSpacingType = {
	aroundGridTop: 50,
	aroundGridTopUnit: "px",
	aroundGridBottom: 50,
	aroundGridBottomUnit: "px",
	aroundGridLeft: 50,
	aroundGridLeftUnit: "px",
	aroundGridRight: 50,
	aroundGridRightUnit: "px",
	betweenCells: 30,
	betweenCellsUnit: "px",
	cellTop: 0,
	cellTopUnit: "px",
	cellBottom: 0,
	cellBottomUnit: "px",
	cellLeft: 0,
	cellLeftUnit: "px",
	cellRight: 0,
	cellRightUnit: "px",
	fieldTop: 16.5,
	fieldTopUnit: "px",
	fieldBottom: 16.5,
	fieldBottomUnit: "px",
	fieldLeft: 14,
	fieldLeftUnit: "px",
	fieldRight: 14,
	fieldRightUnit: "px",
}

export const defaultForm: StoreFormDetailsType = {
	showGrid: false,
	cellsPerRow: 1,
	spacing: defaultSpacing,
	fieldVariant: FieldVariantEnum.OUTLINED,
}

export const defaultFormState: StoreFormType = {

	data: [],

	validation: {},

	context: [],

	columns: [],

	form: defaultForm,

}

const initFormSlice = (
	formState: any
): StoreFormType => {

	log.debug("initFormSlice", defaultFormState, formState)

	return merge({}, defaultFormState, formState)

}

export const formSlice = createSlice({

	name: "forms",

	initialState: {} as {
		[key: string]: StoreFormType
	},

	reducers: {

		initForm: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, formState } = action.payload
			log.debug(appId, formState)

			state[appId] = initFormSlice(formState)

		},

		rollbackForm: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, formState } = action.payload
			log.debug(appId, formState)

			state[appId] = formState

		},

		deleteForm: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId } = action.payload

			delete state[appId]

		},

		initData: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, data, context } = action.payload

			if (
				state[appId]
			) {
				log.debug(data)
				state[appId].data = data

				log.debug(context)
				state[appId].context = context

				const columnValidation: ColumnValidationType = {}
				for (const columnName in data) {
					columnValidation[columnName] = {
						error: false,
						text: ""
					}
				}
				log.debug(columnValidation)
				state[appId].validation = columnValidation
			}

		},

		update: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, columnName, columnValue } = action.payload

			state[appId].data[columnName] = columnValue

		},

		updateMediaColumn: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, columnName, columnValue } = action.payload
			log.debug(appId, columnName, columnValue)

			if ((state[appId].context as any).media) {
				(state[appId].context as any).media[columnName] = columnValue
			}

		},

		validate: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, columnName, columnError, columnText } = action.payload

			state[appId].validation[columnName].error = columnError
			state[appId].validation[columnName].text = columnText

		},

		columnAlignment: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, index, alignment } = action.payload

			state[appId].columns[index].alignment = alignment

		},

		deleteFormComputeColumn: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, index } = action.payload

			state[appId].columns.splice(index, 1)

		},

		columnVisible: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, index, visible } = action.payload
			log.debug(appId, index, visible)

			state[appId].columns[index].visible = visible

		},

		columnUpdateble: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { appId, index, updatable } = action.payload
			log.debug(appId, index, updatable)

			state[appId].columns[index].updatable = updatable

		},


	}

})

export const {
	initForm,
	rollbackForm,
	deleteForm,
	initData,
	update,
	updateMediaColumn,
	validate,
	columnAlignment,
	deleteFormComputeColumn,
	columnVisible,
	columnUpdateble,
} = formSlice.actions

export default formSlice.reducer

export const selectFormById = (
	state: RootState,
	appId: string
): StoreFormType => {

	return state.forms[appId]
}

export const selectFormDataById = (
	state: RootState,
	appId: string
): any => {

	return state.forms[appId].data
}

export const selectFormValidationById = (
	state: RootState,
	appId: string
): ColumnValidationType => {

	return state.forms[appId].validation
}

export const selectFormContextById = (
	state: RootState,
	appId: string
): any => {

	return state.forms[appId].context

}

export const selectFormColumnsById = (
	state: RootState,
	appId: string
): StoreFormColumnType[] => {

	return state.forms[appId].columns

}

export const selectFormColumnById = (
	state: RootState,
	appId: string,
	columnIndex: number
): StoreFormColumnType => {

	return state.forms[appId].columns[columnIndex]

}


export const selectFormColumnByName = (
	state: RootState,
	appId: string,
	columnName: string
): StoreFormColumnType | undefined => {

	log.debug(state, appId, columnName)

	for (let i = 0; i < state.forms[appId].columns.length; i++) {
		if (state.forms[appId].columns[i].columnName === columnName) {
			return state.forms[appId].columns[i]
		}
	}

	return undefined

}

export const selectFormSettingsById = (
	state: RootState,
	appId: string
): StoreFormDetailsType => {

	log.debug(state, appId)


	return defaultForm

}

export const selectComputedField = (
	state: RootState,
	appId: string,
	columnIndex: number
): ComputedFieldType => {

	const column: StoreFormColumnType = state.forms[appId].columns[columnIndex]
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