/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, Suspense, useEffect, useState } from "react"
import { openFormSettings, openTableSettings, stopAction } from "./store/uiSlice"
import { useAppDispatch, useAppSelector } from "./store/hooks"
import { AppBar, Box, IconButton, Toolbar, Tooltip } from "@mui/material"
import { DynamicModeEnum } from "./enums/DynamicModeEnum"
import { RowActionEnum } from "./enums/RowActionEnum"
import { FormModeEnum } from "./enums/FormModeEnum"
import Spinner from "./utils/Spinner"
import { deleteTable, selectTableExploring } from "./store/tableSlice"
import { deleteForm } from "./store/formSlice"
import { RootState, Store } from "./store/store"
import { deleteMetaData, selectMetaDataById } from "./store/metaDataSlice"
import { MdClose, MdSettings } from "react-icons/md"
import { deleteManager } from "./store/managerSlice"
import log from "loglevel"


const TableContainer = lazy(() => import("./datatables/TableContainer"))
const FormContainer = lazy(() => import("./dataforms/FormContainer"))

type Props = {
	appId: string,
}

const Container = (
	{
		appId,
	}: Props
) => {

	log.debug(appId)

	const dispatch = useAppDispatch()

	const cssElementId: string = "pp-remove-body-vertical-scrollbar"

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const metaData: any = selectMetaDataById(Store.getState(), appId)
	const dbs = metaData.src.dbs
	const tbl = metaData.src.tbl
	log.debug("metaData", metaData, dbs, tbl)


	const tableExploring: boolean =
		useAppSelector(
			(state: RootState) =>
				selectTableExploring(state, appId)
		)
	log.debug("tableExploring", tableExploring)

	const [mode, setMode] = useState<DynamicModeEnum>(DynamicModeEnum.TABLE)
	const [refreshTable, setRefreshTable] = useState<boolean>(false)

	useEffect(() => {

		// Switch mode from external code (TEST)
		(window as any)["externalSetMode"] = function (primaryKey: any) {
			log.debug(primaryKey)

			setPrimaryKey(primaryKey)
			setMode(DynamicModeEnum.FORM)
		}

	}, [appId])

	const showTable = (rerender: boolean): void => {

		log.debug(rerender)

		if (rerender) {
			setRefreshTable(!refreshTable)
		}
		setMode(DynamicModeEnum.TABLE)

	}

	const [primaryKey, setPrimaryKey] = useState<any | null>(null)
	const [formMode, setFormMode] = useState<FormModeEnum>(FormModeEnum.VIEW)

	const showForm = (
		primaryKey: any,
		action: RowActionEnum
	): void => {

		log.debug(
			primaryKey,
			action
		)

		switch (action) {
			case RowActionEnum.INSERT:
				setFormMode(FormModeEnum.INSERT)
				break;
			case RowActionEnum.UPDATE:
				setFormMode(FormModeEnum.UPDATE)
				break;
			default:
				setFormMode(FormModeEnum.VIEW)
		}

		setPrimaryKey(primaryKey)
		setMode(DynamicModeEnum.FORM)

	}


	return (

		<Box
			className="pp-component"
		>

			<AppBar
				className="pp-header"
				position="relative"
				sx={{
					margin: "0 0 5px 0"
				}}
			>
				<Toolbar
					sx={{
						display: "grid",
						gridTemplateColumns: "auto auto",
						justifyContent: "space-between",
						alignItems: "center"
					}}
				>
					<Box
						sx={{
							display: "block",
							whiteSpace: "nowrap",
							fontSize: "18px",
							lineHeight: "18px",
							fontWeight: "bold",
						}}
					>
						{dbs} - {tbl}
					</Box>

					<Box
						sx={{
							display: "flex",
							gap: "10px",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Tooltip
							title={mode === DynamicModeEnum.FORM ? "Form Builder" : "Table Builder"}
						>
							<IconButton
								sx={{
									color: "inherit",
									padding: 0,
								}}
								onClick={() => {
									if (mode === DynamicModeEnum.FORM) {
										dispatch(
											openFormSettings({
												appId: appId
											})
										)
									} else {
										dispatch(
											openTableSettings({
												appId: appId
											})
										)
									}
								}}
							>
								<MdSettings />
							</IconButton>
						</Tooltip>


						{
							tableExploring &&

							<Tooltip
								title="Back to Data Explorer?"
							>
								<IconButton
									sx={{
										color: "inherit",
										padding: 0
									}}
									onClick={() => {
										// Restore vertical scrollbar to body
										document.getElementById(cssElementId)?.remove()

										dispatch(
											stopAction({})
										)

										dispatch(
											deleteTable({
												appId: appId
											})
										)

										dispatch(
											deleteForm({
												appId: appId
											})
										)


										dispatch(
											deleteMetaData({
												appId: appId
											})
										)

										dispatch(
											deleteManager({})
										)
									}}
								>
									<MdClose />
								</IconButton>
							</Tooltip>
						}
					</Box>
				</Toolbar>
			</AppBar>

			<Suspense fallback={<Spinner title="Loading table..." />}>
				<TableContainer
					appId={appId}
					display={mode === DynamicModeEnum.TABLE}
					refresh={refreshTable}
					showForm={showForm}
				/>
			</Suspense>

			{
				mode === DynamicModeEnum.FORM &&

				<Suspense fallback={<Spinner title="Loading form..." />}>
					<FormContainer
						appId={appId}
						primaryKey={primaryKey}
						formMode={formMode}
						showTable={showTable}
						showForm={showForm}
					/>
				</Suspense>
			}

		</Box >

	)

}

export default Container