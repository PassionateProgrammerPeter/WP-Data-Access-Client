/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, lazy } from "react"
import { RootState, Store } from "../store/store"
import { update, selectFormColumnsById, selectFormContextById, selectFormValidationById } from "../store/formSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { Box } from "@mui/material"
import { TablePropsType } from "../types/TablePropsType"
import { FormModeEnum } from "../enums/FormModeEnum"
import { StoreFormColumnType } from "../types/StoreFormColumnType"
import { StoreFormDetailsType } from "../types/StoreFormDetailsType"
import { ColumnValidationType } from "../types/ColumnValidationType"
import { ComputedFieldType } from "../types/ComputedFieldType"
import { ComputedFieldTypeEnum } from "../enums/ComputedFieldTypeEnum"
import { getMetaDataColumnIndex } from "../ts/lib"
import { StoreTableSettingsType } from "../types/StoreTableSettingsType"
import { selectTableSettingsById } from "../store/tableSlice"
import log from "loglevel"


const Column = lazy(() => import("./Column"))

type Props = TablePropsType & {
	appId: string,
	metaData: any,
	data: any,
	primaryKey: any,
	formMode: FormModeEnum,
	formSettings: StoreFormDetailsType,
}

const Row = (
	{
		dbs,
		tbl,
		appId,
		metaData,
		data,
		primaryKey,
		formMode,
		formSettings,
	}: Props
) => {

	log.debug(
		dbs,
		tbl,
		metaData,
		data,
		primaryKey,
		formMode,
		formSettings,
	)

	const dispatch = useAppDispatch()

	const storeColumns: StoreFormColumnType[] =
		useAppSelector(
			(state: RootState) =>
				selectFormColumnsById(state, appId)
		)
	log.debug("storeColumns", storeColumns)

	const sortableColumns: string[] =
		storeColumns.map(
			(column: StoreFormColumnType) => column.columnName
		)
	log.debug("sortableColumns", sortableColumns)

	const rowValidation: ColumnValidationType =
		useAppSelector(
			(state: RootState) =>
				selectFormValidationById(state, appId)
		)
	log.debug("rowValidation", rowValidation)


	const tableSettings: StoreTableSettingsType =
		useAppSelector(
			(state: RootState) =>
				selectTableSettingsById(state, appId)
		)
	log.debug("tableSettings", tableSettings)

	const context: any =
		selectFormContextById(Store.getState(), appId)

	const onColumnChange = ((columnName: string, columnValue: any) => {

		log.debug(columnName, columnValue)

		dispatch(
			update({
				appId: appId,
				dbs: dbs,
				tbl: tbl,
				columnName: columnName,
				columnValue: columnValue
			})
		)

	})

	const defaultComputedField: ComputedFieldType = {
		label: "",
		type: ComputedFieldTypeEnum.TEXT,
		expression: ""
	}
	log.debug(defaultComputedField)


	const handleColumn = (
		columnIndex: number,
		index: number,
		columnName: string,
		columnValue: any,
		columnMetaData: any,
		storeFormMode: FormModeEnum,
	) => {

		log.debug(
			columnIndex,
			index,
			columnName,
			columnValue,
			columnMetaData,
			storeFormMode
		)


		return (

			<Suspense key={columnIndex}>

				<Box
					sx={{
						display: "grid",
						padding: "0"
					}}
				>
					<Column
						key={columnIndex}

						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumns[index]}
						columnValidation={rowValidation[columnName]}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={tableSettings}
						storeForm={formSettings}

						formMode={storeFormMode}
					/>
				</Box>

			</Suspense>

		)

	}

	return (

		<>
			{
				sortableColumns.map((columnName: string, index: number) => {

					const columnIndex: number | undefined = getMetaDataColumnIndex(metaData, columnName)
					if (columnIndex === undefined) {
						return null
					}

					const columnMetaData: any = { ...metaData?.columns[columnIndex] }

					if (
						columnMetaData.column_name &&
						storeColumns[index].visible === true
					) {
						let columnValue: any = ''
						if (data && data[columnName] !== undefined) {
							columnValue = data[columnName]
						}

						columnMetaData.formLabel = storeColumns[index].columnLabel

						let storeFormMode: FormModeEnum = formMode
						if (formMode !== FormModeEnum.VIEW) {
							if (!storeColumns[index].updatable) {
								storeFormMode = FormModeEnum.VIEW
							}
						}

						return handleColumn(
							columnIndex,
							index,
							columnName,
							columnValue,
							columnMetaData,
							storeFormMode,
						)
					} else {
						return null
					}
				})
			}
		</>

	)

}

export default Row