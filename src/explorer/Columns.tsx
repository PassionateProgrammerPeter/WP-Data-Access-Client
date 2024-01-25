/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { RootState } from "../store/store"
import { useEffect, useMemo } from "react"
import { RestApi } from "../restapi/RestApi"
import { Config } from "../utils/Config"
import { addColumns, selectColumns, selectColumnsLoaded } from "../store/explorerSlice"
import log from "loglevel"
import Spinner from "./Spinner"
import { MRT_ColumnDef, MRT_TableInstance, MaterialReactTable, useMaterialReactTable } from "material-react-table"
import { TableOptions } from "./TableOptions"
import NoData from "./NoData"

type Props = {
	dbs: string,
	tbl: string
}

const Columns = (
	{
		dbs,
		tbl
	}: Props
) => {

	log.debug(dbs, tbl)

	const dispatch = useAppDispatch()

	const columnsLoaded: boolean =
		useAppSelector(
			(state: RootState) =>
				selectColumnsLoaded(state, dbs, tbl)
		)
	log.debug(columnsLoaded)

	const columns: any =
		useAppSelector(
			(state: RootState) =>
				selectColumns(state, dbs, tbl)
		)
	log.debug(columns)

	useEffect(() => {

		if (!columnsLoaded) {
			loadColumns()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columnsLoaded])

	const loadColumns = () => {

		RestApi(
			Config.appUrlTreeCls,
			{
				dbs: dbs,
				tbl: tbl
			},
			function (response: any) {
				const data = response?.data
				log.debug("response data", data)

				dispatch(
					addColumns({
						dbs: dbs,
						tbl: tbl,
						cls: data
					})
				)
			}
		)

	}

	const columnsMeta = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: "ordinal_position",
				header: "#",
				size: 40,
			},
			{
				accessorKey: "column_name",
				header: "Column name",
				size: 100,
			},
			{
				accessorKey: "column_type",
				header: "Column type",
				size: 100,
			},
			{
				accessorKey: "is_nullable",
				header: "Nullable?",
				size: 50,
			},
			{
				accessorKey: "character_maximum_length",
				header: "Max length",
				size: 70,
				muiTableHeadCellProps: {
					align: "right",
				},
				muiTableBodyCellProps: {
					align: "right",
				},
			},
			{
				accessorKey: "numeric_precision",
				header: "Precision",
				size: 60,
				muiTableHeadCellProps: {
					align: "right",
				},
				muiTableBodyCellProps: {
					align: "right",
				},
			},
			{
				accessorKey: "numeric_scale",
				header: "Scale",
				size: 60,
				muiTableHeadCellProps: {
					align: "right",
				},
				muiTableBodyCellProps: {
					align: "right",
				},
			},
			{
				accessorKey: "extra",
				header: "Extra",
				size: 100,
			},
			{
				accessorKey: "column_default",
				header: "Default value",
				size: 100,
			},
		],
		[],
	)

	const table: MRT_TableInstance<any> = useMaterialReactTable({
		...TableOptions,
		columns: columnsMeta,
		data: columns,
		initialState: {
			columnOrder: [
				"ordinal_position",
				"column_name",
				"column_type",
				"is_nullable",
				"extra",
				"column_default",
				"character_maximum_length",
				"numeric_precision",
				"numeric_scale",
			],
			density: "comfortable",
		}
	})
	log.debug(table)

	if (!columnsLoaded) {

		return (

			<Spinner />

		)

	}

	if (columnsLoaded && columns.length === 0) {

		return (

			<NoData msg="Table has no columns" />

		)

	}

	log.debug(columns)

	return (

		<MaterialReactTable
			table={table}
		/>

	)

}

export default Columns