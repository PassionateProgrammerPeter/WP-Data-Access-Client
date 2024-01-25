export type ColumnValidation = {
	error: boolean,
	text: string
}

export type ColumnValidationType = {
	[key: string]: ColumnValidation
}