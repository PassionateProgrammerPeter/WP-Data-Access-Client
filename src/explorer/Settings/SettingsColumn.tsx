/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, AccordionDetails, AccordionSummary, Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { MdExpandMore } from "react-icons/md"
import { TablePropsType } from "../../types/TablePropsType"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import log from "loglevel"
import { selectManagerMetaData, selectManagerSettings, updateSettings } from "../../store/managerSlice"
import { ManagerSettingsType } from "../../types/ManagerSettingsType"
import { useState } from "react"

type Props = TablePropsType & {
	setIsUpdated: (isUpdated: boolean) => void,
}

const SettingsColumn = (
	{
		dbs,
		tbl,
		setIsUpdated,
	}: Props
) => {

	log.debug(dbs, tbl)

	const dispatch = useAppDispatch()

	const metaData: any =
		useAppSelector(
			(state: RootState) =>
				selectManagerMetaData(state)
		)
	log.debug(metaData)

	const managerSettings: ManagerSettingsType | undefined =
		useAppSelector(
			(state: RootState) =>
				selectManagerSettings(state)
		)
	log.debug(managerSettings)

	const [expanded, setExpanded] = useState<string>("")

	const setTabelLabel = (
		columnName: string,
		label: string,
	) => {

		const settings: ManagerSettingsType = {
			...managerSettings,
			list_labels: {
				...managerSettings.list_labels,
				[columnName]: label
			}
		}

		dispatch(
			updateSettings({
				settings: settings
			})
		)

		setIsUpdated(true)

	}

	const setFormLabel = (
		columnName: string,
		label: string,
	) => {

		const settings: ManagerSettingsType = {
			...managerSettings,
			form_labels: {
				...managerSettings.form_labels,
				[columnName]: label
			}
		}

		dispatch(
			updateSettings({
				settings: settings
			})
		)

		setIsUpdated(true)

	}

	const setColumnMedia = (
		columnName: string,
		mediaType: string,
	) => {

		const settings: ManagerSettingsType = {
			...managerSettings,
			column_media: {
				...managerSettings.column_media,
				[columnName]: mediaType
			}
		}

		dispatch(
			updateSettings({
				settings: settings
			})
		)

		setIsUpdated(true)

	}

	return (

		<Accordion
			disableGutters={true}
		>
			<AccordionSummary expandIcon={<MdExpandMore />}>
				Column Settings
			</AccordionSummary>

			<AccordionDetails>
				<Box
					sx={{
						display: "grid",
						gridGap: "10px",
						marginBottom: "20px",
					}}
				>
					<Box>
						{
							...metaData?.columns?.map((data: any, index: number) => {
								const columnName: string = data.column_name

								return (

									<Accordion
										expanded={expanded === columnName}
										onChange={() => {
											if (expanded === columnName) {
												setExpanded("")
											} else {
												setExpanded(columnName)
											}
										}}
										sx={{
											"&.MuiPaper-root.MuiPaper-elevation.Mui-expanded": {
												margin: 0,
											},
										}}
									>
										<AccordionSummary
											expandIcon={<MdExpandMore />}
										>
											{data.column_name}
										</AccordionSummary>

										<AccordionDetails
											sx={{
												display: "grid",
												gridGap: "10px",
											}}
										>
											<TextField
												label="Table label"
												value={managerSettings.list_labels[columnName]}
												variant="outlined"
												onChange={(event) => {
													setTabelLabel(
														columnName,
														event.target.value
													)
												}}
											/>

											<TextField
												label="Form label"
												value={managerSettings.form_labels[columnName]}
												variant="outlined"
												onChange={(event) => {
													setFormLabel(
														columnName,
														event.target.value
													)
												}}
											/>

											<FormControl>
												<InputLabel
													id={"media_type_label" + index}
													variant="outlined"
												>
													Media type
												</InputLabel>
												<Select
													labelId={"media_type_label" + index}
													id={"media_type" + index}
													label="Media type"
													value={managerSettings.column_media[columnName] ?? ""}
													variant="outlined"
													onChange={(event: SelectChangeEvent<any>) => {
														setColumnMedia(
															columnName,
															event.target.value
														)

														event.stopPropagation()
													}}
												>
													<MenuItem key="" value="">&nbsp;</MenuItem>
													<MenuItem key="Attachment" value="Attachment">Attachment</MenuItem>
													<MenuItem key="Audio" value="Audio">Audio</MenuItem>
													<MenuItem key="Hyperlink" value="Hyperlink">Hyperlink</MenuItem>
													<MenuItem key="Image" value="Image">Image</MenuItem>
													<MenuItem key="ImageURL" value="ImageURL">ImageURL</MenuItem>
													<MenuItem key="Video" value="Video">Video</MenuItem>
												</Select>
											</FormControl>
										</AccordionDetails>
									</Accordion>

								)
							})
						}
					</Box>
				</Box>

				<FormHelperText>
					Default column labels and column media types
				</FormHelperText>
			</AccordionDetails>
		</Accordion>

	)

}

export default SettingsColumn