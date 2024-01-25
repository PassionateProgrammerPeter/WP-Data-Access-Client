import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import FormHelperText from "@mui/material/FormHelperText"
import { InputBaseComponentProps } from "@mui/material"
import { ColumnEnumPropsType } from "../../types/ColumnEnumPropsType"
import { FormModeEnum } from "../../enums/FormModeEnum"
import { FieldVariantEnum } from "../../enums/FieldVariantEnum"
import log from "loglevel"

const FieldEnum = (
	{
		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		columnValidation,
		onColumnChange,

		metaData,
		storeForm,
		
		enumValues,

		formMode,
	}: ColumnEnumPropsType
) => {

	log.debug(
		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		columnValidation,
		metaData,
		storeForm,
	
		enumValues,
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
				variant={getVariant()}
			>
				{columnMetaData.formLabel}
			</InputLabel>
			<Select
				error={columnValidation?.error}
				label={columnMetaData.formLabel}
				value={columnValue}
				inputProps={inputProps}
				variant={getVariant()}
				onChange={(event: SelectChangeEvent<HTMLSelectElement>) => {
					onColumnChange(columnName, event.target.value)
				}}
			>
				{
					(() => {
						const enumList = enumValues.map(function (enumValue: string) {
							return (
								<MenuItem
									data-id={columnName}
									key={enumValue}
									value={enumValue}

								>
									{enumValue}
								</MenuItem>
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

export default FieldEnum