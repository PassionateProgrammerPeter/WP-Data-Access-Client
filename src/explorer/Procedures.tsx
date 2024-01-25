/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "loglevel"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { RootState } from "../store/store"
import { addProcedures, selectProcedures, selectProceduresLoaded } from "../store/explorerSlice"
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

const Procedures = (
	{
		dbs,
		search
	}: Props
) => {

	log.debug(dbs, search)

	const dispatch = useAppDispatch()

	const proceduresLoaded: boolean =
		useAppSelector(
			(state: RootState) =>
				selectProceduresLoaded(state, dbs)
		)
	log.debug(proceduresLoaded)

	const procedures: string[] =
		useAppSelector(
			(state: RootState) =>
				selectProcedures(state, dbs)
		)
	log.debug(procedures)

	useEffect(() => {

		if (!proceduresLoaded) {
			loadProcedures()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [proceduresLoaded])

	const loadProcedures = () => {

		RestApi(
			Config.appUrlTreePrc,
			{
				dbs: dbs
			},
			function (response: any) {
				const data = response?.data
				log.debug("response data", data)

				dispatch(
					addProcedures({
						dbs: dbs,
						prc: data
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
		data: procedures.filter((row: any) => {
			return search === "" || row.routine_name.toLowerCase().includes(search.toLowerCase())
		}),
		initialState: {
			density: "comfortable",
		}
	})
	log.debug(table)

	if (!proceduresLoaded) {

		return (

			<Spinner />

		)

	}

	if (proceduresLoaded && procedures.length === 0) {

		return (

			<NoData msg="Database contains no stored procedures" />

		)

	}

	return (

		<MaterialReactTable
			table={table}
		/>

	)

}

export default Procedures