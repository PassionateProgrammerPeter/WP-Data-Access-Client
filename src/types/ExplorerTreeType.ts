import { DatabaseTypeEnum } from "../enums/DatabaseTypeEnum"
import { DatabaseTreeObjectType } from "./DatabaseTreeObjectType"
import { DatabaseType } from "./DatabaseType"

export type ExplorerTreeType = {
	database: DatabaseTreeObjectType,
	dbsTypes: DatabaseTypeEnum[],
	selected: DatabaseType,
	error: string
}