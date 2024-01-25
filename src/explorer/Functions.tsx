/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "loglevel"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { addFunctions, selectFunctions, selectFunctionsLoaded } from "../store/explorerSlice"
import { RootState } from "../store/store"
import { useEffect, useMemo } from "react"
import { RestApi } from "../restapi/RestApi"
import { Config } from "../utils/Config"
import Spinner from "./Spinner"
import { MRT_ColumnDef, MRT_TableInstance, MaterialReactTable, useMaterialReactTable } from "material-react-table"
import { TableOptions } from "./TableOptions"
import NoData from "./NoData"

type Props = {
	dbs: string,
	search: string
}

const Functions = (
	{
		dbs,
		search
	}: Props
) => {

	log.debug(dbs, search)

	const dispatch = useAppDispatch()

	const functionsLoaded: boolean =
		useAppSelector(
			(state: RootState) =>
				selectFunctionsLoaded(state, dbs)
		)
	log.debug(functionsLoaded)

	const functions: string[] =
		useAppSelector(
			(state: RootState) =>
				selectFunctions(state, dbs)
		)
	log.debug(functions)

	useEffect(() => {

		if (!functionsLoaded) {
			loadFunctions()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [functionsLoaded])

	const loadFunctions = () => {

		RestApi(
			Config.appUrlTreeFnc,
			{
				dbs: dbs
			},
			function (response: any) {
				const data = response?.data
				log.debug("response data", data)

				dispatch(
					addFunctions({
						dbs: dbs,
						fnc: data
					})
				)
			}
		)

	}

	const columnsMeta = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: "routine_name",
				header: "Name",
				size: 100,
			},
			{
				accessorKey: "routine_definition",
				header: "Body",
				size: 300,
				Cell: ({ cell }) => {
					return (
						<pre style={{ padding: 0, margin: 0 }}>
							{cell.getValue<string>()}
						</pre>
					)
				},
			},
		],
		[],
	)

	const table: MRT_TableInstance<any> = useMaterialReactTable({
			...TableOptions,
			columns: columnsMeta,
			data: functions.filter((row: any) => {
				return search === "" || row.routine_name.toLowerCase().includes(search.toLowerCase())
			}),
			initialState: {
				density: "comfortable",
			}
	})
	log.debug(table)

	if (!functionsLoaded) {

		return (

			<Spinner />

		)

	}

	if (functionsLoaded && functions.length === 0) {

		return (

			<NoData msg="Database contains no functions" />

		)

	}

	return (

		<MaterialReactTable
			table={table}
		/>

	)

}

export default Functions