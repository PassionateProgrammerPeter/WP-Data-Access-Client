/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { ExplorerTreeType } from "../types/ExplorerTreeType"
import { DatabaseTreeObjectType } from "../types/DatabaseTreeObjectType"
import { DatabaseTypeEnum } from "../enums/DatabaseTypeEnum"
import { DatabaseType } from "../types/DatabaseType"
import log from "loglevel"

export const explorerSlice = createSlice({

	name: "explorer",

	initialState: {} as ExplorerTreeType,

	reducers: {

		initExplorer: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs, dbsTypes } = action.payload
			log.debug(dbs)

			state.database = {}
			for (let i = 0; i < dbs.length; i++) {
				state.database[dbs[i]] = {
					tables: [],
					tablesLoaded: false,
					views: [],
					viewsLoaded: false,
					columns: {},
					columnsLoaded: {},
					indexes: {},
					indexesLoaded: {},
					triggers: {},
					triggersLoaded: {},
					foreignKeys: {},
					foreignKeysLoaded: {},
					functions: [],
					functionsLoaded: false,
					procedures: [],
					proceduresLoaded: false
				}
			}
			state.dbsTypes = dbsTypes
			state.selected = {}
			state.error = ""

		},

		addTables: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs, tbl } = action.payload
			log.debug(dbs, tbl)

			state.database[dbs].tables = tbl
			state.database[dbs].tablesLoaded = true

		},

		invalidateTables: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs } = action.payload
			log.debug(dbs)

			state.database[dbs].tables = []
			state.database[dbs].tablesLoaded = false

			// Invalidate columns, indexes, triggers and foreign keys
			state.database[dbs].columns = {}
			state.database[dbs].columnsLoaded = {}
			state.database[dbs].indexes = {}
			state.database[dbs].indexesLoaded = {}
			state.database[dbs].triggers = {}
			state.database[dbs].triggersLoaded = {}
			state.database[dbs].foreignKeys = {}
			state.database[dbs].foreignKeysLoaded = {}

		},

		addViews: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs, vws } = action.payload
			log.debug(dbs, vws)

			state.database[dbs].views = vws
			state.database[dbs].viewsLoaded = true

			// Invalidate columns
			state.database[dbs].columns = {}
			state.database[dbs].columnsLoaded = {}

		},

		invalidateViews: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs } = action.payload
			log.debug(dbs)

			state.database[dbs].views = []
			state.database[dbs].viewsLoaded = false

		},

		addColumns: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs, tbl, cls } = action.payload
			log.debug(dbs, tbl, cls)

			state.database[dbs].columns[tbl] = cls
			state.database[dbs].columnsLoaded[tbl] = true

		},

		addIndexes: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs, tbl, idx } = action.payload
			log.debug(dbs, tbl, idx)

			state.database[dbs].indexes[tbl] = idx
			state.database[dbs].indexesLoaded[tbl] = true

		},

		addForeignKeys: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs, tbl, frk } = action.payload
			log.debug(dbs, tbl, frk)

			state.database[dbs].foreignKeys[tbl] = frk
			state.database[dbs].foreignKeysLoaded[tbl] = true

		},

		addTriggers: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs, tbl, trg } = action.payload
			log.debug(dbs, tbl, trg)

			state.database[dbs].triggers[tbl] = trg
			state.database[dbs].triggersLoaded[tbl] = true

		},

		addFunctions: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs, fnc } = action.payload
			log.debug(dbs, fnc)

			state.database[dbs].functions = fnc
			state.database[dbs].functionsLoaded = true

		},

		invalidateFunctions: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs } = action.payload
			log.debug(dbs)

			state.database[dbs].functions = []
			state.database[dbs].functionsLoaded = false

		},

		addProcedures: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs, prc } = action.payload
			log.debug(dbs, prc)

			state.database[dbs].procedures = prc
			state.database[dbs].proceduresLoaded = true

		},

		invalidateProcedures: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs } = action.payload
			log.debug(dbs)

			state.database[dbs].procedures = []
			state.database[dbs].proceduresLoaded = false

		},

		setError: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { error } = action.payload
			log.debug(error)

			state.error = error

		},

		setDbsTypes: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbsType } = action.payload
			log.debug(dbsType)

			state.dbsTypes = dbsType

		},

		addDbsType: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbsType } = action.payload
			log.debug(dbsType)

			state.dbsTypes.push(dbsType)

		},

		deleteDbsType: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbsType } = action.payload
			log.debug(dbsType)

			const index: number = state.dbsTypes.indexOf(dbsType)
			if (index !== -1) {
				state.dbsTypes.splice(index, 1)
			}

		},

		setSelected: (state, action: PayloadAction<any>) => {

			log.debug(state, action)

			const { dbs } = action.payload
			log.debug(dbs)

			state.selected = dbs

		},

	}

})

