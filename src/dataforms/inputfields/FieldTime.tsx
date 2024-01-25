import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import dayjs from "dayjs"
import { ColumnPropsType } from "../../types/ColumnPropsType"
import { FormModeEnum } from "../../enums/FormModeEnum"
import { FieldVariantEnum } from "../../enums/FieldVariantEnum"
import log from "loglevel"

const FieldTime = (
	{
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
	}: ColumnPropsType
) => {

	log.debug(
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

	const now = dayjs()
	const ampm: boolean = false

	const getLocale = () => {


		return "en"

	}

	const getVariant = () => {


		return FieldVariantEnum.OUTLINED

	}

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={getLocale()}>
			<TimePicker
				value={dayjs(now.format("YYYY-MM-DD") + "T" + columnValue)}
				label={columnMetaData.formLabel}
				views={['hours', 'minutes', 'seconds']}
				ampm={ampm}
				disabled={
					formMode === FormModeEnum.VIEW ||
					(
						formMode === FormModeEnum.UPDATE &&
						metaData.primary_key.includes(columnName)
					)
				}
				onChange={(value: dayjs.Dayjs | null) => {
					onColumnChange(columnName, dayjs(value).format("HH:mm:ss"))
				}}
				slotProps={{
					textField: {
						error: columnValidation?.error,
						helperText: columnValidation?.error ? columnValidation?.text : "Enter a date",
						variant: getVariant(),
					},
				}}
			/>
		</LocalizationProvider>
	)

}

export default FieldTime