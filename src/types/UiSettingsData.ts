import { AnchorEnum } from "../enums/AnchorEnum"
import { DatabaseTreeActionType } from "./DatabaseTreeActionType"

export type UiSettingsData = {

	tableSettings: {
		isOpen: boolean,
		appId: string | null
	},

	formSettings: {
		isOpen: boolean,
		appId: string | null
	},

	drawer: {
		anchor: AnchorEnum,
		width: number
	},

	state: {
		fullScreen: boolean,
		exploring: boolean,
	},

	action: DatabaseTreeActionType | undefined,

}