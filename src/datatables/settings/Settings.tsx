import { useState } from "react"

import { closeTableSettings, setDrawerAnchor } from "../../store/uiSlice"
import { useAppDispatch } from "../../store/hooks"

import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import { Card, CardContent } from "@mui/material"

import { saveTableSettings } from "../../restapi/Actions"

import TableSettings from "./TableSettings"
import ColumnSettings from "./ColumnSettings"
import Tooltip from "../../utils/Tooltip"
import { SettingsTabEnum } from "../../enums/SettingsTabEnum"
import { PaletteModeEnum } from "../../enums/PaletteModeEnum"
import ResizableDrawer from "../../utils/ResizableDrawer"
import { ScopeEnum } from "../../enums/ScopeEnum"
import { AnchorEnum } from "../../enums/AnchorEnum"
import { MdClose } from "react-icons/md"
import { enqueueSnackbar } from "notistack"
import { BiSolidDockLeft, BiSolidDockRight } from "react-icons/bi"

import log from "loglevel"

import "../../css/settings.css"
import { AdminTheme } from "../../themes/AdminTheme"
import { selectMetaDataById } from "../../store/metaDataSlice"
import { Store } from "../../store/store"
import ConfirmDialog from "../../utils/ConfirmDialog"
import { StoreTableType } from "../../types/StoreTableType"
import { rollbackTable, selectTableById } from "../../store/tableSlice"


type Props = {
	appId: string,
}

