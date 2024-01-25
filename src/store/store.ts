import { configureStore } from "@reduxjs/toolkit"
import tableSlice from "./tableSlice"
import rowSlice from "./formSlice"
import uiSlice from "./uiSlice"
import explorerSlice from "./explorerSlice"
import metaDataSlice from "./metaDataSlice"
import managerSlice from "./managerSlice"

export const Store = configureStore({
	reducer: {
		tables: tableSlice,
		forms: rowSlice,
		ui: uiSlice,
		explorer: explorerSlice,
		metaData: metaDataSlice,
		manager: managerSlice,
	}
})

export type AppDispatch = typeof Store.dispatch
export type RootState = ReturnType<typeof Store.getState>