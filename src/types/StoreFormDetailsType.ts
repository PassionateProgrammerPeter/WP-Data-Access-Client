import { FieldVariantEnum } from "../enums/FieldVariantEnum"
import { StoreFormSpacingType } from "./StoreFormSpacingType"

export type StoreFormDetailsType = {
	showGrid: boolean,
	cellsPerRow: number,
	spacing: StoreFormSpacingType,
	fieldVariant: FieldVariantEnum
}