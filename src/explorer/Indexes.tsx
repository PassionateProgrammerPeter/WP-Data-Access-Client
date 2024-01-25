/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "../store/hooks"
import log from "loglevel"
import { RootState } from "../store/store"
import { useEffect, useMemo } from "react"
import { RestApi } from "../restapi/RestApi"
import { Config } from "../utils/Config"
import { addIndexes, selectIndexes, selectIndexesLoaded } from "../store/explorerSlice"
import Spinner from "./Spinner"
import { MRT_ColumnDef, MRT_TableInstance, MaterialReactTable, useMaterialReactTable } from "material-react-table"
import { TableOptions } from "./TableOptions"
import NoData from "./NoData"

type Props = {
	dbs: string,
	tbl: string
}

const Indexes = (
	{
		dbs,
		tbl
	}: Props
) => {

	log.debug(dbs, tbl)

	const dispatch = useAppDispatch()

	const indexesLoaded: boolean =
		useAppSelector(
			(state: RootState) =>
				selectIndexesLoaded(state, dbs, tbl)
		)
	log.debug(indexesLoaded)

	const indexes: any =
		useAppSelector(
			(state: RootState) =>
				selectIndexes(state, dbs, tbl)
		)
	log.debug(indexes)

	useEffect(() => {

		if (!indexesLoaded) {
			loadIndexes()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [indexesLoaded])

	const loadIndexes = () => {

		RestApi(
			Config.appUrlTreeIdx,
			{
				dbs: dbs,
				tbl: tbl
			},
			function (response: any) {
				const data = response?.data
				log.debug("response data", data)

				dispatch(
					addIndexes({
						dbs: dbs,
						tbl: tbl,
						idx: data
					})
				)
			}
		)

	}

	const columnsMeta = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: "index_name",
				header: "Index name",
				size: 100,
			},
			{
				accessorKey: "non_unique",
				header: "Unique",
				size: 80,
			},
			{
				accessorKey: "seq_in_name",
				header: "#",
				size: 40,
				muiTableHeadCellProps: {
					align: "right",
				},
				muiTableBodyCellProps: {
					align: "right",
				},
			},
			{
				accessorKey: "column_name",
				header: "Column name",
				size: 100,
			},
			{
				accessorKey: "collation",
				header: "Collation",
				size: 80,
			},
			{
				accessorKey: "nullable",
				header: "Nullable?",
				size: 80,
			},
			{
				accessorKey: "index_type",
				header: "Index type",
				size: 100,
			},
			{
				accessorKey: "cardinality",
				header: "Cardinality",
				size: 80,
				muiTableHeadCellProps: {
					align: "right",
				},
				muiTableBodyCellProps: {
					align: "right",
				},
			},
		],
		[],
	)

	const table: MRT_TableInstance<any> = useMaterialReactTable({
		...TableOptions,
		columns: columnsMeta,
		data: indexes,
		initialState: {
			density: "comfortable",
		}
	})
	log.debug(table)

	if (!indexesLoaded) {

		return (

			<Spinner />

		)

	}

	if (indexesLoaded && indexes.length === 0) {

		return (

			<NoData msg="Table has no indexes" />

		)

	}

	return (

		<MaterialReactTable
			table={table}
		/>

	)

}

export default Indexes