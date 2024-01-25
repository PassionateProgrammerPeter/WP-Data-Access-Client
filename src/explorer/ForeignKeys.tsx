/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "loglevel"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import Spinner from "./Spinner"
import { addForeignKeys, selectForeignKeys, selectForeignKeysLoaded } from "../store/explorerSlice"
import { Config } from "../utils/Config"
import { RestApi } from "../restapi/RestApi"
import { useEffect, useMemo } from "react"
import { RootState } from "../store/store"
import { MRT_ColumnDef, MRT_TableInstance, MaterialReactTable, useMaterialReactTable } from "material-react-table"
import { TableOptions } from "./TableOptions"
import NoData from "./NoData"

type Props = {
	dbs: string,
	tbl: string
}

const ForeignKeys = (
	{
		dbs,
		tbl
	}: Props
) => {

	log.debug(dbs, tbl)
	
	const dispatch = useAppDispatch()

	const foreignKeysLoaded: boolean =
		useAppSelector(
			(state: RootState) =>
				selectForeignKeysLoaded(state, dbs, tbl)
		)
	log.debug(foreignKeysLoaded)

	const foreignKeys: any =
		useAppSelector(
			(state: RootState) =>
				selectForeignKeys(state, dbs, tbl)
		)
	log.debug(foreignKeys)

	useEffect(() => {

		if (!foreignKeysLoaded) {
			loadForeignKeys()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [foreignKeysLoaded])

	const loadForeignKeys = () => {

		RestApi(
			Config.appUrlTreeFrk,
			{
				dbs: dbs,
				tbl: tbl
			},
			function (response: any) {
				const data = response?.data
				log.debug("response data", data)

				dispatch(
					addForeignKeys({
						dbs: dbs,
						tbl: tbl,
						frk: data
					})
				)
			}
		)

	}

	const columnsMeta = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: "constraint_name",
				header: "Constraint name",
				size: 100,
			},
			{
				accessorKey: "column_name",
				header: "Column name",
				size: 100,
			},
			{
				accessorKey: "referenced_table_name",
				header: "Referenced table",
				size: 100,
			},
			{
				accessorKey: "referenced_column_name",
				header: "Referenced column",
				size: 100,
			},
		],
		[],
	)

	const table: MRT_TableInstance<any> = useMaterialReactTable({
		...TableOptions,
		columns: columnsMeta,
		data: foreignKeys,
		initialState: {
			density: "comfortable",
		}
	})
	log.debug(table)

	if (!foreignKeysLoaded) {

		return (

			<Spinner />

		)

	}

	if (foreignKeysLoaded && foreignKeys.length === 0) {

		return (

			<NoData msg="Table contains no foreign keys" />

		)

	}

	return (

		<MaterialReactTable
			table={table}
		/>

	)

}

export default ForeignKeys