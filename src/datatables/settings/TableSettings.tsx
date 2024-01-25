// import { useEffect, useState } from "react"
import { RootState, Store } from "../../store/store"
import { tableSettings, selectTableSettingsById, selectTableColumnsById } from "../../store/tableSlice"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Box, Switch, Accordion, AccordionSummary, AccordionDetails, Radio, RadioGroup, FormControlLabel, FormControl, FormHelperText } from "@mui/material"
import { StoreTableSettingsType } from "../../types/StoreTableSettingsType"
import { ProcessingEnum } from "../../enums/ProcessingEnum"
import { StoreTableColumnType } from "../../types/StoreTableColumnType"
import { OverflowEnum } from "../../enums/OverflowEnum"
import { MdExpandMore } from "react-icons/md"
import { DensityEnum } from "../../enums/DensityEnum"
import { isView } from "../../ts/lib"
import { selectMetaDataById } from "../../store/metaDataSlice"
import log from "loglevel"
import "../css/settings.css"

type Props = {
	appId: string,
	setIsUpdated: (isUpdated: boolean) => void
}

const TableSettings = (
	{
		appId,
		setIsUpdated
	}: Props) => {

	log.debug(appId)

	const dispatch = useAppDispatch()

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const metaData: any = selectMetaDataById(Store.getState(), appId)
	log.debug("metaData", metaData)

	const storeTableSettings: StoreTableSettingsType =
		useAppSelector(
			(state: RootState) =>
				selectTableSettingsById(state, appId)
		)
	log.debug("storeTableSettings", storeTableSettings)

	const columnsStore: StoreTableColumnType[] =
		useAppSelector(
			(state: RootState) =>
				selectTableColumnsById(state, appId)
		)
	log.debug("columnsStore", columnsStore)

	const storeColumnSettings: StoreTableColumnType[] =
			columnsStore.filter((column: StoreTableColumnType) => column.computedField !== undefined)
	log.debug("storeColumnSettings", storeColumnSettings)

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const setProperty = (obj: any, path: string, value: any): any => {
		const [head, ...rest] = path.split('.')

		return {
			...obj,
			[head]: rest.length
				? setProperty(obj[head], rest.join('.'), value)
				: value
		}
	}

	const updateTableSettings = (
		path: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any
	): void => {

		log.debug(path, value)

		const newTableSettings = setProperty(storeTableSettings, path, value)

		log.debug(newTableSettings)

		dispatch(
			tableSettings({
				appId: appId,
				tableSettings: newTableSettings
			})
		)

		setIsUpdated(true)

	}


	return (

		<>

			<Accordion
				sx={{
					display: "none"
				}}
				disableGutters={true}
			>
				<AccordionSummary expandIcon={<MdExpandMore />}>
					Processing
				</AccordionSummary>

				<AccordionDetails>

					<FormControl>
						<RadioGroup
							sx={{
								flexDirection: "row"
							}}
						>
							<FormControlLabel
								control={
									<Radio
										checked={storeTableSettings?.processing === ProcessingEnum.SERVERSIDE}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											updateTableSettings(
												"processing",
												ProcessingEnum.SERVERSIDE
											)

											event.stopPropagation()
										}}
									/>
								}
								key="serverside"
								value="serverside"
								label="Server-side"
							/>

							<FormControlLabel
								control={
									<Radio
										checked={storeTableSettings?.processing === ProcessingEnum.CLIENTSIDE}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											updateTableSettings(
												"processing",
												ProcessingEnum.CLIENTSIDE
											)

											event.stopPropagation()
										}}
									/>
								}
								key="clientside"
								value="clientside"
								label="Client-side"
							/>
						</RadioGroup>
					</FormControl>
					<FormHelperText>Use server-side for large tables and views, use client-side for quick analyses of small tables and views</FormHelperText>

				</AccordionDetails>
			</Accordion>

			<Accordion
				disableGutters={true}
				defaultExpanded={false}
			>
				<AccordionSummary expandIcon={<MdExpandMore />}>
					Responsiveness
				</AccordionSummary>

				<AccordionDetails>

					<FormControl>
						<RadioGroup
							sx={{
								flexDirection: "row"
							}}
						>
							<FormControlLabel
								control={
									<Radio
										checked={storeTableSettings?.design?.overflow === OverflowEnum.RESPONSIVE}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											updateTableSettings(
												"design.overflow",
												OverflowEnum.RESPONSIVE
											)

											event.stopPropagation()
										}}
									/>
								}
								key="responsive"
								value="responsive"
								label="Auto column hiding"
							/>

							<FormControlLabel
								control={
									<Radio
										checked={storeTableSettings?.design?.overflow !== OverflowEnum.RESPONSIVE}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											updateTableSettings(
												"design.overflow",
												OverflowEnum.SCROLL
											)

											event.stopPropagation()
										}}
									/>
								}
								key="scroll"
								value="scroll"
								label="Horizontal scrollbar"
							/>
						</RadioGroup>
					</FormControl>
					<FormHelperText>
						Behaviour when table content overflows available space
					</FormHelperText>

				</AccordionDetails>
			</Accordion>


			<Accordion
				disableGutters={true}
			>
				<AccordionSummary expandIcon={<MdExpandMore />}>
					Row actions
				</AccordionSummary>

				<AccordionDetails>

					<Box
						sx={{
							display: "grid"
						}}
					>
						<FormControl>
							<FormControlLabel
								control={
									<Switch
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										disabled={!metaData?.privs?.insert}
										checked={storeTableSettings?.transactions?.insert}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											updateTableSettings(
												"transactions.insert",
												checked
											)

											event.stopPropagation()
										}}
									/>
								}
								label="Allow insert"
							/>
						</FormControl>
						<FormHelperText>Adds an insert button to the table toolbar</FormHelperText>

						<FormControl>
							<FormControlLabel
								control={
									<Switch
										checked={storeTableSettings?.viewLink}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											updateTableSettings(
												"viewLink",
												checked
											)

											event.stopPropagation()
										}}
									/>
								}
								label="Allow viewing"
							/>
						</FormControl>
						<FormHelperText>Adds a view icon to each row</FormHelperText>

						<FormControl>
							<FormControlLabel
								control={
									<Switch
										checked={storeTableSettings?.transactions?.update}
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										disabled={!metaData?.privs?.update}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											updateTableSettings(
												"transactions.update",
												checked
											)

											event.stopPropagation()
										}}
									/>
								}
								label="Allow update"
							/>
						</FormControl>
						<FormHelperText>Adds an update icon to each table row</FormHelperText>

						<FormControl>
							<FormControlLabel
								control={
									<Switch
										checked={storeTableSettings?.transactions?.delete}
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										disabled={!metaData?.privs?.delete}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											updateTableSettings(
												"transactions.delete",
												checked
											)

											event.stopPropagation()
										}}
									/>
								}
								label="Allow delete"
							/>
						</FormControl>
						<FormHelperText>Adds a delete icon to each table row</FormHelperText>
					</Box>
				</AccordionDetails>
			</Accordion>

			<Accordion
				disableGutters={true}
			>
				<AccordionSummary expandIcon={<MdExpandMore />}>
					Bulk actions
				</AccordionSummary>

				<AccordionDetails>

					<Box
						sx={{
							display: "grid"
						}}
					>

						<FormControl>
							<FormControlLabel
								control={
									<Switch
										checked={!isView(metaData) && storeTableSettings?.bulkActions?.csv}
										disabled={isView(metaData)}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											updateTableSettings(
												"bulkActions.csv",
												checked
											)

											event.stopPropagation()
										}}
									/>
								}
								label="Export to CSV"
							/>
						</FormControl>

						<FormControl>
							<FormControlLabel
								control={
									<Switch
										checked={!isView(metaData) && storeTableSettings?.bulkActions?.json}
										disabled={isView(metaData)}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											updateTableSettings(
												"bulkActions.json",
												checked
											)

											event.stopPropagation()
										}}
									/>
								}
								label="Export to JSON"
							/>
						</FormControl>


						<FormControl>
							<FormControlLabel
								control={
									<Switch
										checked={!isView(metaData) && storeTableSettings?.bulkActions?.xml}
										disabled={isView(metaData)}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											updateTableSettings(
												"bulkActions.xml",
												checked
											)

											event.stopPropagation()
										}}
									/>
								}
								label="Export to XML"
							/>
						</FormControl>

						<FormControl>
							<FormControlLabel
								control={
									<Switch
										checked={!isView(metaData) && storeTableSettings?.bulkActions?.sql}
										disabled={isView(metaData)}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											updateTableSettings(
												"bulkActions.sql",
												checked
											)

											event.stopPropagation()
										}}
									/>
								}
								label="Export to SQL"
							/>
						</FormControl>

						<FormControl>
							<FormControlLabel
								control={
									<Switch
										checked={!isView(metaData) && storeTableSettings?.bulkActions?.delete}
										disabled={isView(metaData)}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											updateTableSettings(
												"bulkActions.delete",
												checked
											)

											event.stopPropagation()
										}}
									/>
								}
								label="Delete"
							/>
						</FormControl>
					</Box>

					<FormHelperText
						sx={{
							marginTop: "10px"
						}}
					>
						Added to menu button
					</FormHelperText>

				</AccordionDetails>

			</Accordion>


			{/* <Accordion
				disableGutters={true}
			>
				<AccordionSummary expandIcon={<MdExpandMore />}>
					Advanced Search
				</AccordionSummary>

				<AccordionDetails>

					<Box
						sx={{
							marginTop: "20px",
							display: "grid",
							gap: "20px"
						}}
					>
						<Box>
							<FormControlLabel
								control={
									<Switch
										checked={storeTableSettings?.advancedSearch?.searchPanes?.enabled}
										disabled={true}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											if (false) {
												updateTableSettings(
													"advancedSearch.searchPanes.enabled",
													checked
												)
											}

											log.debug(checked)
											event.stopPropagation()
										}}
									/>
								}
								label="Enable search panes"
							/>

							<FormHelperText>
								Quickly filter table data based on columns values
							</FormHelperText>
						</Box>

						<Autocomplete
							multiple
							disablePortal
							disabled={storeTableSettings?.advancedSearch?.searchPanes?.enabled !== true}
							options={searchPaneColumns}
							getOptionLabel={(option) => option}
							value={storeTableSettings?.advancedSearch?.searchPanes?.columns}
							fullWidth
							onChange={(_event, newInputValue) => {
								dispatch(
									searchPanes({
										appId: appId,
										columns: newInputValue
									})
								)

								setIsUpdated(true)

							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Add columns to search panes..."
								/>
							)}
						/>

						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: " auto auto",
								justifyContent: "space-between",
								alignItems: "center"
							}}
						>
							<RadioGroup
								sx={{
									flexDirection: "row"
								}}
							>
								<FormControlLabel
									control={
										<Radio
											disabled={true}
											checked={
												storeTableSettings?.advancedSearch?.searchPanes?.orientation === PaneOrientationEnum.HORIZONTAL
											}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
												if (false) {
													updateTableSettings(
														"advancedSearch.searchPanes.orientation",
														PaneOrientationEnum.HORIZONTAL
													)
												}

												event.stopPropagation()
											}}
										/>
									}
									key="horizontal"
									value="horizontal"
									label="Horizontal"
								/>

								<FormControlLabel
									control={
										<Radio
											disabled={true}
											checked={
												storeTableSettings?.advancedSearch?.searchPanes?.orientation === PaneOrientationEnum.VERTICAL
											}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
												if (false) {
													updateTableSettings(
														"advancedSearch.searchPanes.orientation",
														PaneOrientationEnum.VERTICAL
													)
												}

												event.stopPropagation()
											}}
										/>
									}
									key="vertical"
									value="vertical "
									label="Vertical"
								/>
							</RadioGroup>

							<FormControlLabel
								sx={{
									marginRight: 0
								}}
								control={
									<Switch
										disabled={true}
										checked={storeTableSettings?.advancedSearch?.searchPanes?.cascade}
										onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
											if (false) {
												updateTableSettings(
													"advancedSearch.searchPanes.cascade",
													checked
												)
											}

											log.debug(checked)
											event.stopPropagation()
										}}
									/>
								}
								label="Cascade"
							/>
						</Box>
					</Box>

				</AccordionDetails>
			</Accordion> */}

			<Accordion
				disableGutters={true}
				defaultExpanded={false}
			>
				<AccordionSummary expandIcon={<MdExpandMore />}>
					Spacing
				</AccordionSummary>

				<AccordionDetails>
					<FormControl>
						<RadioGroup
							sx={{
								display: "grid",
								gridTemplateColumns: "auto auto auto",
								alignItems: "center"
							}}
						>
							<FormControlLabel
								control={
									<Radio
										checked={storeTableSettings?.design.density.default === DensityEnum.COMPACT}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											updateTableSettings(
												"design.density.default",
												DensityEnum.COMPACT
											)

											event.stopPropagation()
										}}
									/>
								}
								key="compact"
								value="compact"
								label="Compact"
							/>

							<FormControlLabel
								control={
									<Radio
										checked={storeTableSettings?.design.density.default === DensityEnum.COMFORTABLE}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											updateTableSettings(
												"design.density.default",
												DensityEnum.COMFORTABLE
											)

											event.stopPropagation()
										}}
									/>
								}
								key="comfortable"
								value="comfortable"
								label="Comfortable"
							/>

							<FormControlLabel
								control={
									<Radio
										checked={storeTableSettings?.design.density.default === DensityEnum.SPACIOUS}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											updateTableSettings(
												"design.density.default",
												DensityEnum.SPACIOUS
											)

											event.stopPropagation()
										}}
									/>
								}
								key="spacious"
								value="spacious"
								label="Spacious"
							/>
						</RadioGroup>
					</FormControl>
					<FormHelperText>
						Default spacing on page load
					</FormHelperText>

					<FormControl
						sx={{
							marginTop: "20px"
						}}
					>
						<FormControlLabel
							control={
								<Switch
									checked={storeTableSettings?.design.density.userCanChange}
									onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
										updateTableSettings(
											"design.density.userCanChange",
											checked
										)

										event.stopPropagation()
									}}
								/>
							}
							label="Allow user to change spacing"
						/>
					</FormControl>
				</AccordionDetails>
			</Accordion>


		</>

	)

}

export default TableSettings