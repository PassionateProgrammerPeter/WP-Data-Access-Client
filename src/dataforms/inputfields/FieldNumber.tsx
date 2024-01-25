import { StoreFormColumnType } from "../../types/StoreFormColumnType"
import { selectFormColumnByName } from "../../store/formSlice"
import { Store } from "../../store/store"
import TextField from "@mui/material/TextField"
import { InputBaseComponentProps } from "@mui/material"
import { ColumnPropsType } from "../../types/ColumnPropsType"
import { FormModeEnum } from "../../enums/FormModeEnum"
import { FieldVariantEnum } from "../../enums/FieldVariantEnum"
import log from "loglevel"


type Props = ColumnPropsType & {
	appId: string,
	storeColumn: StoreFormColumnType,
}

const FieldNumber = (
	{
		appId,

		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		columnValidation,
		onColumnChange,

		metaData,
		storeTable,
		storeForm,
		
		formMode,
	}: Props
) => {

	log.debug(
		appId,
		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		columnValidation,
		metaData,
		storeTable,
		storeForm,
		formMode
	)

	const column: StoreFormColumnType | undefined = 
		selectFormColumnByName(Store.getState(), appId, columnName)
	log.debug("column", column)


	const precision: number = parseInt(columnMetaData.numeric_precision)
	const scale: number = parseInt(columnMetaData.numeric_scale)
	const unsigned: boolean = columnMetaData.column_type.includes("unsigned")
	const step: string = scale === 0 ? "0" : (1 / (Math.pow(10, columnMetaData.numeric_scale))).toString()
	const inputProps: InputBaseComponentProps | undefined = {
		step: step,
		className: storeColumn.classNames,
		readOnly: formMode === FormModeEnum.VIEW ||
			(
				formMode === FormModeEnum.UPDATE &&
				metaData.primary_key.includes(columnName)
			) ||
			(
				formMode === FormModeEnum.INSERT &&
				columnMetaData.extra === "auto_increment"
			),
	}

	const getVariant = () => {

		
		return FieldVariantEnum.OUTLINED

	}


	const helperText: string =
	columnValidation?.error
			? columnValidation?.text
			: "Enter a number" + (unsigned ? " unsigned" : "") + " (" + precision.toString() + "," + scale.toString() + ")"

	return (
		<TextField
			error={columnValidation?.error}
			type="number"
			label={columnMetaData.formLabel}
			value={columnValue??''}
			required={columnMetaData.is_nullable === "NO"}
			helperText={helperText}
			inputProps={inputProps}
			InputLabelProps={{
				shrink: true
			}}
			variant={getVariant()}
			onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
				if (event.target.value==="") {
					onColumnChange(columnName, "")
				} else {
					onColumnChange(columnName, Number(event.target.value))
				}
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

export default FieldNumber