/* eslint-disable @typescript-eslint/no-explicit-any */
import { StoreTableColumnType } from "./StoreTableColumnType"
import { StoreTableSettingsType } from "./StoreTableSettingsType"

export type StoreTableType = {

    columns: Array<StoreTableColumnType>

	table: StoreTableSettingsType

	state: {
		exploring: boolean,
		fullScreen: boolean,
	}

}