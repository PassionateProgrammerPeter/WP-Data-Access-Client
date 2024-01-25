/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormModeEnum } from "../enums/FormModeEnum"
import { ColumnValidation } from "./ColumnValidationType"
import { StoreFormColumnType } from "./StoreFormColumnType"
import { StoreFormDetailsType } from "./StoreFormDetailsType"
import { StoreTableSettingsType } from "./StoreTableSettingsType"

export type ColumnPropsType = {
	appId: string,

	columnName: string,
	columnValue: any,
	columnMetaData: any,
	storeColumn: StoreFormColumnType,
	columnValidation?: ColumnValidation
	onColumnChange: (columnName: string, columnValue: any) => void

	metaData: any,
	context: any,
	storeTable: StoreTableSettingsType,
	storeForm: StoreFormDetailsType,

	formMode: FormModeEnum,
}