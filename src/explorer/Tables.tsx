/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react"
import log from "loglevel"
import { RestApi } from "../restapi/RestApi"
import { Config } from "../utils/Config"
import { TreeView } from "@mui/x-tree-view/TreeView"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { RootState } from "../store/store"
import { addTables, selectTables, selectTablesLoaded } from "../store/explorerSlice"
import Spinner from "./Spinner"
import { Box, Typography } from "@mui/material"
import StyledTable from "./StyledTable"
import { TableTypeEnum } from "../enums/TableTypeEnum"
import { MdExpandLess, MdExpandMore } from "react-icons/md"

type Props = {
	dbs: string,
	search: string
}

const Tables = (
	{
		dbs,
		search
	}: Props
) => {

	const dispatch = useAppDispatch()

	log.debug(dbs, search)

	const tablesLoaded: boolean =
		useAppSelector(
			(state: RootState) =>
				selectTablesLoaded(state, dbs)
		)
	log.debug(tablesLoaded)

	const tables: string[] =
		useAppSelector(
			(state: RootState) =>
				selectTables(state, dbs)
		)
	log.debug(tables)

	useEffect(() => {

		if (!tablesLoaded) {
			loadTables()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tablesLoaded])

	const loadTables = () => {

		RestApi(
			Config.appUrlTreeTbl,
			{
				dbs: dbs
			},
			function (response: any) {
				const data = response?.data
				log.debug("response data", data)

				dispatch(
					addTables({
						dbs: dbs,
						tbl: data
					})
				)
			}
		)

	}

	if (!tablesLoaded) {

		return (

			<Spinner />

		)

	}

	if (tablesLoaded && tables.length === 0) {

		return (

			<Box
				sx={{
					padding: "1rem"
				}}
			>
				<Typography>
					Database contains no tables
				</Typography>
			</Box>

		)

	}

	return (

		<TreeView
			aria-label="Tables"
			defaultCollapseIcon={<MdExpandLess />}
			defaultExpandIcon={<MdExpandMore />}
			sx={{
				display: "grid",
				gap: "0",
			}}
		>
			{
				...tables.map(
					(tbl) => {
						if (
							search !== "" &&
							! tbl.toLowerCase().includes(search.toLowerCase())
						) {
							return null
						}

						return (
							<StyledTable
								dbs={dbs}
								tbl={tbl}
								typ={TableTypeEnum.TABLE}
							/>
						)
					}
				)
			}
		</TreeView>

	)

}

export default Tables