import { AlignmentEnum } from '../enums/AlignmentEnum'
import { EnumTypeEnum } from '../enums/EnumTypeEnum'
import { InlineSearchEnum } from '../enums/InlineSearchEnum'
import { ComputedFieldType } from './ComputedFieldType'

export type StoreTableColumnType = {
	columnName: string,
	columnLabel: string,
    visible: boolean,
	visibleTablet: boolean,
	visibleMobile: boolean,
    queryable: boolean,
	orderable: boolean,
    inlineSearch: boolean,
	inlineSearchEnum: InlineSearchEnum,
	inlineEditing: boolean,
	inlineEditingEnum: EnumTypeEnum | undefined,
	inlineNumericMin: number | undefined,
	inlineNumericMax: number | undefined,
	computedField: ComputedFieldType | undefined,
	alignment: AlignmentEnum,
	width: number,
	prefix: string,
	suffix: string,
	localize: boolean,
	decimals: number,
	dateZeros: boolean,
	timeZeros: boolean,
	classNames: string,
}