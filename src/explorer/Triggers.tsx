/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "loglevel"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { RootState } from "../store/store"
import { useEffect, useMemo } from "react"
import { RestApi } from "../restapi/RestApi"
import { Config } from "../utils/Config"
import Spinner from "./Spinner"
import { addTriggers, selectTriggers, selectTriggersLoaded } from "../store/explorerSlice"
import { MRT_ColumnDef, MRT_TableInstance, MaterialReactTable, useMaterialReactTable } from "material-react-table"
import { TableOptions } from "./TableOptions"
import NoData from "./NoData"

type Props = {
	dbs: string,
	tbl: string
}

const Triggers = (
	{
		dbs,
		tbl
	}: Props
) => {

	log.debug(dbs, tbl)

	const dispatch = useAppDispatch()

	const triggersLoaded: boolean =
		useAppSelector(
			(state: RootState) =>
				selectTriggersLoaded(state, dbs, tbl)
		)
	log.debug(triggersLoaded)

	const triggers: any =
		useAppSelector(
			(state: RootState) =>
				selectTriggers(state, dbs, tbl)
		)
	log.debug(triggers)

	useEffect(() => {

		if (!triggersLoaded) {
			loadTriggers()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggersLoaded])

	const loadTriggers = () => {

		RestApi(
			Config.appUrlTreeTrg,
			{
				dbs: dbs,
				tbl: tbl
			},
			function (response: any) {
				const data = response?.data
				log.debug("response data", data)

				dispatch(
					addTriggers({
						dbs: dbs,
						tbl: tbl,
						trg: data
					})
				)
			}
		)

	}

	const columnsMeta = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: "trigger_name",
				header: "Trigger name",
				size: 120,
			},
			{
				accessorKey: "event_manipulation",
				header: "Event",
				size: 80,
			},
			{
				accessorKey: "action_timing",
				header: "Timin",
				size: 80,
			},
			{
				accessorKey: "action_statement",
				header: "SQL",
				size: 200,
				Cell: ({ cell }) => {
					return (
						<pre style={{padding: 0, margin: 0}}>
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
		data: triggers,
		initialState: {
			density: "comfortable",
		}
	})
	log.debug(table)

	if (!triggersLoaded) {

		return (

			<Spinner />

		)

	}

	if (triggersLoaded && triggers.length === 0) {

		return (

			<NoData msg="Table has no triggers" />

		)

	}

	return (

		<MaterialReactTable
			table={table}
		/>

	)

}

export default Triggers