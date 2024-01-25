import { useEffect, useMemo, useState } from "react"
import {
	columnAlignment,
	columnOrderable,
	columnQueryable,
	columnVisible,
	columnWidth,
	deleteTableComputeColumn,
	selectTableColumnsById
} from "../../store/tableSlice"
import { RootState, Store } from "../../store/store"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Button, Box, FormLabel, Slider, Accordion, AccordionSummary, AccordionDetails, IconButton } from "@mui/material"
import { DndContext, DragOverlay, MouseSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { getMetaDataColumnIndex } from "../../ts/lib"
import SortableColumn from "../../utils/SortableColumn"
import SortableDragHandle from "../../utils/SortableDragHandle"
import { StoreTableColumnType } from "../../types/StoreTableColumnType"
import { ComputedFieldTypeEnum } from "../../enums/ComputedFieldTypeEnum"
import { ComputedFieldType } from "../../types/ComputedFieldType"
import {
	MdSearch,
	MdExpandMore,
	MdAddCircle,
	MdSort,
	MdOutlineVisibility,
	MdEditNote,
	MdDeleteOutline,
	MdFormatAlignLeft,
	MdFormatAlignRight,
	MdFormatAlignCenter
} from "react-icons/md"
import IconOnOff from "../../utils/IconOnOff"
import Tooltip from "../../utils/Tooltip"
import ConfirmDialog from "../../utils/ConfirmDialog"
import { AlignmentEnum } from "../../enums/AlignmentEnum"
import { FaDatabase, FaSquareRootVariable } from "react-icons/fa6"
import { selectMetaDataById } from "../../store/metaDataSlice"
import log from "loglevel"

type Props = {
	appId: string,
	setIsUpdated: (isUpdated: boolean) => void,
	setComputeFieldOpen: (isComputeFieldOpen: boolean) => void,
	setHasErrors: (hasError: boolean) => void
}

const ColumnSettings = (
	{
		appId,
		setIsUpdated,
		setComputeFieldOpen,
	}: Props
) => {

	log.debug(appId)

	const dispatch = useAppDispatch()
	const sensors = useSensors(useSensor(PointerSensor), useSensor(MouseSensor), useSensor(TouchSensor))

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const metaData: any = selectMetaDataById(Store.getState(), appId)
	log.debug("metaData", metaData)

	const defaultComputedField: ComputedFieldType = {
		label: "",
		type: ComputedFieldTypeEnum.TEXT,
		expression: ""
	}

	const [computedIndex, setComputedIndex] = useState<number>(-1) // -1 = new computed field | > -1 = index existing computed field
	const [computedField, setComputedField] = useState<ComputedFieldType>(defaultComputedField)
	const [computedOpen, setComputedOpen] = useState<boolean>(false)
	const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
	const [confirmIndex, setConfirmIndex] = useState<number | undefined>(undefined)
	log.debug(computedIndex, computedField)

	useEffect(() => {

		setComputeFieldOpen(computedOpen)

	}, [computedOpen, setComputeFieldOpen])

	const tableColumns: Array<string> = useMemo(() => {

		const cols: Array<string> = []

		for (let i = 0; i < metaData.columns.length; i++) {
			cols.push(metaData.columns[i].column_name)
		}

		cols.sort((x, y) => (x > y ? 1 : -1))

		return cols

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [appId])
	log.debug(tableColumns)

	const columns: StoreTableColumnType[] =
		useAppSelector(
			(state: RootState) =>
				selectTableColumnsById(state, appId)
		)
	log.debug("columns", columns)

	const onChangeVisibility = (
		index: number,
		checked: boolean
	): void => {

		log.debug(index, checked)

		dispatch(
			columnVisible({
				appId: appId,
				index: index,
				visible: checked
			})
		)


		setIsUpdated(true)

	}


	const onChangeQueryable = (
		index: number,
		checked: boolean
	): void => {

		log.debug(index, checked)

		dispatch(
			columnQueryable({
				appId: appId,
				index: index,
				queryable: checked
			})
		)


		setIsUpdated(true)

	}

	const onChangeOrderable = (
		index: number,
		checked: boolean
	): void => {

		log.debug(index, checked)

		dispatch(
			columnOrderable({
				appId: appId,
				index: index,
				orderable: checked
			})
		)

		setIsUpdated(true)

	}


	const updateAlignment = (
		index: number,
		alignment: AlignmentEnum,
	) => {

		dispatch(
			columnAlignment({
				appId: appId,
				index: index,
				alignment: alignment
			})
		)

		setIsUpdated(true)

	}


	const deleteComputedField = (
		index: number | undefined
	): void => {

		if (
			index !== undefined
		) {
			dispatch(
				deleteTableComputeColumn({
					appId: appId,
					index: index
				})
			)

			setComputedIndex(-1)
			setComputedField(defaultComputedField)
			setComputedOpen(false)

			setIsUpdated(true)
		}

	}

	const sortableColumns = columns.map(
		(column: StoreTableColumnType) => column.columnName
	)
	log.debug("sortableColumns", sortableColumns)


	const dragHandle = (
		columnName: string,
		columnLabel: string,
		index: number,
	) => {


		return (

			<>
				<Box
					sx={{
						"& svg": {
							visibility: "visible",
							pointerEvents: "none",
							opacity: "0.5",
						}
					}}
				>
					<SortableDragHandle
						id={columnName}
						enabled={false}
					/>
				</Box>

				<Box
					sx={{
						display: "inline-grid",
						gridTemplateColumns: columns[index].computedField !== undefined ? "auto auto" : "auto",
						justifyContent: "start",
						alignItems: "center",
						gap: "10px",
						"& svg": {
							opacity: "0.5",
						}
					}}
				>
					{
						columns[index].computedField !== undefined &&
						<FaSquareRootVariable />
					}
					<FormLabel>
						{columnLabel}
					</FormLabel>
				</Box>
			</>

		)

	}


	return (

		<>
			<DndContext
				autoScroll={true}
				sensors={sensors}
				collisionDetection={closestCenter}
			>

				<SortableContext
					items={sortableColumns}
				>
					{
						sortableColumns.map((columnName: string, index: number) => {
							const columnLabel: string =
								!columns[index].computedField
									? columns[index].columnLabel ?? columnName
									: (
										columns[index].computedField?.label === ""
											? "<No Label>"
											: columns[index].computedField?.label ?? columnName
									)

							const columnIndex: number | undefined = getMetaDataColumnIndex(metaData, columnName)
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const columnMetaData: any =
								columnIndex !== undefined
									? metaData.columns[columnIndex]
									: null



							return (

								<SortableColumn
									key={columnName + index}
									id={columnName}
								>

									<Accordion
										key={index}
										disableGutters={true}
									>

										<AccordionSummary
											className="pp-column-settings"
											expandIcon={<MdExpandMore />}
											sx={{
												justifyContent: "space-between",
											}}
										>

											<Box
												sx={{
													display: "grid",
													gridTemplateColumns: "auto 1fr",
													alignItems: "center",
													"& svg": {
														display: "flex",
													}
												}}
											>
												{
													dragHandle(
														columnName,
														columnLabel,
														index
													)
												}
											</Box>

											<div
												style={{
													display: "grid",
													gridTemplateColumns: "40px 40px 40px 40px"
												}}
											>
												<Tooltip title="Visible" position="bottom">
													<IconButton
														onClick={(event: React.MouseEvent): void => {
															onChangeVisibility(index, !columns[index].visible)
															event.stopPropagation()
														}}
													>
														<IconOnOff
															checked={columns[index].visible}
														>
															<MdOutlineVisibility />
														</IconOnOff>
													</IconButton>
												</Tooltip>

												{
													!columns[index].computedField

														?

														<Tooltip title="Searchable" position="bottom">
															<IconButton
																onClick={(event: React.MouseEvent): void => {
																	onChangeQueryable(index, !columns[index].queryable)
																	event.stopPropagation()
																}}
															>
																<IconOnOff
																	checked={columns[index].queryable}
																	alignRight={false}
																>
																	<MdSearch />
																</IconOnOff>
															</IconButton>
														</Tooltip>

														:

														<Tooltip title="Edit" position="bottom">
															<IconButton
																onClick={(event: React.MouseEvent): void => {
																	event.stopPropagation()
																}}
															>
																<MdEditNote />
															</IconButton>
														</Tooltip>
												}

												{
													!columns[index].computedField

														?

														<Tooltip title="Sortable" position="bottom">
															<IconButton
																onClick={(event: React.MouseEvent): void => {
																	onChangeOrderable(index, !columns[index].orderable)
																	event.stopPropagation()
																}}
															>
																<IconOnOff
																	checked={columns[index].orderable}
																>
																	<MdSort />
																</IconOnOff>
															</IconButton>
														</Tooltip>

														:

														<Tooltip title="Delete" position="bottom">
															<IconButton
																onClick={(event: React.MouseEvent): void => {
																	setConfirmIndex(index)
																	setConfirmDelete(true)
																	event.stopPropagation()
																}}
															>
																<MdDeleteOutline />
															</IconButton>
														</Tooltip>
												}

												<Tooltip title="Alignment" position="bottom">
													<IconButton
														onClick={(event: React.MouseEvent): void => {
															if (columns[index].alignment === AlignmentEnum.LEFT) {
																updateAlignment(index, AlignmentEnum.CENTER)
															} else if (columns[index].alignment === AlignmentEnum.CENTER) {
																updateAlignment(index, AlignmentEnum.RIGHT)
															} else if (columns[index].alignment === AlignmentEnum.RIGHT) {
																updateAlignment(index, AlignmentEnum.LEFT)
															}
															setIsUpdated(true)

															event.stopPropagation()
														}}
													>
														{
															columns[index].alignment === AlignmentEnum.LEFT &&
															<MdFormatAlignLeft />
														}
														{
															columns[index].alignment === AlignmentEnum.CENTER &&
															<MdFormatAlignCenter />
														}
														{
															columns[index].alignment === AlignmentEnum.RIGHT &&
															<MdFormatAlignRight />
														}
													</IconButton>
												</Tooltip>

											</div>

										</AccordionSummary>

										<AccordionDetails>


											<Box
												sx={{
													margin: "2rem 1rem"
												}}
											>
												<FormLabel>
													Width
												</FormLabel>
												<Box
													sx={{
														display: "grid",
														gridTemplateColumns: "1fr auto",
														gridGap: "30px",
														alignItems: "center",
													}}
												>
													<Slider
														min={60}
														max={420}
														step={1}
														value={columns[index].width}
														marks={[
															{
																value: 60,
																label: "60"
															},
															{
																value: 120,
																label: "120"
															},
															{
																value: 180,
																label: "180"
															},
															{
																value: 240,
																label: "240"
															},
															{
																value: 300,
																label: "320"
															},
															{
																value: 360,
																label: "360"
															},
															{
																value: 420,
																label: "420"
															},
														]}
														valueLabelDisplay="auto"
														onChange={(event: Event, value: number | number[]) => {
															dispatch(
																columnWidth({
																	appId: appId,
																	index: index,
																	width: value
																})
															)
															setIsUpdated(true)

															event.stopPropagation()
														}}
													/>
													<span>px</span>
												</Box>
											</Box>

											<Box>

												{
													columnMetaData !== null &&

													<Accordion
														disableGutters={true}
													>
														<AccordionSummary
															expandIcon={<MdExpandMore />}
															sx={{
																fontSize: "1rem",
																"& .MuiAccordionSummary-content": {
																	padding: "1rem",
																	alignItems: "center",
																}
															}}
														>
															<FaDatabase />
															<span style={{ paddingLeft: "0.5rem" }}>
																Column meta data
															</span>
														</AccordionSummary>


														<AccordionDetails
															sx={{
																display: "grid",
															}}
														>
															<Box
																sx={{
																	marginTop: "1rem",
																	display: "grid",
																	gridTemplateColumns: "auto auto",
																	gap: "10px",
																	justifyContent: "left",
																	alignItems: "center",
																}}
															>
																<div>Column name</div>
																<div><strong>{columnMetaData.column_name}</strong></div>

																<div>Data type</div>
																<div><strong>{columnMetaData.column_type}</strong></div>

																<div>Is nullable</div>
																<div><strong>{columnMetaData.is_nullable}</strong></div>

																<div>Default value</div>
																<div><strong>{columnMetaData.column_default ?? "null"}</strong></div>

																{
																	columnMetaData.extra !== "" &&

																	<>
																		<div></div>
																		<div><strong>{columnMetaData.extra}</strong></div>
																	</>
																}
															</Box>
														</AccordionDetails>

													</Accordion>
												}

											</Box>

										</AccordionDetails>

									</Accordion>

								</SortableColumn>

							)

						})

					}

					<DragOverlay></DragOverlay>

				</SortableContext>

				<Box
					sx={{
						padding: "15px 15px 25px 5px",
						marginBottom: "5px",
						textAlign: "right"
					}}
				>
					<Button
						variant="contained"
						startIcon={<MdAddCircle />}
						disabled={true}
						onClick={() => {
						}}
					>
						Computed Field
					</Button>

				</Box>


			</DndContext>

			<ConfirmDialog
				title="Delete computed field?"
				message="Are you sure you want to delete this computed field? This action cannot be undone!"
				open={confirmDelete}
				setOpen={setConfirmDelete}
				onConfirm={() => deleteComputedField(confirmIndex)}
			/>
		</>

	)

}

export default ColumnSettings