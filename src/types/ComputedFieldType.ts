import { ComputedFieldTypeEnum } from "../enums/ComputedFieldTypeEnum"

export type ComputedFieldType = {
	label: string,
	type: ComputedFieldTypeEnum,
	expression: string
}