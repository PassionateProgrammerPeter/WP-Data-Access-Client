import { useEffect, useState } from "react"
import { RootState, Store } from "../../store/store"
import {
	columnUpdateble,
	columnVisible,
	selectFormColumnsById,
	selectFormSettingsById,
	deleteFormComputeColumn,
	columnAlignment,
} from "../../store/formSlice"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Box, Button, FormLabel, Accordion, AccordionSummary, AccordionDetails, IconButton } from "@mui/material"
import { DndContext, DragOverlay, MouseSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import SortableColumn from "../../utils/SortableColumn"
import SortableDragHandle from "../../utils/SortableDragHandle"
import Tooltip from "../../utils/Tooltip"
import { getMetaDataColumnIndex } from "../../ts/lib"
import { StoreFormColumnType } from "../../types/StoreFormColumnType"
import { StoreFormDetailsType } from "../../types/StoreFormDetailsType"
import { ComputedFieldType } from "../../types/ComputedFieldType"
import { ComputedFieldTypeEnum } from "../../enums/ComputedFieldTypeEnum"
import { MdVisibility, MdExpandMore, MdAddCircle, MdEdit, MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdDeleteOutline } from "react-icons/md"
import IconOnOff from "../../utils/IconOnOff"
import { selectMetaDataById } from "../../store/metaDataSlice"
import { FaDatabase, FaSquareRootVariable } from "react-icons/fa6"
import { AlignmentEnum } from "../../enums/AlignmentEnum"
import ConfirmDialog from "../../utils/ConfirmDialog"
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
	const [deleteIndex, setDeleteIndex] = useState<number | undefined>()
	log.debug(computedIndex, computedField)

	useEffect(() => {

		setComputeFieldOpen(computedOpen)

	}, [computedOpen, setComputeFieldOpen])

	const formSettings: StoreFormDetailsType =
		useAppSelector(
			(state: RootState) =>
				selectFormSettingsById(state, appId)
		)
	log.debug("formSettings", formSettings)

	const columns: StoreFormColumnType[] =
		useAppSelector(
			(state: RootState) =>
				selectFormColumnsById(state, appId)
		)
	log.debug("columns", columns)

	const sortableColumns: string[] =
		columns.map(
			(column: StoreFormColumnType) => column.columnName
		)
	log.debug("sortableColumns", sortableColumns)


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

	const onChangeUpdate = (
		index: number,
		checked: boolean
	): void => {

		log.debug(index, checked)

		dispatch(
			columnUpdateble({
				appId: appId,
				index: index,
				updatable: checked
			})
		)

		setIsUpdated(true)

	}


	const deleteComputedField = (
		index: number | undefined
	): void => {

		if (index !== undefined) {

			dispatch(
				deleteFormComputeColumn({
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

		<DndContext
			autoScroll={true}
			sensors={sensors}
			collisionDetection={closestCenter}
		>

			<SortableContext
				items={sortableColumns}
			>

				{
					sortableColumns.map((column: string, index: number) => {
						const columnName = column
						const isComputedField =
							columns[index].computedField !== undefined

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
								key={index}
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

										<Box
											style={{
												display: "grid",
												gridTemplateColumns: "40px 40px 40px"
											}}
										>
											<Tooltip title="Visible" position="bottom">
												<IconButton
													onClick={(event: React.MouseEvent): void => {
														onChangeVisibility(index, !columns[index]?.visible)
														event.stopPropagation()
													}}
												>
													<IconOnOff
														checked={columns[index]?.visible}
													>
														<MdVisibility />
													</IconOnOff>
												</IconButton>
											</Tooltip>


											{
												!isComputedField

													?

													<Tooltip title="Updatable" position="bottom">
														<IconButton
															onClick={(event: React.MouseEvent): void => {
																onChangeUpdate(index, !columns[index]?.updatable)
																event.stopPropagation()
															}}
														>
															<IconOnOff
																checked={columns[index]?.updatable}
															>
																<MdEdit />
															</IconOnOff>
														</IconButton>
													</Tooltip>

													:

																<Tooltip title="Delete" position="bottom">
																	<IconButton
																		onClick={(event: React.MouseEvent): void => {
																			setConfirmDelete(true)
																			setDeleteIndex(index)
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
															dispatch(
																columnAlignment({
																	appId,
																	index,
																	alignment: AlignmentEnum.CENTER
																})
															)
														} else if (columns[index].alignment === AlignmentEnum.CENTER) {
															dispatch(
																columnAlignment({
																	appId,
																	index,
																	alignment: AlignmentEnum.RIGHT
																})
															)
														} else if (columns[index].alignment === AlignmentEnum.RIGHT) {
															dispatch(
																columnAlignment({
																	appId,
																	index,
																	alignment: AlignmentEnum.LEFT
																})
															)
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

										</Box>

									</AccordionSummary>

									<AccordionDetails>

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
						setComputedIndex(-1)
						setComputedField(defaultComputedField)
						setComputedOpen(true)
					}}
				>
					Computed Field
				</Button>
			</Box>


			<ConfirmDialog
				title="Delete computed field?"
				message="Are you sure you want to delete this computed field? This action cannot be undone!"
				open={confirmDelete}
				setOpen={setConfirmDelete}
				onConfirm={() => deleteComputedField(deleteIndex)}
			/>

		</DndContext >

	)

}

export default ColumnSettings