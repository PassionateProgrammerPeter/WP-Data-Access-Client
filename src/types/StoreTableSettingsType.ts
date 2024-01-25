import { DensityEnum } from "../enums/DensityEnum"
import { FieldVariantEnum } from "../enums/FieldVariantEnum"
import { OverflowEnum } from "../enums/OverflowEnum"
import { PaneOrientationEnum } from "../enums/PaneOrientationEnum"
import { ProcessingEnum } from "../enums/ProcessingEnum"
import { BulkActionsType } from "./BulkActionsType"

export type StoreTableSettingsType = {
	processing: ProcessingEnum,
	locale: string,
	design: {
		overflow: OverflowEnum,
		density: {
			default: DensityEnum,
			userCanChange: boolean,
		}
	},
	viewLink: boolean,
	transactions: {
		insert: boolean,
		update: boolean,
		delete: boolean,
	},
	searchSettings: {
		estimatedRowCount: boolean,
		forceSearch: boolean,
		forceInline: boolean,
		forceEnterOnSearch: boolean,
		highlightMatches: boolean,
	},
	advancedSearch: {
		searchPanes:  {
			enabled: boolean,
			columns: Array<string>,
			orientation: PaneOrientationEnum,
			cascade: boolean,
		}
	},
	inlineEditing:{
		fieldVariant: FieldVariantEnum,
		spacing: {
			fieldTop: number | undefined,
			fieldTopUnit: string | undefined,
			fieldBottom: number | undefined,
			fieldBottomUnit: string | undefined,
			fieldLeft: number | undefined,
			fieldLeftUnit: string | undefined,
			fieldRight: number | undefined,
			fieldRightUnit: string | undefined,
			
		},
	},
	bulkActions: BulkActionsType
}