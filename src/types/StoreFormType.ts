/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnValidationType } from "./ColumnValidationType"
import { StoreFormColumnType } from "./StoreFormColumnType"
import { StoreFormDetailsType } from "./StoreFormDetailsType"

export type StoreFormType = {

    data: Array<any>,

    validation: ColumnValidationType,

	context: Array<any>,

	columns: Array<StoreFormColumnType>,

	form: StoreFormDetailsType,

}