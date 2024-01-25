import { AlignmentEnum } from "../enums/AlignmentEnum"
import { ColumnPositioningEnum } from "../enums/ColumnPositioningEnum"
import { EnumTypeEnum } from "../enums/EnumTypeEnum"
import { ComputedFieldType } from "./ComputedFieldType"

export type StoreFormColumnType = {
	columnName: string,
	columnLabel: string,
	visible: boolean,
	updatable: boolean,
	updatableEnum: EnumTypeEnum | undefined,
	cells: number,
	cellClass: ColumnPositioningEnum | number,
	numericMin: number | undefined,
	numericMax: number | undefined,
	computedField: ComputedFieldType | undefined,
	alignment: AlignmentEnum,
	prefix: string,
	suffix: string,
	classNames: string,
}