export const {
	initExplorer,
	addTables,
	invalidateTables,
	addViews,
	invalidateViews,
	addColumns,
	addIndexes,
	addForeignKeys,
	addTriggers,
	addFunctions,
	invalidateFunctions,
	addProcedures,
	invalidateProcedures,
	setError,
	setDbsTypes,
	addDbsType,
	deleteDbsType,
	setSelected,
} = explorerSlice.actions

export default explorerSlice.reducer

export const selectDatabases = (
	state: RootState
): DatabaseTreeObjectType => {

	return state.explorer.database

}

export const selectTables = (
	state: RootState,
	dbs: string
): string[] => {

	return state.explorer.database[dbs].tables

}

export const selectTablesLoaded = (
	state: RootState,
	dbs: string
): boolean => {

	return state.explorer.database[dbs].tablesLoaded

}

export const selectViews = (
	state: RootState,
	dbs: string
): string[] => {

	return state.explorer.database[dbs].views

}

export const selectViewsLoaded = (
	state: RootState,
	dbs: string
): boolean => {

	return state.explorer.database[dbs].viewsLoaded

}

export const selectColumns = (
	state: RootState,
	dbs: string,
	tbl: string
): any => {

	return state.explorer.database[dbs]?.columns[tbl] ?? []

}

export const selectColumnsLoaded = (
	state: RootState,
	dbs: string,
	tbl: string
): boolean => {

	return state.explorer.database[dbs]?.columnsLoaded[tbl] ?? false

}

export const selectIndexes = (
	state: RootState,
	dbs: string,
	tbl: string
): any => {

	return state.explorer.database[dbs]?.indexes[tbl] ?? []

}

export const selectIndexesLoaded = (
	state: RootState,
	dbs: string,
	tbl: string
): boolean => {

	return state.explorer.database[dbs]?.indexesLoaded[tbl] ?? false

}

export const selectForeignKeys = (
	state: RootState,
	dbs: string,
	tbl: string
): any => {

	return state.explorer.database[dbs]?.foreignKeys[tbl] ?? []

}

export const selectForeignKeysLoaded = (
	state: RootState,
	dbs: string,
	tbl: string
): boolean => {

	return state.explorer.database[dbs]?.foreignKeysLoaded[tbl] ?? false

}

export const selectTriggers = (
	state: RootState,
	dbs: string,
	tbl: string
): any => {

	return state.explorer.database[dbs]?.triggers[tbl] ?? []

}

export const selectTriggersLoaded = (
	state: RootState,
	dbs: string,
	tbl: string
): boolean => {

	return state.explorer.database[dbs]?.triggersLoaded[tbl] ?? false

}

export const selectFunctions = (
	state: RootState,
	dbs: string
): string[] => {

	return state.explorer.database[dbs]?.functions

}

export const selectFunctionsLoaded = (
	state: RootState,
	dbs: string
): boolean => {

	return state.explorer.database[dbs]?.functionsLoaded

}


export const selectProcedures = (
	state: RootState,
	dbs: string
): string[] => {

	return state.explorer.database[dbs]?.procedures

}

export const selectProceduresLoaded = (
	state: RootState,
	dbs: string
): boolean => {

	return state.explorer.database[dbs]?.proceduresLoaded

}

export const selectDbsTypes = (
	state: RootState
): DatabaseTypeEnum[] => {

	return state.explorer.dbsTypes

}

export const selectSelected = (
	state: RootState
): DatabaseType => {

	return state.explorer.selected

}

export const selectError = (
	state: RootState
): string => {

	return state.explorer.error

}