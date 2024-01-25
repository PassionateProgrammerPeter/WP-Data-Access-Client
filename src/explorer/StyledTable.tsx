/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Link } from "@mui/material"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { TreeView } from "@mui/x-tree-view/TreeView"
import Columns from "./Columns"
import Indexes from "./Indexes"
import log from "loglevel"
import { useAppDispatch } from "../store/hooks"
import { ExplorerActionEnum } from "../enums/ExplorerActionEnum"
import Triggers from "./Triggers"
import ForeignKeys from "./ForeignKeys"
import { TableTypeEnum } from "../enums/TableTypeEnum"
import { BsCodeSlash, BsEyeFill, BsTable } from "react-icons/bs"
import { doAction } from "../store/uiSlice"
import { MdExpandLess, MdExpandMore, MdKey, MdViewColumn } from "react-icons/md"
import { TbCirclesRelation } from "react-icons/tb"

type Props = {
	dbs: string,
	tbl: string,
	typ: TableTypeEnum
}

const StyledTable = (
	{
		dbs,
		tbl,
		typ
	}: Props
) => {

	log.debug(dbs, tbl, typ)

	const dispatch = useAppDispatch()

	return (

		<TreeItem
			nodeId={tbl}
			label={
				<Box
					color="primary"
					sx={{
						display: "grid",
						gridTemplateColumns: "auto auto",
						justifyContent: "space-between",
						alignItems: "center",
						"&:hover": {
							".pp-row-actions": {
								display: "grid",
							}
						},
					}}
				>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "auto auto",
							justifyContent: "start",
							alignItems: "center",
							gap: "10px",
						}}
					>
						{

							typ === TableTypeEnum.VIEW

								? <BsEyeFill />

								: <BsTable />

						}

						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: "auto auto",
								alignItems: "stretch",
							}}
						>
							<Box>
								{tbl}
							</Box>

							<Box
								sx={{
									display: "none",
									gridTemplateColumns: "auto auto auto auto",
									gridGap: "10px",
									marginLeft: "10px",
									alignItems: "center",
								}}
								className="pp-row-actions"
							>
								<Box
									sx={{
										borderLeft: "1px solid black",
										height: "100%"
									}}
								></Box>
								<Link
									underline="none"
									onClick={(event: React.MouseEvent): void => {
										dispatch(
											doAction({
												dbs: dbs,
												tbl: tbl,
												typ: typ,
												doaction: ExplorerActionEnum.MANAGE
											})
										)

										event.preventDefault()
										event.stopPropagation()
									}}
								>
									Manage
								</Link>
								<Box
									sx={{
										borderLeft: "1px solid black",
										height: "100%"
									}}
								></Box>
								<Link
									underline="none"
									onClick={(event: React.MouseEvent): void => {
										dispatch(
											doAction({
												dbs: dbs,
												tbl: tbl,
												typ: typ,
												doaction: ExplorerActionEnum.EXPLORE
											})
										)

										event.preventDefault()
										event.stopPropagation()
									}}
								>
									Explore
								</Link>
							</Box>
						</Box>
					</Box>
				</Box>
			}
		>
			<TreeView
				aria-label="Columns and indexes"
				defaultCollapseIcon={<MdExpandLess />}
				defaultExpandIcon={<MdExpandMore />}
				sx={{
					display: "grid",
					gap: "0",
				}}
			>
				<TreeItem
					nodeId="columns"
					label={
						<Box
							sx={{
								display: "inline-grid",
								gridTemplateColumns: "auto auto",
								gap: "10px",
								alignItems: "center"
							}}
						>
							<MdViewColumn />
							<span>
								Columns
							</span>
						</Box>
					}
					sx={{
						padding: 0,
						minWidth: 0
					}}
				>
					<Columns
						dbs={dbs}
						tbl={tbl}
					/>
				</TreeItem>
				{
					typ === TableTypeEnum.TABLE &&
					<>
						<TreeItem
							nodeId="indexes"
							label={
								<Box
									sx={{
										display: "inline-grid",
										gridTemplateColumns: "auto auto",
										gap: "10px",
										alignItems: "center"
									}}
								>
									<MdKey />
									<span>
										Indexes
									</span>
								</Box>
							}
							sx={{
								padding: 0,
								minWidth: 0
							}}
						>
							<Indexes
								dbs={dbs}
								tbl={tbl}
							/>
						</TreeItem>
						<TreeItem
							nodeId="foreignkeys"
							label={
								<Box
									sx={{
										display: "inline-grid",
										gridTemplateColumns: "auto auto",
										gap: "10px",
										alignItems: "center"
									}}
								>
									<TbCirclesRelation />
									<span>
										Foreign Keys
									</span>
								</Box>
							}
							sx={{
								padding: 0,
								minWidth: 0
							}}
						>
							<ForeignKeys
								dbs={dbs}
								tbl={tbl}
							/>
						</TreeItem>
						<TreeItem
							nodeId="triggers"
							label={
								<Box
									sx={{
										display: "inline-grid",
										gridTemplateColumns: "auto auto",
										gap: "10px",
										alignItems: "center"
									}}
								>
									<BsCodeSlash />
									<span>
										Triggers
									</span>
								</Box>
							}
							sx={{
								padding: 0,
								minWidth: 0
							}}
						>
							<Triggers
								dbs={dbs}
								tbl={tbl}
							/>
						</TreeItem>
					</>
				}
			</TreeView>
		</TreeItem>

	)

}

export default StyledTable