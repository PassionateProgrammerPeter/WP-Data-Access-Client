import TextField from "@mui/material/TextField"
import { InputBaseComponentProps } from "@mui/material"
import { ColumnPropsType } from "../../types/ColumnPropsType"
import { FormModeEnum } from "../../enums/FormModeEnum"
import { FieldVariantEnum } from "../../enums/FieldVariantEnum"
import log from "loglevel"


const FieldText = (
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
		maxLength: columnMetaData.character_maximum_length,
		readOnly: formMode === FormModeEnum.VIEW ||
			(
				formMode === FormModeEnum.UPDATE &&
				metaData.primary_key.includes(columnName)
			)
	}

	const helperText: string =
		columnValidation?.error
			? columnValidation?.text
			: "Enter text (" + columnMetaData.character_maximum_length + ")"

	const getVariant = () => {


		return FieldVariantEnum.OUTLINED

	}

	return (
		<TextField
			error={columnValidation?.error}
			label={columnMetaData.formLabel}
			value={columnValue ?? ""}
			required={columnMetaData.is_nullable === "NO"}
			inputProps={inputProps}
			helperText={helperText}
			variant={getVariant()}
			onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
				onColumnChange(columnName, event.target.value)
			}}
			onInvalid={(e) => { e.preventDefault() }}
			sx={{
				"& input": {
					textAlign: storeColumn.alignment,
				}
			}}
		/>
	)

}

export default FieldText