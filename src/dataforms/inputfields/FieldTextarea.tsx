import TextField from "@mui/material/TextField"
import { InputBaseComponentProps } from "@mui/material"
import { ColumnPropsType } from "../../types/ColumnPropsType"
import { FormModeEnum } from "../../enums/FormModeEnum"
import { FieldVariantEnum } from "../../enums/FieldVariantEnum"
import log from "loglevel"

const FieldTextarea = (
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
			: "Enter multi line text (" + columnMetaData.character_maximum_length + ")"

	const getVariant = () => {


		return FieldVariantEnum.OUTLINED

	}

	return (
		<TextField
			error={columnValidation?.error}
			id={columnName}
			label={columnMetaData.formLabel}
			value={columnValue ?? ""}
			required={columnMetaData.is_nullable === "NO"}
			multiline
			minRows={3}
			maxRows={10}
			inputProps={inputProps}
			helperText={helperText}
			variant={getVariant()}
			onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
				onColumnChange(columnName, event.target.value)
			}}
			onInvalid={(e) => { e.preventDefault() }}
		/>
	)

}

export default FieldTextarea