const Settings = (
	{
		appId,
	}: Props
) => {

	log.debug(appId)

	const dispatch = useAppDispatch()

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const metaData: any = selectMetaDataById(Store.getState(), appId)
	const dbs = metaData.src.dbs
	const tbl = metaData.src.tbl
	log.debug("metaData", metaData, dbs, tbl)

	const [tableSettings, setTableSettings] = useState<StoreTableType>(
		selectTableById(Store.getState(), appId)
	)
	log.debug(tableSettings)


	const [isUpdated, setIsUpdated] = useState<boolean>(false)
	const [isComputeFieldOpen, setComputeFieldOpen] = useState<boolean>(false)
	const [columnSettingsHasErrors, setColumnSettingsHasErrors] = useState<boolean>(false)
	const [confirmClose, setConfirmClose] = useState<boolean>(false)

	const storeColor: string =
		AdminTheme?.palette.mode === PaletteModeEnum.LIGHT
			? AdminTheme?.palette.primary.main
			: ""

	const setAnchor = (
		anchor: AnchorEnum
	): void => {

		dispatch(
			setDrawerAnchor({
				anchor: anchor
			})
		)

	}

	const rollback = () => {

		dispatch(
			rollbackTable({
				appId: appId,
				tableState: tableSettings
			})
		)


	}

	const close = () => {

		dispatch(
			closeTableSettings({})
		)

	}

	const cancel = () => {

		if (isUpdated) {
			setConfirmClose(true)
		} else {
			rollback()
			close()
		}

	}

	const apply = (): void => {

		if (isComputeFieldOpen) {
			enqueueSnackbar("Please save or cancel compute field to save", { variant: "error" })
		} else {
			if (columnSettingsHasErrors) {
				enqueueSnackbar("Column settings contains errors", { variant: "error" })
			} else {
				let restApiErrors: boolean = false
				// Save table settings
				saveTableSettings(
					appId,
					ScopeEnum.GLOBAL,
					dbs,
					tbl,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					((data: any) => {
						if (data?.code && data?.message) {
							switch (data.code) {
								case "ok":
									enqueueSnackbar(data.message, { variant: "success" })
									break
								case "error":
									enqueueSnackbar(data.message, { variant: "error" })
									restApiErrors = true
									break
								default:
									enqueueSnackbar(data.message, { variant: "info" })
							}
						} else {
							log.error(data)
							enqueueSnackbar("Invalid response - check console for more information", { variant: "error" })
							restApiErrors = true
						}
					})
				)

				if (!restApiErrors) {
					setTableSettings(
						selectTableById(Store.getState(), appId)
					)
				}

			}

			setIsUpdated(false)
		}

	}

	const ok = (): void => {

		if (isUpdated && !isComputeFieldOpen) {
			apply()
			setTimeout(() => {
				// Give to user some time to read the notification
				close()
			}, 1000)
		} else {
			close()
		}

	}

	const [tab, setTab] = useState<SettingsTabEnum>(SettingsTabEnum.TABLE)

	return (

		<>
			<ResizableDrawer
				closeDrawer={cancel}
			>

				<AppBar
					position="static"
					sx={{
						borderRadius: 0
					}}
				>
					<Toolbar
						className="pp-setting-toolbar"
						sx={{
							borderRadius: 0
						}}
					>
						<Typography
							variant="h5"
							noWrap
							component="div"
							className="unselectable"
							sx={{
								flexGrow: 1,
								display: {
									xs: 'none',
									sm: 'block'
								},
								paddingLeft: "6px"
							}}
						>
							Table Builder
						</Typography>

						<Tooltip title="Dock to left" position="bottom">
							<IconButton
								onClick={() => { setAnchor(AnchorEnum.LEFT) }}
								size="large"
								color="inherit"
								sx={{
									fontSize: "1em"
								}}
							>
								<BiSolidDockLeft />
							</IconButton>
						</Tooltip>

						<Tooltip title="Dock to right" position="bottom">
							<IconButton
								onClick={() => { setAnchor(AnchorEnum.RIGHT) }}
								size="large"
								color="inherit"
								sx={{
									fontSize: "1em"
								}}
							>
								<BiSolidDockRight />
							</IconButton>
						</Tooltip>

						<Tooltip title="Close" position="bottom">
							<IconButton
								onClick={cancel}
								size="large"
								color="inherit"
								sx={{
									fontSize: "1.4em"
								}}
							>
								<MdClose />
							</IconButton>
						</Tooltip>
					</Toolbar>
				</AppBar>

				<AppBar
					position="static"
					className="pp-setting-buttons-appbar"
					sx={{
						borderRadius: 0
					}}
				>
					<Toolbar
						className="pp-setting-buttons pp-settings-buttons-datatables"
					>
						<Button variant="text" onClick={() => { setTab(SettingsTabEnum.TABLE) }}>Table</Button>
						<Button variant="text" onClick={() => { setTab(SettingsTabEnum.COLUMNS) }}>Columns</Button>
					</Toolbar>
				</AppBar>

				<Card className="pp-settings-container">

					{
						tab === SettingsTabEnum.TABLE &&

						<TableSettings
							appId={appId}
							setIsUpdated={setIsUpdated}
						></TableSettings>
					}

					{
						tab === SettingsTabEnum.COLUMNS &&

						<ColumnSettings
							appId={appId}
							setIsUpdated={setIsUpdated}
							setComputeFieldOpen={setComputeFieldOpen}
							setHasErrors={setColumnSettingsHasErrors}
						></ColumnSettings>
					}


				</Card>

				<Card
					className="pp-setting-footer"
					sx={{
						borderRadius: 0,
						backgroundColor: storeColor
					}}
				>

					<CardContent
						className="pp-setting-footer-buttons"
						sx={{
							borderRadius: 0
						}}
					>

						<Button
							variant="outlined"
							className="footer_action_button_apply"
							onClick={apply}
						>
							Apply
						</Button>

						<Button
							variant="outlined"
							className="footer_action_button"
							onClick={ok}
						>
							OK
						</Button>

						<Button
							variant="outlined"
							className="footer_action_button"
							onClick={cancel}
						>
							Cancel
						</Button>

					</CardContent>

				</Card>

			</ResizableDrawer>

			<ConfirmDialog
				title="Close Table Builder?"
				message="All uncommitted changes will be lost!"
				open={confirmClose}
				setOpen={setConfirmClose}
				onConfirm={() => {
					rollback()
					close()
				}}
				onKeep={() => {
					close()
				}}
			/>
		</>

	)
}

export default Settings