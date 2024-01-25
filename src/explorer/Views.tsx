/* eslint-disable @typescript-eslint/no-explicit-any */
import { addViews, selectViews, selectViewsLoaded } from "../store/explorerSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { RootState } from "../store/store"
import { useEffect } from "react"
import { Config } from "../utils/Config"
import { RestApi } from "../restapi/RestApi"
import { TreeView } from "@mui/x-tree-view/TreeView"
import Spinner from "./Spinner"
import { Box, Typography } from "@mui/material"
import StyledTable from "./StyledTable"
import { TableTypeEnum } from "../enums/TableTypeEnum"
import log from "loglevel"
import { MdExpandLess, MdExpandMore } from "react-icons/md"

type Props = {
	dbs: string,
	search: string
}

const Views = (
	{
		dbs,
		search
	}: Props
) => {

	const dispatch = useAppDispatch()

	log.debug(dbs, search)

	const viewsLoaded: boolean =
		useAppSelector(
			(state: RootState) =>
				selectViewsLoaded(state, dbs)
		)
	log.debug(viewsLoaded)

	useEffect(() => {

		if (!viewsLoaded) {
			loadViews()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [viewsLoaded])

	const views: string[] =
		useAppSelector(
			(state: RootState) =>
				selectViews(state, dbs)
		)
	log.debug(views)

	const loadViews = () => {

		RestApi(
			Config.appUrlTreeVws,
			{
				dbs: dbs
			},
			function (response: any) {
				const data = response?.data
				log.debug("response data", data)

				dispatch(
					addViews({
						dbs: dbs,
						vws: data
					})
				)
			}
		)

	}

	if (!viewsLoaded) {

		return (

			<Spinner />

		)

	}

	if (viewsLoaded && views.length === 0) {

		return (

			<Box
				sx={{
					padding: "1rem"
				}}
			>
				<Typography>
					Database contains no views
				</Typography>
			</Box>

		)

	}

	return (

		<TreeView
			aria-label="Views"
			defaultCollapseIcon={<MdExpandLess />}
			defaultExpandIcon={<MdExpandMore />}
			sx={{
				display: "grid",
				gap: "0",
			}}
		>
			{
				...views.map(
					(vw) => {
						if (
							search !== "" &&
							! vw.toLowerCase().includes(search.toLowerCase())
						) {
							return null
						}

						return (
							<StyledTable
								dbs={dbs}
								tbl={vw}
								typ={TableTypeEnum.VIEW}
							/>
						)
					}
				)
			}
		</TreeView>

	)

}

export default Views