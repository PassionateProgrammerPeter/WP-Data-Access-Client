/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { MRT_ColumnDef, MRT_Localization, MRT_RowData, MRT_SortingState, MRT_TableInstance, MRT_ToggleDensePaddingButton, MRT_ToggleGlobalFilterButton, MaterialReactTable, useMaterialReactTable } from "material-react-table"
import { MRT_Localization_EN } from "material-react-table/locales/en"
import { Config } from "../utils/Config"
import { RestApiPromise } from "../restapi/RestApi"
import { RowActionEnum } from "../enums/RowActionEnum"
import { useAppSelector } from "../store/hooks"
import { RootState, Store } from "../store/store"
import { selectBulkActions, selectTableColumnsById, selectTableSettingsById } from "../store/tableSlice"
import { StoreTableColumnType } from "../types/StoreTableColumnType"
import { BulkActionsType } from "../types/BulkActionsType"
import { getMetaDataColumnIndex, getSimpleDataType, isView } from "../ts/lib"
import { StoreTableSettingsType } from "../types/StoreTableSettingsType"
import { OverflowEnum } from "../enums/OverflowEnum"
import { useMediaQuery, Tooltip } from "@mui/material"
import { AlignmentEnum } from "../enums/AlignmentEnum"
import { selectMetaDataById } from "../store/metaDataSlice"
import { MdError, MdOpenInNew } from "react-icons/md"
import { FaFilePdf, FaFilm, FaImage, FaMedapps, FaMusic } from "react-icons/fa6"
import merge from "lodash.merge"
import isEqual from "lodash.isequal"
import log from "loglevel"
import "./css/datatable.css"

const Toolbar = lazy(() => import("./Toolbar"))
const RowActions = lazy(() => import("./RowActions"))


type Props = {
	appId: string,
	display: boolean,
	refresh: boolean,
	showForm: (keys: any, action: RowActionEnum) => void
}

type Pagination = {
	pageIndex: number,
	pageSize: number,
}

