/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, lazy, useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { insertRow, selectRow, updateRow } from "../restapi/Actions"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import { enqueueSnackbar } from "notistack"
import { RootState, Store } from "../store/store.ts"
import { selectFormDataById, initData, selectFormSettingsById, validate, selectFormColumnByName } from "../store/formSlice"
import { StoreFormDetailsType } from "../types/StoreFormDetailsType"
import Spinner from "../utils/Spinner"
import { RowActionEnum } from "../enums/RowActionEnum"
import { FormModeEnum } from "../enums/FormModeEnum"
import { v4 as uuid } from "uuid"
import { StoreFormColumnType } from "../types/StoreFormColumnType"
import { selectMetaDataById } from "../store/metaDataSlice"
import CSS from "csstype"
import log from "loglevel"
import "./css/dataforms.css"

const Row = lazy(() => import("./Row"))


type Props = {
	appId: string,
	primaryKey: any,
	formMode: FormModeEnum,
	showTable: (rerender: boolean) => void,
	showForm: (keys: any, action: RowActionEnum) => void,
}

const Form = (
	{
		appId,
		primaryKey,
		formMode,
		showTable,
		showForm,
	}: Props
) => {

	log.debug(
		appId,
		primaryKey,
		formMode,
	)

	const dispatch = useAppDispatch()

	const formUuid: string = useMemo(() => {
		return uuid()
	}, [])

	const [dataLoaded, setDataLoaded] = useState<boolean>(false)
	const [isUpdated, setIsUpdated] = useState<boolean>(false)

	const metaData: any = selectMetaDataById(Store.getState(), appId)
	const dbs = metaData.src.dbs
	const tbl = metaData.src.tbl
	log.debug("metaData", metaData, dbs, tbl)

	const data: any =
		useAppSelector(
			(state: RootState) =>
				selectFormDataById(state, appId)
		)
	log.debug("data", data)

	useEffect(() => {
		if (primaryKey === null) {
			// Create new row
			addRow()
		} else {
			if (Object.keys(primaryKey).length) {
				// Update existing row
				loadData()
			} else {
				// Views have no primary key: row data already in store
				setDataLoaded(true)
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [primaryKey])

	const loadData = (): void => {

		selectRow(
			dbs,
			tbl,
			primaryKey,
			metaData?.media,
			function (response: any) {
				log.debug(response)

				dispatch(
					initData({
						appId: appId,
						data: response.data[0],
						context: response.context
					})
				)

				// setData(response)
				setDataLoaded(response !== null)
			}
		)

	}

	const addRow = (): void => {

		if (metaData.columns && Array.isArray(metaData.columns)) {
			const newRow: any = {}
			for (let i = 0; i < metaData.columns.length; i++) {
				newRow[metaData.columns[i].column_name] = null
			}
			log.debug(newRow)

			dispatch(
				initData({
					appId: appId,
					data: newRow
				})
			)
			log.debug("init")

			// setData(newRow)
			setDataLoaded(true)
		}

	}

	const columnAutoIncrement = (): string => {

		let auto_increment_column: string = ""

		for (const column in metaData.columns) {
			if (metaData.columns[column].extra === "auto_increment") {
				auto_increment_column = metaData.columns[column].column_name
			}
		}
		log.debug(auto_increment_column)

		return auto_increment_column

	}

	const getColumnMetaData = (columnName: string): any => {

		for (let i = 0; i < metaData.columns.length; i++) {
			if (metaData.columns[i].column_name === columnName) {
				return metaData.columns[i]
			}
		}

		return undefined

	}

	const validateForm = (
		currentStoreRow: any
	): boolean => {

		let isValid: boolean = true
		const auto_increment_column: string = columnAutoIncrement()

		for (const columnName in currentStoreRow) {
			const column: any = getColumnMetaData(columnName)
			let columnIsValid: boolean = true

			if (
				column.column_name !== auto_increment_column &&
				column.is_nullable === "NO" && (
					currentStoreRow[columnName] === "" ||
					currentStoreRow[columnName] === null ||
					currentStoreRow[columnName] === undefined
				)
			) {
				// Input is required
				dispatch(
					validate({
						appId: appId,
						columnName: columnName,
						columnError: true,
						columnText: "Field must be entered"
					})
				)

				columnIsValid = false
				isValid = false
			}

			const storeColumn: StoreFormColumnType | undefined = selectFormColumnByName(Store.getState(), appId, columnName)
			log.debug(storeColumn)


			if (columnIsValid) {
				dispatch(
					validate({
						appId: appId,
						columnName: columnName,
						columnError: false,
						columnText: ""
					})
				)
			}
		}

		return isValid

	}

	const applyChanges = (closeForm: boolean) => {

		const currentStoreRow: any = selectFormDataById(Store.getState(), appId)

		if (validateForm(currentStoreRow)) {
			if (
				primaryKey !== null
			) {
				updateRow(
					dbs,
					tbl,
					primaryKey,
					currentStoreRow,
					function (response: any) {
						if (
							response?.code.toLowerCase() === "ok"
						) {
							if (response.data === "Row successfully updated") {
								setIsUpdated(true)
								enqueueSnackbar(response.data, { variant: "success" })

								if (closeForm) {
									setTimeout(() => {
										showTable(true)
									}, 1000)
								}
							} else if (response.data === "Nothing to update") {
								enqueueSnackbar(response.data, { variant: "info" })

								if (closeForm) {
									showTable(isUpdated)
								}
							}
						} else {
							enqueueSnackbar("Error saving data, please check console", { variant: "error" })
							log.error(response)
						}
					}
				)
			} else {
				insertRow(
					dbs,
					tbl,
					currentStoreRow,
					function (response: any) {
						if (
							response?.code.toLowerCase() === "ok"
						) {
							if (response.data === "Row successfully inserted") {
								setIsUpdated(true)
								enqueueSnackbar(response.data, { variant: "success" })

								if (closeForm) {
									showTable(true)
									return
								}

								const auto_increment_column: string = columnAutoIncrement()

								// If user stays in form we need to rerender the form with the new 
								// primary key to support updates
								const newRowPrimaryKey: any = {}
								for (let i = 0; i < metaData.primary_key.length; i++) {
									if (auto_increment_column !== "") {
										// Get auto increment value from response
										newRowPrimaryKey[metaData.primary_key[i]] =
											response.context.insert_id
									} else {
										// Use form value
										newRowPrimaryKey[metaData.primary_key[i]] =
											(currentStoreRow as any)[metaData.primary_key[i]]
									}
								}

								// Rerender form with new primary key
								log.debug(newRowPrimaryKey)
								showForm(newRowPrimaryKey, RowActionEnum.UPDATE)
							} else {
								log.error("Invalid response")
								enqueueSnackbar("Invalid response", { variant: "error" })
							}
						} else {
							// Unknown error
							log.error(response)
						}
					}
				)
			}
		}

	}

	const applyForm = (): void => {
		applyChanges(false)
	}

	const okForm = (): void => {
		applyChanges(true)
	}

	const cancelForm = (): void => {
		showTable(isUpdated)
	}

	const formSettings: StoreFormDetailsType =
		useAppSelector(
			(state: RootState) =>
				selectFormSettingsById(state, appId)
		)
	log.debug("formSettings", formSettings)

	const cardStyle: CSS.Properties = {
		paddingTop: "50px",
		paddingBottom: "50px",
		paddingLeft: "50px",
		paddingRight: "50px",
	}

	// eslint-disable-next-line prefer-const
	let gridGap: string = "30px"

	// eslint-disable-next-line prefer-const
	let paddingRight: string  = "0"


	return (

		<div className={`${appId}_wrapper pp-form`}>
			{
				dataLoaded && data !== null

					?

					<Card
						sx={cardStyle}
					>
						<CardContent
							sx={{
								padding: 0,
								margin: "5px 0 0 0"
							}}
						>
							<form
								id={formUuid}
								className="pp-form-content"
								onSubmit={(e) => {
									e.preventDefault()
									return false
								}}
							>

								<Box
									className="pp-form-grid"
									sx={{
										display: "grid",
										gap: gridGap,
										marginBottom: 0,
										background:
												"",
									}}
								>
									<Suspense fallback={<Spinner />}>
										<Row
											appId={appId}
											dbs={dbs}
											tbl={tbl}
											metaData={metaData}
											data={data}
											primaryKey={primaryKey}
											formMode={formMode}
											formSettings={formSettings}
										/>
									</Suspense>
								</Box>

							</form>
						</CardContent>

						<CardActions
							sx={{
								marginTop: gridGap,
								padding: 0,
								paddingRight: paddingRight,
								justifyContent: "flex-end"
							}}
						>
							{
								formMode !== FormModeEnum.VIEW

									?

									<>
										<Button
											variant="contained"
											onClick={applyForm}
											type="submit"
											form={formUuid}
										>
											APPLY
										</Button>

										<Button
											variant="outlined"
											onClick={okForm}
											sx={{
												marginLeft: "16px"
											}}
										>
											OK
										</Button>

										<Button
											variant="outlined"
											onClick={cancelForm}
											sx={{
												marginLeft: "16px"
											}}
										>
											CANCEL
										</Button>

									</>

									:

									<Button
										variant="contained"
										onClick={cancelForm}
									>
										BACK
									</Button>
							}
						</CardActions>
					</Card>

					:

					<div style={{ padding: "50px" }}>
						<Spinner title="Loading data..." />
					</div>
			}
		</div>

	)

}

export default Form