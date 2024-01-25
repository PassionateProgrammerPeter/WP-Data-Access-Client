/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react"
import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField } from "@mui/material"
import { TablePropsType } from "../../types/TablePropsType"
import { DatabaseTreeObjectType } from "../../types/DatabaseTreeObjectType"
import { RootState, Store } from "../../store/store"
import { invalidateTables, invalidateViews, selectDatabases, selectSelected } from "../../store/explorerSlice"
import { actionCopy, actionDrop, actionRename, actionTruncate } from "../../restapi/Actions"
import { enqueueSnackbar } from "notistack"
import { DatabaseType } from "../../types/DatabaseType"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { TableTypeEnum } from "../../enums/TableTypeEnum"
import ConfirmDialog from "../../utils/ConfirmDialog"
import { stopAction } from "../../store/uiSlice"
import Spinner from "../../utils/Spinner"
import log from "loglevel"

type Props = TablePropsType & {
	typ: TableTypeEnum,
	metaData: any,
}

const SettingsActions = (
	{
		dbs,
		tbl,
		typ,
		metaData,
	}: Props
) => {

	log.debug(dbs, tbl, typ, metaData)

	const dispatch = useAppDispatch()

	const [exp, setExp] = useState<any>("sql")
	const [wts, setWts] = useState<boolean>(true)
	const [ren, setRen] = useState<string>("")
	const [toDbs, setToDbs] = useState<any>(dbs)
	const [toTbl, setToTbl] = useState<string>("")
	const [toDat, setToDat] = useState<boolean>(true)

	const [confirmRename, setConfirmRename] = useState<boolean>(false)
	const [confirmTruncate, setConfirmTruncate] = useState<boolean>(false)
	const [confirmDrop, setConfirmDrop] = useState<boolean>(false)

	const [isCopying, setIsCopying] = useState<boolean>(false)

	const databases: string[] = useMemo(() => {
		const arrayDbs: string[] = []
		const storeDbs: DatabaseTreeObjectType = selectDatabases(Store.getState())

		for (const storeDb in storeDbs) {
			arrayDbs.push(storeDb)
		}

		return arrayDbs
	}, [])
	log.debug(databases)

	const selectedDatabases: DatabaseType =
		useAppSelector(
			(state: RootState) =>
				selectSelected(state)
		)
	log.debug(selectedDatabases)

	return (

		<>
			<Box
				sx={{
					margin: 0,
					padding: 0,
					"& .pp-action": {
						display: "grid",
						gridTemplateColumns: "150px 1fr",
						alignItems: "center",
						margin: 0,
						padding: "30px",
						borderBottom: "1px solid #ddd",
					},
					"& .pp-action button": {
						width: "120px",
					},
				}}

			>
				<Box
					className="pp-action"
				>
					<Box>
						<form
							action={metaData.settings.wp.home + "?action=wpda_export"}
							method="post"
							target="_blank"
						>
							<input type="hidden" name="type" value="table" />
							<input type="hidden" name="wpdaschema_name" value={dbs} />
							<input type="hidden" name="table_names" value={tbl} />
							<input type="hidden" name="format_type" value={exp} />
							<input type="hidden" name="include_table_settings" value={exp === "sql" && wts ? "on" : "off"} />
							<input type="hidden" name="_wpnonce" value={metaData.settings.wp.aonce.split("-")[0]} />
							<Button
								variant="contained"
								type="submit"
							>
								Export
							</Button>
						</form>
					</Box>

					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "auto auto",
							justifyContent: "space-between",
							alignItems: "center"
						}}
					>
						<FormControl>
							<InputLabel
								variant="outlined"
							>
								Export to
							</InputLabel>
							<Select
								label="Export to"
								value={exp}
								onChange={(event: SelectChangeEvent<HTMLSelectElement>) => {
									setExp(event.target.value)
								}}
							>
								<MenuItem key="sql" value="sql">SQL</MenuItem>
								<MenuItem key="csv" value="csv">CSV</MenuItem>
								<MenuItem key="json" value="json">JSON</MenuItem>
								<MenuItem key="excel" value="excel">Excel</MenuItem>
								<MenuItem key="xml" value="xml">XML</MenuItem>
							</Select>
						</FormControl>

						{
							exp === "sql" &&

							<FormControlLabel
								control={
									<Switch
										checked={wts}
										onClick={(event: React.MouseEvent): void => {
											setWts(!wts)
											event.stopPropagation()
										}}
									/>
								}
								label="With table settings"
								labelPlacement="end"
							/>
						}
					</Box>
				</Box>

				{
					selectedDatabases[dbs] !== "system" &&
					(
						selectedDatabases[dbs] !== "wp" ||
						!metaData.settings.wp.tables.includes(tbl)
					) &&

					<Box
						className="pp-action"
					>
						<Box>
							<Button
								variant="contained"
								onClick={() => {
									if (tbl !== ren && ren.trim() !== "") {
										setConfirmRename(true)
									} else {
										enqueueSnackbar("Nothing to rename", { variant: "error" })
									}
								}}
							>
								Rename
							</Button>
						</Box>

						<Box>
							<TextField
								label={typ === TableTypeEnum.TABLE ? "New table name" : "New view name"}
								value={ren}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setRen(event.target.value)
								}}
								fullWidth
							/>
						</Box>
					</Box>
				}

				{
					typ === TableTypeEnum.TABLE &&

					<Box
						className="pp-action"
					>
						<Box>
							<Button
								variant="contained"
								onClick={() => {
									if (toTbl.trim() !== "") {
										setIsCopying(true)

										actionCopy(
											dbs,
											toDbs,
											tbl,
											toTbl,
											toDat,
											((data: any) => {
												log.debug(data)
												if (data?.code && data?.message) {
													switch (data.code) {
														case "ok":
															dispatch(
																invalidateTables({
																	dbs: dbs
																})
															)
															enqueueSnackbar(data.message, { variant: "success" })
															break
														case "error":
															enqueueSnackbar(data.message, { variant: "error" })
															break
														default:
															enqueueSnackbar(data.message, { variant: "info" })
													}
												} else {
													log.error(data)
													enqueueSnackbar("Invalid response - check console for more information", { variant: "error" })
												}
											})
										)
									} else {
										enqueueSnackbar("Nothing to rename", { variant: "error" })
									}
								}}
							>
								Copy
							</Button>

							<FormControlLabel
								control={
									<Switch
										checked={toDat}
										onClick={(event: React.MouseEvent): void => {
											setToDat(!toDat)
											event.stopPropagation()
										}}
									/>
								}
								label="Copy data"
								labelPlacement="end"
								sx={{
									height: "56px",
								}}
							/>

							<Box
								sx={{
									display: isCopying ? "block" : "none",
									"& > div": {
										marginRight: "30px",
									},
									"& span.MuiCircularProgress-root, svg": {
										height: "20px !important",
										width: "20px !important",
									}
								}}
							>
								<Spinner title="Copying..." />
							</Box>
						</Box>

						<Box
							sx={{
								display: "grid",
								gridGap: "10px",
							}}
						>
							<FormControl
								fullWidth
							>
								<InputLabel
									variant="outlined"
								>
									To database
								</InputLabel>
								<Select
									label="To database"
									value={toDbs}
									onChange={(event: SelectChangeEvent<HTMLSelectElement>) => {
										setToDbs(event.target.value)
									}}
								>
									{
										...databases.map(db => {
											return (
												<MenuItem key={db} value={db}>{db}</MenuItem>
											)
										})
									}
								</Select>
							</FormControl>

							<TextField
								label="To table name"
								value={toTbl}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setToTbl(event.target.value)
								}}
								fullWidth
							/>
						</Box>
					</Box>
				}

				{
					typ === TableTypeEnum.TABLE &&
					selectedDatabases[dbs] !== "system" &&
					(
						selectedDatabases[dbs] !== "wp" ||
						!metaData.settings.wp.tables.includes(tbl)
					) &&

					<Box
						className="pp-action"
					>
						<Box>
							<Button
								variant="contained"
								onClick={() => {
									setConfirmTruncate(true)
								}}
							>
								Truncate
							</Button>
						</Box>

						<Box
							sx={{
								display: "grid",
								gridGap: "5px",
							}}
						>
							<span>Deletes all data permanently.</span>
							<strong>This action cannot be undone!</strong>
						</Box>
					</Box>
				}

				{
					selectedDatabases[dbs] !== "system" &&
					(
						selectedDatabases[dbs] !== "wp" ||
						!metaData.settings.wp.tables.includes(tbl)
					) &&

					<Box
						className="pp-action"
					>
						<Box>
							<Button
								variant="contained"
								onClick={() => {
									setConfirmDrop(true)
								}}
							>
								Drop
							</Button>
						</Box>

						<Box
							sx={{
								display: "grid",
								gridGap: "5px",
							}}
						>
							<span>Deletes table and all data permanently.</span>
							<strong>This action cannot be undone!</strong>
						</Box>
					</Box>
				}

			</Box>

			<ConfirmDialog
				title="Rename table row?"
				message="This can affect existing apps using this table!"
				open={confirmRename}
				setOpen={setConfirmRename}
				onConfirm={() => {
					actionRename(
						dbs,
						tbl,
						ren,
						((data: any) => {
							log.debug(data)
							if (data?.code && data?.message) {
								switch (data.code) {
									case "ok":
										if (typ === TableTypeEnum.TABLE) {
											dispatch(
												invalidateTables({
													dbs: dbs
												})
											)
										} else {
											dispatch(
												invalidateViews({
													dbs: dbs
												})
											)
										}
										dispatch(
											stopAction({})
										)
										enqueueSnackbar(data.message, { variant: "success" })
										break
									case "error":
										enqueueSnackbar(data.message, { variant: "error" })
										break
									default:
										enqueueSnackbar(data.message, { variant: "info" })
								}
							} else {
								log.error(data)
								enqueueSnackbar("Invalid response - check console for more information", { variant: "error" })
							}
						})
					)
				}}
			/>

			<ConfirmDialog
				title="Truncate table?"
				message="This action cannot be undone!"
				open={confirmTruncate}
				setOpen={setConfirmTruncate}
				onConfirm={() => {
					actionTruncate(
						dbs,
						tbl,
						((data: any) => {
							log.debug(data)
							if (data?.code && data?.message) {
								switch (data.code) {
									case "ok":
										enqueueSnackbar(data.message, { variant: "success" })
										break
									case "error":
										enqueueSnackbar(data.message, { variant: "error" })
										break
									default:
										enqueueSnackbar(data.message, { variant: "info" })
								}
							} else {
								log.error(data)
								enqueueSnackbar("Invalid response - check console for more information", { variant: "error" })
							}
						})
					)
				}}
			/>

			<ConfirmDialog
				title="Drop table?"
				message="This action cannot be undone!"
				open={confirmDrop}
				setOpen={setConfirmDrop}
				onConfirm={() => {
					actionDrop(
						dbs,
						tbl,
						((data: any) => {
							log.debug(data)
							if (data?.code && data?.message) {
								switch (data.code) {
									case "ok":
										dispatch(
											invalidateTables({
												dbs: dbs
											})
										)
										dispatch(
											stopAction({})
										)
										enqueueSnackbar(data.message, { variant: "success" })
										break
									case "error":
										enqueueSnackbar(data.message, { variant: "error" })
										break
									default:
										enqueueSnackbar(data.message, { variant: "info" })
								}
							} else {
								log.error(data)
								enqueueSnackbar("Invalid response - check console for more information", { variant: "error" })
							}
						})
					)
				}}
			/>
		</>
	)

}

export default SettingsActions