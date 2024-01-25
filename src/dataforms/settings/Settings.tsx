import { useState } from "react"
import { closeFormSettings, setDrawerAnchor } from "../../store/uiSlice"
import { useAppDispatch } from "../../store/hooks"
import AppBar from "@mui/material/AppBar"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { Card, CardContent } from "@mui/material"
import { AdminTheme } from "../../themes/AdminTheme"
import ColumnSettings from "./ColumnSettings"
import { SettingsTabEnum } from "../../enums/SettingsTabEnum"
import ResizableDrawer from "../../utils/ResizableDrawer"
import { saveFormSettings } from "../../restapi/Actions"
import { ScopeEnum } from "../../enums/ScopeEnum"
import { AnchorEnum } from "../../enums/AnchorEnum"
import { enqueueSnackbar } from "notistack"
import { PaletteModeEnum } from "../../enums/PaletteModeEnum"
import Tooltip from "../../utils/Tooltip"
import { MdClose } from "react-icons/md"
import { BiSolidDockLeft, BiSolidDockRight } from "react-icons/bi"
import log from "loglevel"
import "../../css/settings.css"
import { selectMetaDataById } from "../../store/metaDataSlice"
import { Store } from "../../store/store"
import { rollbackForm, selectFormById } from "../../store/formSlice"
import { StoreFormType } from "../../types/StoreFormType"
import ConfirmDialog from "../../utils/ConfirmDialog"

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

	const [formSettings, setFormSettings] = useState<StoreFormType>(
		selectFormById(Store.getState(), appId)
	)
	log.debug(formSettings)


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
			rollbackForm({
				appId: appId,
				formState: formSettings
			})
		)


	}

	const close = (): void => {

		dispatch(
			closeFormSettings({})
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
				// Save form settings
				saveFormSettings(
					appId,
					ScopeEnum.GLOBAL,
					dbs,
					tbl,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					((data: any) => {
						log.debug(data)
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
					setFormSettings(
						selectFormById(Store.getState(), appId)
					)
				}


				setIsUpdated(false)
			}

		}

	}

	const ok = (): void => {

		if (isUpdated && !isComputeFieldOpen) {
			apply()
			setTimeout(() => {
				close()
			}, 1000)
		} else {
			close()
		}

	}

	const [tab, setTab] = useState<SettingsTabEnum>(SettingsTabEnum.FORM)
	log.debug(tab)

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
							Form Builder
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
						className="pp-setting-buttons pp-settings-buttons-dataform"
					>
						<Button variant="text" onClick={() => { setTab(SettingsTabEnum.COLUMNS) }}>Columns</Button>
					</Toolbar>
				</AppBar>

				<Card className="pp-settings-container">


						<ColumnSettings
							appId={appId}
							setIsUpdated={setIsUpdated}
							setComputeFieldOpen={setComputeFieldOpen}
							setHasErrors={setColumnSettingsHasErrors}
						></ColumnSettings>

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
				title="Close Form Builder?"
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