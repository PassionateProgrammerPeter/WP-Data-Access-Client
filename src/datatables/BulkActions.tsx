/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react"
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state"
import { Box, Button, FormControlLabel, Popover, Radio, RadioGroup, Typography } from "@mui/material"
import { BsCaretDownFill } from "react-icons/bs"
import { MRT_RowData, MRT_TableInstance } from "material-react-table"
import { mkConfig, generateCsv, download } from "export-to-csv"
import { toXML } from "jstoxml"
import FileSaver from "file-saver"
import { getSimpleDataType } from "../ts/lib"
import { deleteRow } from "../restapi/Actions"
import ConfirmDialog from "../utils/ConfirmDialog"
import { BulkActionsType } from "../types/BulkActionsType"
import { v4 as uuid } from "uuid"
import log from "loglevel"


type Props = {
	table: MRT_TableInstance<MRT_RowData>,
	appId: string,
	dbs: string,
	tbl: string,
	metaData: any,
	bulkActions: BulkActionsType,
	refetch: () => void,
}

const BulkActions = (
	{
		table,
		appId,
		dbs,
		tbl,
		metaData,
		bulkActions,
		refetch,
	}: Props
) => {

	log.debug(appId, dbs, tbl, metaData)

	// eslint-disable-next-line prefer-const
	let defaultExportType: string = "csv"
	const [exportType, setExportType] = useState<string>(defaultExportType)
	const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

	const popupId: string = useMemo(() => {
		return uuid()
	}, [])

	const selectedRows = table.getSelectedRowModel().rows

	const csvOptions = mkConfig({
		filename: appId,
		fieldSeparator: ",",
		decimalSeparator: ".",
		useKeysAsHeaders: true,
	})


	const getPrimaryKey = (rowData: any) => {

		const primaryKey: any = {}

		if (metaData.primary_key && Array.isArray(metaData.primary_key)) {
			for (let i: number = 0; i < metaData.primary_key.length; i++) {
				const columnName = metaData.primary_key[i]

				primaryKey[columnName] = rowData[columnName]
			}
		}

		return primaryKey

	}

	const getColumnDataType = (columnName: string) => {

		for (let i = 0; i < metaData?.columns?.length; i++) {
			if (metaData?.columns[i]?.column_name === columnName) {
				return metaData?.columns[i]?.data_type
			}
		}

		return "varchar"

	}


	const downloadCsv = (): void => {

		const tableData = selectedRows.map((row) => row.original)
		const csv = generateCsv(csvOptions)(tableData)
		download(csvOptions)(csv)

	}

	const downloadJson = (): void => {

		const tableData = selectedRows.map((row) => row.original)

		FileSaver(
			new Blob([JSON.stringify(tableData)], {
				type: "text/json;charset=utf-8"
			}),
			appId + ".json"
		)

	}


	const downloadXml = (): void => {

		const tableData = selectedRows.map((row) => {
			return {
				row: row.original
			}
		})

		const xml = toXML({
			table: tableData
		})

		FileSaver(
			new Blob([xml], {
				type: "text/plain;charset=utf-8"
			}),
			appId + ".xml"
		)

	}

	const downloadSql = (): void => {

		const tableData = selectedRows.map((row) => row.original)

		let insertSql = "insert into " + tbl + " ("
		for (const columnName in tableData[0]) {
			insertSql += columnName + ","
		}
		insertSql = insertSql.slice(0, -1) + ") values "


		for (let i = 0; i < tableData.length; i++) {
			const row = tableData[i]
			insertSql += "("
			for (const columnName in row) {
				const dataType = getSimpleDataType(getColumnDataType(columnName))
				if (row[columnName] === null) {
					insertSql += "null,"

				} else {
					if (dataType === "number") {
						insertSql += row[columnName] + ","
					} else {
						insertSql += "'" + row[columnName] + "',"
					}
				}
			}
			insertSql = insertSql.slice(0, -1)
			insertSql += "),"
		}
		insertSql = insertSql.slice(0, -1) + ";"

		FileSaver(
			new Blob([insertSql], {
				type: "text/plain;charset=utf-8"
			}),
			appId + ".sql"
		)

	}

	const bulkDelete = (): void => {

		const tableData = selectedRows.map((row) => row.original)

		for (let i = 0; i < tableData.length; i++) {
			const primaryKey: any = getPrimaryKey(tableData[i])

			deleteRow(
				dbs,
				tbl,
				primaryKey,
				function () {
					refetch()
				}
			)
		}

	}


	return (

		<>

			<PopupState
				variant="popover"
				popupId={popupId}
			>
				{(popupState) => (
					<Box>
						<Button
							variant="contained"
							endIcon={<BsCaretDownFill />}
							{...bindTrigger(popupState)}
						>
							Bulk Actions
						</Button>

						<Popover
							{...bindPopover(popupState)}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							sx={{
								boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)"
							}}
						>
							<Box
								sx={{
									display: "grid",
									gap: "20px",
									padding: "20px"
								}}
							>
								{
									selectedRows.length === 0 &&

									<Typography
										sx={{
											textAlign: "center",
											marginTop: "10px"
										}}
									>
										No rows selected
									</Typography>
								}

								<RadioGroup
									value={exportType}
									onChange={(event: React.ChangeEvent<HTMLInputElement>, value: string) => {
										setExportType(value)
										event.stopPropagation()
									}}
								>
									{
										bulkActions.csv &&
										<FormControlLabel value="csv" label="Export to CSV" control={<Radio />} />
									}
									{
										bulkActions.json &&
										<FormControlLabel value="json" label="Export to JSON" control={<Radio />} />
									}
									{
										bulkActions.xml &&
										<FormControlLabel value="xml" label="Export to XML" control={<Radio />} />
									}
									{
										bulkActions.sql &&
										<FormControlLabel value="sql" label="Export to SQL" control={<Radio />} />
									}
									{
										bulkActions.delete &&
										<FormControlLabel value="delete" label="Delete permanently" control={<Radio />} />
									}
								</RadioGroup>

								<Button
									variant="contained"
									onClick={() => {

										switch (exportType) {
											case "csv":
												downloadCsv()
												break
											case "json":
												downloadJson()
												break
											case "xml":
												downloadXml()
												break
											case "sql":
												downloadSql()
												break
											case "delete":
												setConfirmDelete(true)
												break
										}

									}}
									disabled={selectedRows.length === 0}
								>
									Apply
								</Button>
							</Box>
						</Popover>
					</Box>
				)}
			</PopupState>

			<ConfirmDialog
				title="Delete selected row?"
				message="Are you sure you want to delete the selected row? This action cannot be undone!"
				open={confirmDelete}
				setOpen={setConfirmDelete}
				onConfirm={() => {
					bulkDelete()

				}}
			/>

		</>

	)

}

export default BulkActions