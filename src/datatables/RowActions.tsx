/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton } from "@mui/material"
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md"
import { StoreTableSettingsType } from "../types/StoreTableSettingsType"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { RootState } from "../store/store"
import { selectTableSettingsById } from "../store/tableSlice"
import { RowActionEnum } from "../enums/RowActionEnum"
import ConfirmDialog from "../utils/ConfirmDialog"
import { useState } from "react"
import { deleteRow } from "../restapi/Actions"
import { isView } from "../ts/lib"
import log from "loglevel"
import { initData } from "../store/formSlice"

type Props = {
	dbs: string,
	tbl: string,
	metaData: any,
	appId: string,
	rowId: any,
	rowData: any,
	showForm: (keys: any, action: RowActionEnum) => void,
	refetch: () => void,
}

const RowActions = (
	{
		dbs,
		tbl,
		metaData,
		appId,
		rowId,
		rowData,
		showForm,
		refetch,
	}: Props
) => {

	log.debug(metaData, appId, rowId, rowData)

	const dispatch = useAppDispatch()

	const storeTableSettings: StoreTableSettingsType =
		useAppSelector(
			(state: RootState) =>
				selectTableSettingsById(state, appId)
		)
	log.debug("storeTableSettings", storeTableSettings)

	const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

	const canView: boolean = storeTableSettings.viewLink
	const canUpdate: boolean = !isView(metaData) && metaData?.privs?.update && storeTableSettings.transactions.update
	const canDelete: boolean = !isView(metaData) && metaData?.privs?.delete && storeTableSettings.transactions.delete

	return (

		<Box
			sx={{
				position: "sticky",
				display: "grid",
				gridTemplateColumns: "auto auto auto",
				justifyContent: "space-around",
				alignItems: "center",
				gap: "5px"
			}}
		>
			{
				canView &&

				<IconButton
					color="primary"
					onClick={(event: React.MouseEvent): void => {
						if (!Object.keys(rowId).length) {
							dispatch(
								initData({
									appId: appId,
									data: rowData,
									context: null
								})
							)
						}

						showForm(
							rowId,
							RowActionEnum.VIEW
						)

						event.stopPropagation()
					}}
				>
					<MdVisibility />
				</IconButton>
			}

			{
				canUpdate &&

				<IconButton
					color="primary"
					onClick={(event: React.MouseEvent): void => {
						event.stopPropagation()
						showForm(
							rowId,
							RowActionEnum.UPDATE
						)
					}}
				>
					<MdEdit />
				</IconButton>
			}

			{
				canDelete &&

				<>
					<IconButton
						color="error"
						onClick={(event: React.MouseEvent): void => {
							event.stopPropagation()
							setConfirmDelete(true)
						}}
					>
						<MdDelete />
					</IconButton>

					<ConfirmDialog
						title="Delete row?"
						message="Are you sure you want to delete this row? This action cannot be undone!"
						open={confirmDelete}
						setOpen={setConfirmDelete}
						onConfirm={() => {
							deleteRow(
								dbs,
								tbl,
								rowId,
								function () {
									refetch()
								}
							)
						}}
					/>
				</>
			}
		</Box>

	)

}

export default RowActions