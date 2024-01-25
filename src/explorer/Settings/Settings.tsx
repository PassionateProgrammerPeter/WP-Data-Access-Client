/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { AppBar, Box, Button, Card, CardContent, IconButton, Toolbar, Typography } from "@mui/material"
import ResizableDrawer from "../../utils/ResizableDrawer"
import { BiSolidDockLeft, BiSolidDockRight } from "react-icons/bi"
import Tooltip from "../../utils/Tooltip"
import { MdClose } from "react-icons/md"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setError } from "../../store/explorerSlice"
import { AdminTheme } from "../../themes/AdminTheme"
import { PaletteModeEnum } from "../../enums/PaletteModeEnum"
import { AnchorEnum } from "../../enums/AnchorEnum"
import { setDrawerAnchor, stopAction } from "../../store/uiSlice"
import SettingsReset from "./SettingsReset"
import SettingsTable from "./SettingsTable"
import SettingsColumn from "./SettingsColumn"
import SettingsRestApi from "./SettingsRestApi"
import { TablePropsType } from "../../types/TablePropsType"
import { RestApi } from "../../restapi/RestApi"
import { Config } from "../../utils/Config"
import Spinner from "../../utils/Spinner"
import SettingsActions from "./SettingsActions"
import { saveExplorerSettings } from "../../restapi/Actions"
import { enqueueSnackbar } from "notistack"
import { RootState, Store } from "../../store/store"
import { deleteManager, initManager, selectManagerSettings } from "../../store/managerSlice"
import { ManagerSettingsType } from "../../types/ManagerSettingsType"
import { TableTypeEnum } from "../../enums/TableTypeEnum"
import "../../css/settings.css"
import log from "loglevel"
import ConfirmDialog from "../../utils/ConfirmDialog"

type Props = TablePropsType & {
	typ: TableTypeEnum,
}
const Settings = (
	{
		dbs,
		tbl,
		typ,
	}: Props
) => {

	log.debug(dbs, tbl, typ)

	const dispatch = useAppDispatch()

	const [initManagerSettings, setInitManagerSettings] = useState<ManagerSettingsType>(
		selectManagerSettings(Store.getState())
	)
	log.debug(initManagerSettings)

	const [loadError, setLoadError] = useState<string>("")
	const [metaDataLoaded, setMetaDataLoaded] = useState<boolean>(false)
	const [tableMetaData, setTableMetaData] = useState<any>({})
	const [isUpdated, setIsUpdated] = useState<boolean>(false)
	const [confirmClose, setConfirmClose] = useState<boolean>(false)

	const [tab, setTab] = useState<string>("actions")

	useEffect(() => {

		if (!metaDataLoaded) {
			loadMetaData()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dbs, tbl])

	const loadMetaData = () => {

		RestApi(
			Config.appUrlMeta,
			{
				dbs: dbs,
				tbl: tbl,
				waa: true
			},
			function (response: any) {
				const data = response?.data
				log.debug("response data", dbs, tbl, data)

				if (
					data?.access?.select &&
					Array.isArray(data.access.select) &&
					data.access.select.includes("POST")
				) {
					const settings: any = { ...data.settings }

					// Add column labels and media settings
					settings.list_labels = { ...data.table_labels }
					settings.form_labels = { ...data.form_labels }
					settings.column_media = { ...data.wp_media }

					// Remove hyperlinks and UI settings
					delete settings.hyperlinks
					delete settings.ui
					delete settings.wp

					// Get table metadata
					const metaData: any = { ...data }
					setTableMetaData(metaData)

					dispatch(
						initManager({
							settings: settings,
							metaData: metaData,
						})
					)
					setMetaDataLoaded(true)
				} else {
					let msg = "Unauthorized"

					if (
						response?.data?.message
					) {
						msg = response.data.message
					}

					msg += " - check console for more information"

					log.error(msg)
					setLoadError(msg)
				}
			}
		)

	}

	const managerSettings: ManagerSettingsType | undefined =
		useAppSelector(
			(state: RootState) =>
				selectManagerSettings(state)
		)
	log.debug(managerSettings)

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

	const close = () => {

		dispatch(
			deleteManager({})
		)

		dispatch(
			stopAction({})
		)

	}

	const cancel = () => {

		if (isUpdated) {
			setConfirmClose(true)
		} else {
			close()
		}

	}

	const apply = (): void => {

		const settings: any = { ...managerSettings }

		let restApiErrors: boolean = false

		saveExplorerSettings(
			dbs,
			tbl,
			settings,
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
			setInitManagerSettings(
				selectManagerSettings(Store.getState())
			)
		}

		setIsUpdated(false)

	}

	const ok = (): void => {

		if (isUpdated) {
			apply()
			setTimeout(() => {
				close()
			}, 1000)
		} else {
			close()
		}

	}

	if (loadError !== "") {
		dispatch(
			setError({
				error: loadError
			})
		)

		dispatch(
			deleteManager({})
		)

		dispatch(
			stopAction({})
		)

		return null
	}

	if (metaDataLoaded) {

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
								Manage Table
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
							borderRadius: 0,
							padding: "0 0 15px 25px !important",
						}}
					>
						<Toolbar
							className="pp-setting-buttons"
						>
							<Box>
								<Typography
									variant="subtitle1"
									noWrap
									component="div"
									className="unselectable"
									sx={{
										width: "100%"
									}}
								>
									{dbs} - {tbl}
								</Typography>
							</Box>
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
							className="pp-setting-buttons"
							sx={{
								"&.MuiToolbar-root.pp-setting-buttons": {
									gridTemplateColumns: "1fr 1fr",
								}
							}}
						>
							<Button variant="text" onClick={() => { setTab("actions") }}>Actions</Button>
							<Button variant="text" onClick={() => { setTab("settings") }}>Settings</Button>
						</Toolbar>
					</AppBar>


					<Card className="pp-settings-container">

						{
							tab === "actions" &&

							<SettingsActions
								dbs={dbs}
								tbl={tbl}
								typ={typ}
								metaData={tableMetaData}
							/>
						}

						{
							tab === "settings" &&

							<>
								<SettingsTable
									dbs={dbs}
									tbl={tbl}
									setIsUpdated={setIsUpdated}
								/>

								<SettingsColumn
									dbs={dbs}
									tbl={tbl}
									setIsUpdated={setIsUpdated}
								/>

								<SettingsRestApi
									dbs={dbs}
									tbl={tbl}
									typ={typ}
									metaData={tableMetaData}
									setIsUpdated={setIsUpdated}
								/>

								<SettingsReset
									dbs={dbs}
									tbl={tbl}
								/>
							</>
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
					title="Close Manage Table?"
					message="All uncommitted changes will be lost!"
					open={confirmClose}
					setOpen={setConfirmClose}
					onConfirm={() => {
						close()
					}}
				/>
			</>

		)

	}

	return (
		<Spinner title="Loading meta data..." />
	)

}

export default Settings