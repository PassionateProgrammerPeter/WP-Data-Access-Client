import { ColumnPropsType } from "./ColumnPropsType"

export type ColumnEnumPropsType = ColumnPropsType & {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	enumValues: any
}