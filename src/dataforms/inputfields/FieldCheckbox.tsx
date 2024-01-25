import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import FormHelperText from "@mui/material/FormHelperText"
import { FormModeEnum } from "../../enums/FormModeEnum"
import { ColumnPropsType } from "../../types/ColumnPropsType"
import log from "loglevel"

const FieldCheckbox = (
	{
		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		onColumnChange,
		
		metaData,

		formMode,
	}: ColumnPropsType
) => {

	log.debug(
		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		onColumnChange,
		
		metaData,
	)
	
	return (

		<FormControl>
			<div></div>
			<FormControlLabel
				control={
					<Checkbox
						id={columnName}
						checked={columnValue === 1 || columnValue === "1" || columnValue === true || columnValue === "on"}
						disabled={
							formMode === FormModeEnum.VIEW || 
							(
								formMode === FormModeEnum.UPDATE &&
								metaData.primary_key.includes(columnName)
							)
						}
						onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
							onColumnChange(columnName, checked)
						}}
					/>
				}
				label={columnMetaData.formLabel}
			/>
			<FormHelperText></FormHelperText>
		</FormControl>

	)

}

export default FieldCheckbox