const TableQuery = (
	{
		appId,
		display,
		refresh,
		showForm
	}: Props
) => {

	log.debug(appId, display, refresh)

	const metaData: any = selectMetaDataById(Store.getState(), appId)
	const dbs = metaData.src.dbs
	const tbl = metaData.src.tbl
	log.debug("metaData", metaData, dbs, tbl)

	const [pagination, setPagination] = useState<Pagination>({
		pageIndex: 0,
		pageSize: 10
	})
	const [sorting, setSorting] = useState<MRT_SortingState>([])
	const [globalFilter, setGlobalFilter] = useState("")
	const [rowCount, setRowCount] = useState<number | undefined>(undefined)
	const [rowCountUpdate, setRowCountUpdate] = useState<any>({
		global: globalFilter,
	})
	const [media, setMedia] = useState<any>({})
	log.debug(pagination, sorting, globalFilter, rowCount, rowCountUpdate, media)

	const [
		locale
	] = useState<MRT_Localization>(MRT_Localization_EN)

	const storeTableSettings: StoreTableSettingsType =
		useAppSelector(
			(state: RootState) =>
				selectTableSettingsById(state, appId)
		)
	log.debug("storeTableSettings", storeTableSettings)

	const hasPrimaryKey: boolean = metaData.primary_key.length > 0
	const canView: boolean = storeTableSettings.viewLink
	const canUpdate: boolean = !isView(metaData) && metaData?.privs?.update && storeTableSettings.transactions.update
	const canDelete: boolean = !isView(metaData) && metaData?.privs?.delete && storeTableSettings.transactions.delete
	const hasRowActions: boolean = (!isView(metaData) && hasPrimaryKey && (canView || canUpdate || canDelete)) || (isView(metaData) && canView)

	const bulkActions: BulkActionsType =
		useAppSelector(
			(state: RootState) =>
				selectBulkActions(state, appId)
		)
	log.debug("bulkActions", bulkActions)

	let bulkActionsEnabled: boolean = false
	for (const bulkAction in bulkActions) {
		bulkActionsEnabled = bulkActionsEnabled || ((bulkActions as any)[bulkAction] === true)
	}
	log.debug("bulkActionsEnabled", bulkActionsEnabled)

	const hasBulkActions: boolean =
		!isView(metaData) &&
		hasPrimaryKey &&
		bulkActionsEnabled
	log.debug("hasBulkActions", hasBulkActions)

	const tableColumns: StoreTableColumnType[] =
		useAppSelector(
			(state: RootState) =>
				selectTableColumnsById(state, appId)
		)
	log.debug("tableColumns", tableColumns)


	const { data, isError, isRefetching, isLoading, refetch } =
		useQuery<MRT_RowData>({
			queryKey: [
				"table-data",
				pagination.pageIndex,
				pagination.pageSize,
				sorting,
					globalFilter,
			],
			queryFn: async () => {
				const allColumns: any = {}
				tableColumns
					.filter(column => column.computedField === undefined)
					.map((column) => {
						allColumns[column.columnName] = column.queryable
					})

				let json: any
					// eslint-disable-next-line prefer-const
					json = (await RestApiPromise(
						Config.appUrlSelect,
						{
							dbs: dbs,
							tbl: tbl,
							col: allColumns,
							page_index: pagination.pageIndex,
							page_size: pagination.pageSize,
							sorting: sorting,
							search: globalFilter,
							row_count: isEqual(
								rowCountUpdate,
								{
									global: globalFilter,
								}
							) ? rowCount : undefined,
							media: metaData?.media,
						}
					)) as any
				log.debug(json)

				setRowCount(json?.data?.meta?.rowCount)
				setRowCountUpdate({
					global: globalFilter,
				})

				setMedia(json.data?.context?.media)

				return json.data
			},
			placeholderData: keepPreviousData,
		})

	const columnDef = useMemo<MRT_ColumnDef<MRT_RowData>[]>(() => {

		const columnDefs: MRT_ColumnDef<MRT_RowData>[] = []

		for (let i = 0; i < tableColumns.length; i++) {
			const col: StoreTableColumnType = tableColumns[i]
			const accessorKey: string = col.columnName
			const header: string = col.columnLabel
			const metaDataColumnIndex: number | undefined = getMetaDataColumnIndex(metaData, col.columnName)
			const columnSimpleDataType: string | undefined =
				metaDataColumnIndex !== undefined
					? getSimpleDataType(metaData.columns[metaDataColumnIndex].data_type, true)
					: undefined
			const columnDataType: string | undefined =
				metaDataColumnIndex !== undefined
					? metaData.columns[metaDataColumnIndex].data_type
					: undefined
			const columnMedia: string = metaData.media[accessorKey]

			log.debug(accessorKey, header, metaDataColumnIndex, columnSimpleDataType, columnDataType, columnMedia)

			// Prepare new column with standard values
			const newColumn: MRT_ColumnDef<MRT_RowData> = {
				accessorKey: accessorKey,
				header: header,
				size: col.width,
				muiTableHeadCellProps: {
					className: col.classNames,
					align: col.alignment,
					sx: {
						"& .Mui-TableHeadCell-Content": {
							marginLeft: col.alignment === AlignmentEnum.LEFT ? "-10px" : "0",
							marginRight: col.alignment === AlignmentEnum.RIGHT ? "-10px" : "0",
							width: col.alignment === AlignmentEnum.RIGHT ? "calc(100% + 10px)" : "inherit",
						},
						"& .Mui-TableHeadCell-Content-Wrapper": {
							marginLeft: "10px",
							marginRight: "10px",
						},
						"& .Mui-TableHeadCell-Content-Labels .MuiButtonBase-root": {
							marginRight: "5px",
						},
						"& .Mui-TableHeadCell-Content-Wrapper:hover":
							col.computedField === undefined && col.orderable
								? {
									backgroundColor:
											"rgb(242, 242, 242)"
									,
									borderRadius: "10px",
									padding: "0 10px",
									marginLeft: "0",
									marginRight: "0",
								} : {}
						,
					}
				},
				muiTableBodyCellProps: {
					className: col.classNames,
					align: col.alignment
				},
				enableColumnFilter:
					(false),
				enableSorting: col.orderable,
				enableColumnActions:
					col.orderable,
			}


			if (
				col.computedField !== undefined
			) {
				continue
			} else if (columnMedia === "ImageURL") {
				newColumn.muiTableBodyCellProps = {
					className: "pp-image " + col.classNames,
					align: col.alignment,
					sx: {
						"& img": {
							width: "100%",
							height: "100%",
						}
					}
				}
				newColumn.enableColumnFilter = false
				newColumn.enableSorting = false
				newColumn.enableColumnActions = false
				newColumn.Cell = ({ cell }) => {
					log.debug(columnSimpleDataType, cell)
					if (
						cell.getValue<string>() === null ||
						cell.getValue<string>() === ""
					) {
						return null
					}

					return (
						<>
							<img src={cell.getValue<string>()} alt={col.columnLabel} />
						</>
					)
				}
			} else if (
				columnMedia === "HyperlinkURL" ||
				columnMedia === "HyperlinkObject"
			) {
				newColumn.muiTableBodyCellProps = {
					className: "pp-hyperlink " + col.classNames,
					align: col.alignment,
				}
				newColumn.enableColumnFilter = false
				newColumn.enableSorting = false
				newColumn.enableColumnActions = false
				newColumn.Cell = ({ cell }) => {
					log.debug(columnSimpleDataType, cell)

					if (
						cell.getValue<string>() === null ||
						cell.getValue<string>() === ""
					) {
						return null
					}

					if (columnMedia === "HyperlinkObject") {
						try {

							const hyperlink = JSON.parse(cell.getValue<string>())

							if (
								hyperlink?.url !== "" &&
								hyperlink?.target &&
								hyperlink?.label !== ""
							) {

								return (

									<a href={hyperlink.url} target={hyperlink.target}>
										{hyperlink.label}
									</a>

								)

							} else {

								return null

							}

						} catch (error) {

							log.error("Invalid media properties", error)

							return (

								<Tooltip title="Error reading media! Check console...">
									<span>
										<MdError />
									</span>
								</Tooltip>

							)

						}
					} else {
						// HyperlinkURL (plain text hyperlink)
						return (

							<a
								href={cell.getValue<string>()}
								target="_blank"
								style={{
									display: "flex",
									alignItems: "center",
									gap: "5px",
								}}
							>
								<MdOpenInNew />
								<span>
									{col.columnLabel}
								</span>
							</a>

						)

					}
				}
			} else if (
				columnMedia === "WP-Image" ||
				columnMedia === "WP-Attachment" ||
				columnMedia === "WP-Audio" ||
				columnMedia === "WP-Video"
			) {
				newColumn.muiTableBodyCellProps = {
					className: columnMedia.toLowerCase() + " " + col.classNames,
					align: col.alignment,
				}
				if (columnMedia === "WP-Image") {
					newColumn.muiTableBodyCellProps.sx = {
						"& img": {
							width: "100%",
							height: "100%",
						}
					}
				}
				newColumn.enableColumnFilter = false
				newColumn.enableSorting = false
				newColumn.enableColumnActions = false
				newColumn.Cell = ({ cell, row }) => {
					log.debug(columnSimpleDataType, cell, row)

					if (
						cell.getValue<string>() === null ||
						cell.getValue<string>() === ""
					) {
						return null
					}

					if (!media[row.id] || !media[row.id][col.columnName]) {
						return null
					}

					return (
						<>
							{
								...media[row.id][col.columnName].map((value: string) => {

									try {

										const mediaObject: any = JSON.parse(value)

										if (!mediaObject?.url) {

											return null

										}

										switch (columnMedia) {

											case "WP-Image":

												return (

													<img
														key={mediaObject.title}
														src={mediaObject.url}
														title={mediaObject.title}
														alt={mediaObject.title}
													/>


												)
											case "WP-Audio":

												return (

													<audio controls>
														<source
															src={mediaObject.url}
															type={mediaObject.mime_type}
														/>
													</audio>

												)

											case "WP-Video":

												return (

													<video controls>
														<source
															src={mediaObject.url}
															type={mediaObject.mime_type}
														/>
													</video>

												)

											default: {

												// WP-Attachment
												const mime_type = mediaObject.mime_type.split("/")

												return (

													<a
														href={mediaObject.url}
														title={mediaObject.title}
														target="_blank"
													>
														<div className="pp-attachment-icon">
															{mime_type[0] === "image" && <FaImage />}
															{mime_type[0] === "audio" && <FaMusic />}
															{mime_type[0] === "video" && <FaFilm />}
															{mime_type[0] === "application" ? mime_type[1] === "pdf" ? <FaFilePdf /> : <FaMedapps /> : <></>}
														</div>
														<div className="pp-attachment-link">
															{mediaObject.title}
														</div>
													</a>

												)

											}
										}

									} catch (error) {

										log.error("Invalid media properties", error)

										return (

											<Tooltip title="Error reading media! Check console...">
												<span>
													<MdError />
												</span>
											</Tooltip>

										)

									}

								})
							}
						</>
					)
				}
			} else {
				// Default column
				if (
					columnDataType?.includes("text")
				) {
					// Add line wrap to multi line columns
					newColumn.muiTableBodyCellProps = {
						className: col.classNames,
						align: col.alignment,
						sx: {
							whiteSpace: "pre-wrap",
						}
					}
				}
				newColumn.Cell = ({ cell, renderedCellValue }) => {
					log.debug(columnSimpleDataType, cell, renderedCellValue)


					return (
						<>
							{renderedCellValue}
						</>
					)
				}
			}

			// Add column
			columnDefs.push(newColumn)
		}

		return columnDefs

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		metaData
		, tableColumns
		, media
	])
	log.debug("columnDef", columnDef)


	const table: MRT_TableInstance<MRT_RowData> = useMaterialReactTable({
		columns: columnDef,
		data: data?.data ?? [],
		rowCount: data?.meta?.rowCount ?? 0,
		initialState: {
			density: storeTableSettings.design.density.default,
			columnPinning: {
				left: [
					"mrt-row-actions"
				]
			},

		},
		state: {
			pagination,
			sorting,
			globalFilter,
			isLoading,
			showAlertBanner: isError,
			showProgressBars: isRefetching,
			columnOrder: ["mrt-row-actions", "mrt-row-select"].concat(
				tableColumns.map(column => column.columnName)
			),
		},
		localization: locale,

		enableStickyHeader: false,
		enableColumnOrdering: false,
		enableColumnResizing: false,
		enableColumnPinning: false,
		enableHiding: true,
		layoutMode: "semantic",

		// Toolbars
		enableTopToolbar: true,
		enableBottomToolbar: true,
		enableFullScreenToggle: false,
		renderTopToolbarCustomActions: (() => (
			<Suspense>
				<Toolbar
					table={table}
					metaData={metaData}
					appId={appId}
					dbs={dbs}
					tbl={tbl}
					refetch={refetch}
					showForm={showForm}
				/>
			</Suspense>
		)),
		renderToolbarInternalActions: ({ table }) => (
			<>
				<MRT_ToggleGlobalFilterButton table={table} />
				{
					storeTableSettings.design.density.userCanChange &&
					<MRT_ToggleDensePaddingButton table={table} />
				}
			</>
		),
		muiTopToolbarProps: () => ({
			sx: {
				"& .MuiPaper-root": {
					backgroundColor:
							"inherit"
				}
			}
		}),
		muiToolbarAlertBannerProps: (
			isError
				? {
					color: "error",
					children: "Error loading data",
				}
				: undefined
		),

		// Row actions
		enableRowActions: hasRowActions,
		positionActionsColumn: "first",
		renderRowActions: (({ row, table }) => {
			log.debug(row, table)

			const rowId: any = {}
			metaData.primary_key.map((element: string) => {
				rowId[element] = row.original[element]
			})
			log.debug(rowId)

			return (
				<Suspense>
					<RowActions
						dbs={dbs}
						tbl={tbl}
						metaData={metaData}
						appId={appId}
						showForm={showForm}
						rowId={rowId}
						rowData={row.original}
						refetch={refetch}
					/>
				</Suspense>
			)
		}),
		displayColumnDefOptions: ({
			"mrt-row-actions": {
				minSize: 0,
				size: (Number(canView) + Number(canUpdate) + Number(canDelete)) * 40,
				maxSize: (Number(canView) + Number(canUpdate) + Number(canDelete)) * 40,
				muiTableBodyCellProps: {
					sx: {
						backgroundColor:
								'inherit',
						maxWidth: "0 !important",
						width: "0 !important",
					}
				},
				enableHiding: true,
			},
			"mrt-row-select": {
				minSize: 0,
				size: 40,
				maxSize: 40,
				enableHiding: true,
			}
		}),
		renderColumnActionsMenuItems: ({ internalColumnMenuItems }) => {
			// Remove column hiding from column actions
			const menuItems =
				internalColumnMenuItems.filter(
					item => (item as any).key !== "11" && (item as any).key !== "12"
				)

			if (menuItems.length === 0) {
				return menuItems
			}

			return [
				...menuItems.slice(0, menuItems.length - 1),
				merge(
					{},
					...menuItems.slice(menuItems.length - 1, menuItems.length),
					{
						props: {
							divider: false
						}
					}
				)
			]
		},

		// Row selection
		enableRowSelection: hasBulkActions,
		enableSelectAll: hasBulkActions,
		muiTableBodyRowProps: (
			({ row }) => ({
				hover: true,
				onClick: row.getToggleSelectedHandler(),
				sx: {
					cursor: "pointer",
				}
			})
		),

		// Pagination
		enablePagination: true,
		manualPagination: true,
		onPaginationChange: setPagination,
		paginationDisplayMode: "default",
		positionPagination: "bottom",
		muiPaginationProps: ({
			rowsPerPageOptions: [5, 10, 15, 20, 25, 30, 50, 100],
			color: "primary",
			shape: "rounded",
			variant: "outlined",
			showRowsPerPage: true,
			showFirstButton: true,
			showLastButton: true,
			className: "test123",
		}),

		// Filtering
		enableFilterMatchHighlighting: !storeTableSettings.searchSettings.forceEnterOnSearch && storeTableSettings.searchSettings.highlightMatches,
		enableGlobalFilterModes: true,
		globalFilterFn: "contains",
		onGlobalFilterChange: setGlobalFilter,

		// Sorting
		manualSorting: true,
		onSortingChange: setSorting,

		// Column actions
		enableColumnActions: true,
		enableSorting: true,

		// Row numbers (views)
		enableRowNumbers: (
			isView(metaData)
		),

		muiTablePaperProps: ({
			sx: {
				zIndex: "999999 !important",
				marginBottom: "2rem",
				display: display ? "block" : "none",
				"& input": {
					"border": "none"
				},
			},
			className: "pp-table"
		}),

		muiTableHeadCellProps: ({
			sx: {
				backgroundColor: "inherit",
				boxShadow: "unset",
			},
		}),
		muiTableBodyProps: ({
			sx: {
				"& tr:nth-of-type(odd)": {
				},
				"& td": {
					boxShadow: "unset"
				},
			},
		}),
		muiBottomToolbarProps: ({
			sx: {
				"& > .MuiBox-root > .MuiBox-root > .MuiBox-root": {
					alignItems: "center",
					paddingTop: 0,
					paddingRight: "10px",
					paddingBottom: 0,
					paddingLeft: 0,
				},
				"& .MuiTypography-root": {
					font: "inherit",
					paddingLeft: "0.5rem",
					paddingRight: "0.5rem",
				},
				"& label.MuiFormLabel-root": {
					transform: "none"
				}
			}
		}),
		muiTableProps: ({
			sx: {
				border: "unset",
				"& th, td": {
					borderTop: "unset",
					borderRight: "unset",
					borderLeft: "unset",
				},
				margin: 0,
			},
		}),
	})
	log.debug(table)

	const getTableColumn = (
		columnName: string
	): StoreTableColumnType | null => {

		for (const column in tableColumns) {
			if (tableColumns[column].columnName === columnName) {
				return tableColumns[column]
			}
		}

		return null

	}


	useEffect(() => {

		// Toggle MRT action column
		const columns = table.getAllColumns()
		if (columns[0].id === "mrt-row-actions") {
			columns[0].toggleVisibility(hasRowActions)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		storeTableSettings.viewLink,
		storeTableSettings.transactions
	])

	useEffect(() => {

		// Toggle row selection
		const columns = table.getAllColumns()
		if (columns[1].id === "mrt-row-select") {
			columns[1].toggleVisibility(hasBulkActions)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		storeTableSettings.bulkActions
	])

	const isDesktop = useMediaQuery("(min-width: 1200px)")
	const isMobile = useMediaQuery("(max-width: 600px)")
	const hideRowSelectionCheckbox = useMediaQuery("(max-width: 900px)")

	useEffect(() => {

		if (storeTableSettings.design.overflow === OverflowEnum.SCROLL) {
			// Toggle columns when scrollbar is enabled or columns are toggled
			const columns = table.getAllColumns()
			for (let i = 0; i < columns.length; i++) {
				const column: StoreTableColumnType | null = getTableColumn(columns[i].id)
				if (column !== null) {
					if (isDesktop) {
						columns[i].toggleVisibility(column.visible ?? false)
					} else if (isMobile) {
						columns[i].toggleVisibility(column.visibleMobile ?? false)
					} else {
						columns[i].toggleVisibility(column.visibleTablet ?? false)
					}
				}
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [storeTableSettings.design.overflow, tableColumns, isDesktop, isMobile])

	const responsiveColumnHiding = (minColumns: number = 1) => {

		const containerWidth = table.refs.tableContainerRef.current.offsetWidth
		const cellPadding =
			table.getState().density === "spacious" ? 40 : (
				table.getState().density === "comfortable" ? 32 : 16
			)
		const extraMargin = 80
		let totalColumnWidth = 0

		const columns = table.getAllColumns()
		for (let i = 0; i < columns.length; i++) {
			const column: StoreTableColumnType | null = getTableColumn(columns[i].id)
			if (column !== null) {
				if (column?.visible === true) {
					totalColumnWidth += columns[i].getSize() + cellPadding
					if (totalColumnWidth + extraMargin > containerWidth) {
						if (i > minColumns) {
							columns[i].toggleVisibility(false)
						}
					} else {
						columns[i].toggleVisibility(true)
					}
				} else {
					columns[i].toggleVisibility(false)
				}
			} else {
				// MRT column toggled in own useEffect hook
				if (
					!hideRowSelectionCheckbox ||
					columns[i]?.id !== "mrt-row-select"
				) {
					totalColumnWidth += columns[i].getSize() + cellPadding
				}
			}
		}

	}

	const [staticColumnNumber] = useState<number>(1 + (hasRowActions ? 1 : 0) + (hasBulkActions ? 1 : 0))
	log.debug("staticColumnNumber", staticColumnNumber)

	useEffect(() => {

		if (hasBulkActions) {
			const columns = table.getAllColumns()
			if (columns[0]?.id === "mrt-row-select") {
				if (hideRowSelectionCheckbox) {
					columns[0].toggleVisibility(false)
				} else {
					columns[0].toggleVisibility(true)
				}
			}
			if (columns[1]?.id === "mrt-row-select") {
				if (hideRowSelectionCheckbox) {
					columns[1].toggleVisibility(false)
				} else {
					columns[1].toggleVisibility(true)
				}
			}
		}

		function resizeHandler() {
			responsiveColumnHiding(staticColumnNumber)
		}

		if (storeTableSettings.design.overflow === OverflowEnum.RESPONSIVE) {
			// Toggle columns when scrollbar is enabled or columns are toggled
			responsiveColumnHiding(staticColumnNumber)

			window.addEventListener(
				"resize",
				resizeHandler
			)
		}

		return () => window.removeEventListener(
			"resize",
			resizeHandler
		)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		table.getState().density,
		storeTableSettings.design.overflow,
		tableColumns,
		hideRowSelectionCheckbox,
		display
	])

	const firstRender = useRef(true)
	useEffect(() => {

		if (firstRender.current) {
			// Prevent refetch on first render
			firstRender.current = false
		} else {
			refetch()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh])


	return (

		<MaterialReactTable
			table={table}
		/>

	)
}

export default TableQuery