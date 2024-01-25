/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, IconButton, Tooltip } from "@mui/material"
import { MdRefresh } from "react-icons/md"
import BulkActions from "./BulkActions"
import { BsPlusCircleFill } from "react-icons/bs"
import { RowActionEnum } from "../enums/RowActionEnum"
import { MRT_RowData, MRT_TableInstance } from "material-react-table"
import log from "loglevel"
import { BulkActionsType } from "../types/BulkActionsType"
import { useAppSelector } from "../store/hooks"
import { RootState } from "../store/store"
import { selectBulkActions, selectTableSettingsById } from "../store/tableSlice"
import { isView } from "../ts/lib"
import { StoreTableSettingsType } from "../types/StoreTableSettingsType"

type Props = {
	table: MRT_TableInstance<MRT_RowData>,
	metaData: any,
	appId: string,
	dbs: string,
	tbl: string,
	refetch: () => void,
	showForm: (keys: any, action: RowActionEnum) => void,
}

const Toolbar = (
	{
		table,
		metaData,
		appId,
		dbs,
		tbl,
		refetch,
		showForm
	}: Props
) => {

	log.debug(metaData, appId, tbl)

	const storeTableSettings: StoreTableSettingsType =
		useAppSelector(
			(state: RootState) =>
				selectTableSettingsById(state, appId)
		)
	log.debug("storeTableSettings", storeTableSettings)

	const bulkActions: BulkActionsType =
		useAppSelector(
			(state: RootState) =>
				selectBulkActions(state, appId)
		)
	log.debug("bulkActions", bulkActions)

	let bulkActionsEnabled: boolean = false
	for (const bulkAction in bulkActions) {
		bulkActionsEnabled = bulkActionsEnabled || ((bulkActions as any)[bulkAction] === true)
	}
	log.debug("bulkActionsEnabled", bulkActionsEnabled)

	const hasBulkActions: boolean =
		!isView(metaData) &&
		!metaData.table_type.toLowerCase().includes("view") &&
		bulkActionsEnabled

	log.debug("hasBulkActions", hasBulkActions)

	return (

		<Box
			sx={{
				display: "flex",
				flexWrap: "nowrap",
				gap: "8px",
				alignItems: "center"
			}}
			className="ppToolbarButtons"
		>
			<Tooltip
				arrow
				title="Refresh Table"
				className="ppToolbarRefreshIcon"
			>
				<IconButton
					onClick={() =>
						refetch()
					}
				>
					<MdRefresh />
				</IconButton>
			</Tooltip>

			{
				storeTableSettings.transactions.insert &&

				<Button
					variant="contained"
					startIcon={<BsPlusCircleFill />}
					onClick={() => {
						showForm(null, RowActionEnum.INSERT)
					}}
				>
					New Record
				</Button>
			}

			{
				hasBulkActions &&

				<BulkActions
					table={table}
					appId={appId}
					dbs={dbs}
					tbl={tbl}
					metaData={metaData}
					bulkActions={bulkActions}
					refetch={refetch}
				/>
			}
		</Box>

	)

}

export default Toolbar