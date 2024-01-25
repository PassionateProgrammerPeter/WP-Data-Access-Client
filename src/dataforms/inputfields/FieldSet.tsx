import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { InputBaseComponentProps } from "@mui/material"
import FormHelperText from "@mui/material/FormHelperText"
import { ColumnPropsType } from "../../types/ColumnPropsType"
import { FormModeEnum } from "../../enums/FormModeEnum"
import { FieldVariantEnum } from "../../enums/FieldVariantEnum"
import log from "loglevel"

const FieldSet = (
	{
		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		columnValidation,
		onColumnChange,

		metaData,
		storeForm,

		formMode,
	}: ColumnPropsType
) => {

	log.debug(
		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		columnValidation,
		metaData,
		storeForm,
		formMode
	)

	const inputProps: InputBaseComponentProps | undefined = {
		readOnly: formMode === FormModeEnum.VIEW ||
			(
				formMode === FormModeEnum.UPDATE &&
				metaData.primary_key.includes(columnName)
			)
	}

	const helperText: string =
		columnValidation?.error
			? columnValidation?.text
			: "Select from list"

	const getVariant = () => {


		return FieldVariantEnum.OUTLINED

	}

	return (
		<FormControl>
			<InputLabel
				variant={storeForm.fieldVariant}
			>
				{columnMetaData.formLabel}
			</InputLabel>
			<Select
				error={columnValidation?.error}
				label={columnMetaData.formLabel}
				value={columnValue.split(",")}
				multiple={true}
				inputProps={inputProps}
				variant={getVariant()}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onChange={(event: SelectChangeEvent<any>) => {
					onColumnChange(columnName, event.target.value.join(","))
				}}
			>
				{
					(() => {
						const enumValues =
							columnMetaData.column_type
								.replace("set(", "")
								.replace(")", "")
								.replaceAll("'", "")
								.split(",")

						const enumList = enumValues.map(function (enumValue: string) {
							return (
								<MenuItem key={enumValue} value={enumValue}>{enumValue}</MenuItem>
							)
						})

						return enumList
					})()
				}
			</Select>
			<FormHelperText>{helperText}</FormHelperText>
		</FormControl>
	)

}

export default FieldSet