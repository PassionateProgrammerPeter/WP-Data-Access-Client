import { TreeView } from "@mui/x-tree-view/TreeView"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import Tables from "./Tables"
import Views from "./Views"
import Procedures from "./Procedures"
import Functions from "./Functions"
import { memo, useState } from "react"
import Search from "./Search"
import { Box, Link } from "@mui/material"
import { invalidateFunctions, invalidateProcedures, invalidateTables, invalidateViews } from "../store/explorerSlice"
import { useAppDispatch } from "../store/hooks"
import log from "loglevel"
import { MdExpandLess, MdExpandMore } from "react-icons/md"
import { BsCodeSlash, BsEyeFill, BsTable } from "react-icons/bs"
import { TbSum } from "react-icons/tb"

type Props = {
	dbs: string
}

const Datatabase = memo((
	{
		dbs
	}: Props
) => {

	log.debug(dbs)

	const dispatch = useAppDispatch()

	const [tablesExpanded, setTablesExpanded] = useState<boolean>(false)
	const [searchTables, setSearchTables] = useState<string>("")

	log.debug(tablesExpanded, searchTables)

	const [viewsExpanded, setViewsExpanded] = useState<boolean>(false)
	const [searchViews, setSearchViews] = useState<string>("")

	log.debug(viewsExpanded, searchViews)

	const [proceduresExpanded, setProceduresExpanded] = useState<boolean>(false)
	const [searchProcedures, setSearchProcedures] = useState<string>("")

	log.debug(proceduresExpanded, searchProcedures)


	const [functionsExpanded, setFunctionsExpanded] = useState<boolean>(false)
	const [searchFunctions, setSearchFunctions] = useState<string>("")

	log.debug(functionsExpanded, searchFunctions)

	return (

		<TreeView
			aria-label="Databases"
			defaultCollapseIcon={<MdExpandLess />}
			defaultExpandIcon={<MdExpandMore />}
			sx={{
				display: "grid",
				gap: "0",
			}}
		>
			<TreeItem
				nodeId="tables"
				onClick={() => {
					setTablesExpanded(!tablesExpanded)
				}}
				label={
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "auto auto",
							gap: "20px",
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
								gap: "10px",
								justifyContent: "space-between",
								alignItems: "center"
							}}
						>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "auto auto",
									gap: "10px",
									justifyContent: "space-between",
									alignItems: "center"
								}}
							>
								<BsTable />
								Tables
							</Box>

							<Box
								className="pp-row-actions"
								sx={{
									display: "none",
									gridTemplateColumns: "auto auto",
									gridGap: "10px",
									alignItems: "center",
								}}
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
											invalidateTables({
												dbs: dbs
											})
										)

										event.preventDefault()
										event.stopPropagation()
									}}
								>
									Refresh
								</Link>
							</Box>
						</Box>
						<Box>
							{
								tablesExpanded &&
								<Search
									search={searchTables}
									setSearch={setSearchTables}
								/>
							}
						</Box>
					</Box>
				}
				sx={{
					padding: 0,
					minWidth: 0,
				}}
			>
				<Tables
					dbs={dbs}
					search={searchTables}
				/>
			</TreeItem>
			<TreeItem
				nodeId="view"
				onClick={() => {
					setViewsExpanded(!viewsExpanded)
				}}
				label={
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "auto auto",
							gap: "20px",
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
								gap: "10px",
								justifyContent: "space-between",
								alignItems: "center"
							}}
						>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "auto auto",
									gap: "10px",
									justifyContent: "space-between",
									alignItems: "center"
								}}
							>
								<BsEyeFill />
								Views
							</Box>

							<Box
								className="pp-row-actions"
								sx={{
									display: "none",
									gridTemplateColumns: "auto auto",
									gridGap: "10px",
									alignItems: "center",
								}}
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
											invalidateViews({
												dbs: dbs
											})
										)

										event.preventDefault()
										event.stopPropagation()
									}}
								>
									Refresh
								</Link>
							</Box>
						</Box>

						<Box>
							{
								viewsExpanded &&
								<Search
									search={searchViews}
									setSearch={setSearchViews}
								/>
							}
						</Box>
					</Box>
				}
				sx={{
					padding: 0,
					minWidth: 0
				}}
			>
				<Views
					dbs={dbs}
					search={searchViews}
				/>
			</TreeItem>
			<TreeItem
				nodeId="procedures"
				onClick={() => {
					setProceduresExpanded(!proceduresExpanded)
				}}
				label={
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "auto auto",
							gap: "20px",
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
								gap: "10px",
								justifyContent: "space-between",
								alignItems: "center"
							}}
						>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "auto auto",
									gap: "10px",
									justifyContent: "space-between",
									alignItems: "center"
								}}
							>
								<BsCodeSlash />
								Stored Procedures
							</Box>

							<Box
								className="pp-row-actions"
								sx={{
									display: "none",
									gridTemplateColumns: "auto auto",
									gridGap: "10px",
									alignItems: "center",
								}}
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
											invalidateProcedures({
												dbs: dbs
											})
										)

										event.preventDefault()
										event.stopPropagation()
									}}
								>
									Refresh
								</Link>
							</Box>
						</Box>

						<Box>
							{
								proceduresExpanded &&
								<Search
									search={searchProcedures}
									setSearch={setSearchProcedures}
								/>
							}
						</Box>
					</Box>
				}
				sx={{
					padding: 0,
					minWidth: 0
				}}
			>
				<Procedures
					dbs={dbs}
					search={searchProcedures}
				/>
			</TreeItem>
			<TreeItem
				nodeId="functions"
				onClick={() => {
					setFunctionsExpanded(!functionsExpanded)
				}}
				label={
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: "auto auto",
							gap: "20px",
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
								gap: "10px",
								justifyContent: "space-between",
								alignItems: "center"
							}}
						>
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "auto auto",
									gap: "10px",
									justifyContent: "space-between",
									alignItems: "center"
								}}
							>
								<TbSum />
								Functions
							</Box>

							<Box
								className="pp-row-actions"
								sx={{
									display: "none",
									gridTemplateColumns: "auto auto",
									gridGap: "10px",
									alignItems: "center",
								}}
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
											invalidateFunctions({
												dbs: dbs
											})
										)

										event.preventDefault()
										event.stopPropagation()
									}}
								>
									Refresh
								</Link>
							</Box>
						</Box>

						<Box>
							{
								functionsExpanded &&
								<Search
									search={searchFunctions}
									setSearch={setSearchFunctions}
								/>
							}
						</Box>
					</Box>
				}
				sx={{
					padding: 0,
					minWidth: 0
				}}
			>
				<Functions
					dbs={dbs}
					search={searchFunctions}
				/>
			</TreeItem>
		</TreeView>

	)

})

export default Datatabase