/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExplorerActionEnum } from "../enums/ExplorerActionEnum"
import { TableTypeEnum } from "../enums/TableTypeEnum"

export type DatabaseTreeActionType = {
	dbs: string,
	tbl: string,
	typ: TableTypeEnum,
	action: ExplorerActionEnum,
}