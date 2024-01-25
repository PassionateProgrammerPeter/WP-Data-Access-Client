import { Color } from "@mui/material"
import { PaletteModeEnum } from "../enums/PaletteModeEnum"

export type StoreTheme = {
	fontFamily: Array<string>,
	customFontFamily: string,
	fontSize: number | undefined,
	mode: PaletteModeEnum,
	color: Color,
	colorLabel: string,
	shade: string,
	borderRadius: string
}