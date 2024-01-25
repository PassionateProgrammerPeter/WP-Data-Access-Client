import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import { ColumnEnumPropsType } from "../../types/ColumnEnumPropsType"
import { FormModeEnum } from "../../enums/FormModeEnum"
import { FormLabel } from "@mui/material"
import { EnumTypeEnum } from "../../enums/EnumTypeEnum"
import log from "loglevel"

type Props = ColumnEnumPropsType & {
	orientation: EnumTypeEnum,
}

const FieldEnum = (
	{
		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		columnValidation,
		onColumnChange,

		metaData,

		enumValues,

		formMode,
		orientation,
	}: Props
) => {

	log.debug(
		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		columnValidation,
		metaData,
		enumValues,
		formMode,
		orientation
	)

	const helperText: string =
		columnValidation?.error
			? columnValidation?.text
			: "Select from radio group"

	return (

		<FormControl>
			<FormLabel >
				{columnMetaData.formLabel}
			</FormLabel>
			<RadioGroup
				value={columnValue}
				sx={{
					flexDirection: orientation === EnumTypeEnum.RADIO_HORIZONTAL ? "row" : "column",
					paddingLeft: "12px"
				}}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					onColumnChange(columnName, (event.target as HTMLInputElement).value)
				}}
			>
				{
					(() => {
						const enumList = enumValues.map(function (enumValue: string) {
							return (
								<FormControlLabel
									control={
										<Radio
											disabled={
												formMode === FormModeEnum.VIEW ||
												(
													formMode === FormModeEnum.UPDATE &&
													metaData.primary_key.includes(columnName)
												)
											}
										/>
									}
									key={enumValue}
									value={enumValue}
									label={enumValue}
								/>
							)
						})

						return enumList
					})()
				}
			</RadioGroup>
			<FormHelperText>{helperText}</FormHelperText>
		</FormControl>

	)

}

export default FieldEnum