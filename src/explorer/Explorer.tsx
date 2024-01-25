/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, lazy, useEffect, useState } from "react"
import { RestApi } from "../restapi/RestApi"
import { Config } from "../utils/Config"
import { TreeView } from "@mui/x-tree-view/TreeView"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import Datatabase from "./Datatabase"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { initExplorer, selectDatabases, selectDbsTypes, selectError, selectSelected, setError, setSelected } from "../store/explorerSlice"
import { RootState } from "../store/store"
import { DatabaseTreeObjectType } from "../types/DatabaseTreeObjectType"
import { DatabaseTreeActionType } from "../types/DatabaseTreeActionType"
import { ExplorerActionEnum } from "../enums/ExplorerActionEnum"
import MetaData from "../MetaData"
import { AppBar, Box, Theme, ThemeProvider, Toolbar } from "@mui/material"
import { DatabaseTypeEnum } from "../enums/DatabaseTypeEnum"
import { DatabaseType } from "../types/DatabaseType"
import { AdminThemeInit } from "../themes/AdminTheme"
import Spinner from "../utils/Spinner"
import { MdExpandLess, MdExpandMore } from "react-icons/md"
import { BsDatabase } from "react-icons/bs"
import Search from "./Search"
import { selectAction } from "../store/uiSlice"
import { v4 as uuid } from "uuid"
import log from "loglevel"
import "../css/main.css"

const Alert = lazy(() => import("../utils/Alert"))
const Settings = lazy(() => import("./Settings/Settings"))

const Explorer = () => {

	const dispatch = useAppDispatch()

	const [search, setSearch] = useState<string>("")

	const databases: DatabaseTreeObjectType =
		useAppSelector(
			(state: RootState) =>
				selectDatabases(state)
		)
	log.debug(databases)

	const error: string =
		useAppSelector(
			(state: RootState) =>
				selectError(state)
		)
	log.debug(error)

	const selected: DatabaseType =
		useAppSelector(
			(state: RootState) =>
				selectSelected(state)
		)
	log.debug(selected)

	const dbsTypes: DatabaseTypeEnum[] =
		useAppSelector(
			(state: RootState) =>
				selectDbsTypes(state)
		)
	log.debug(dbsTypes)

	const action: DatabaseTreeActionType | undefined =
		useAppSelector(
			(state: RootState) =>
				selectAction(state)
		)
	log.debug(action)

	useEffect(() => {

		loadDatabases() // Only needed once on page load

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const loadDatabases = () => {

		let dbsTypes: DatabaseTypeEnum[] = []

		const savedDbsTypes = localStorage.getItem("ppDbsTypes")
		if (savedDbsTypes !== null) {
			dbsTypes = JSON.parse(savedDbsTypes)
		} else {
			dbsTypes = [
				DatabaseTypeEnum.WP,
				DatabaseTypeEnum.LOCAL,
				DatabaseTypeEnum.REMOTE
			]
		}

		RestApi(
			Config.appUrlTreeDbs,
			{},
			function (response: any) {
				const data = response?.data
				log.debug("response data", data)

				const dbs: string[] = []
				data.map((element: any) => {
					dbs.push(element.dbs)
				})

				dispatch(
					initExplorer({
						dbs: dbs,
						dbsTypes: dbsTypes
					})
				)

				const dbsData: DatabaseType = {}
				data.map((element: any) => {
					dbsData[element.dbs] = element.dbs_type
				})

				dispatch(
					setSelected({
						dbs: dbsData
					})
				)

			}
		)

	}

	if (databases === undefined) {
		return null
	}

	const theme: Theme = AdminThemeInit()

	return (

		<ThemeProvider theme={theme}>
			<Box
				sx={{
					marginBottom: "30px",
					display: action?.action === ExplorerActionEnum.EXPLORE ? "none" : "block",
				}}
			>
						<AppBar
							position="relative"
							sx={{
								borderRadius: "4px",
							}}
						>
							<Toolbar
								sx={{
									display: "grid",
									gridTemplateColumns: "1fr auto",
									gap: "12px",
									justifyContent: "space-between",
									paddingRight: "12px !important",
								}}
							>
								<Box
									sx={{
										fontSize: "18px",
										lineHeight: "18px",
										fontWeight: "bold",
										whiteSpace: "nowrap",
									}}
								>
									Data Explorer
								</Box>

								<Box>
									<Search
										search={search}
										setSearch={setSearch}
										addFilter={true}
									/>
								</Box>
							</Toolbar>
						</AppBar>
			</Box>

			{
				error !== "" &&

				<Box
					sx={{
						marginBottom: "30px"
					}}
				>
					<Suspense>
						<Alert
							severity="error"
							message={error}
							close={true}
							setClose={() => {
								dispatch(
									setError({
										error: ""
									})
								)
							}}
						/>
					</Suspense>
				</Box>
			}

			<TreeView
				aria-label="Data Explorer"
				defaultCollapseIcon={<MdExpandLess />}
				defaultExpandIcon={<MdExpandMore />}
				sx={{
					display: action?.action === ExplorerActionEnum.EXPLORE ? "none" : "grid",
					gridGap: "0",
					borderBottom: "1px solid rgba(0, 0, 0, 0.34)",
				}}
			>
				{
					Object.keys(databases).map(
						(dbs) => {
							if (dbsTypes.includes(selected[dbs]) === false) {
								// Hide database
								return null
							}

							if (
								search !== "" &&
								!dbs.toLowerCase().includes(search.toLowerCase())
							) {
								return null
							}

							const databaseLabel: string =
								selected[dbs].toLocaleLowerCase() === "wp"
									? "WordPress database (" + dbs + ")"
									: dbs
							return (
								<TreeItem
									key={dbs}
									nodeId={dbs}
									label={
										<div
											style={{
												display: "grid",
												gridTemplateColumns: "auto auto",
												justifyContent: "start",
												alignItems: "center",
												gap: "10px",
											}}
										>
											<BsDatabase />
											{databaseLabel}
										</div>
									}
									sx={{
										padding: "0",
									}}
								>
									<Datatabase
										dbs={dbs}
									/>
								</TreeItem>
							)
						}
					)
				}
			</TreeView>

			{

				action !== undefined &&
				action.action === ExplorerActionEnum.EXPLORE &&

				<div className="pp-container">
					<MetaData
						appId={uuid()}
						dbs={action.dbs}
						tbl={action.tbl}
						exploring={true}
					/>
				</div>

			}

			{
				action !== undefined &&
				action.action === ExplorerActionEnum.MANAGE &&

				<Suspense fallback={<Spinner title="Loading table settings..." />}>
					<Settings
						dbs={action.dbs}
						tbl={action.tbl}
						typ={action.typ}
					/>
				</Suspense>
			}
		</ThemeProvider>

	)

}

export default Explorer