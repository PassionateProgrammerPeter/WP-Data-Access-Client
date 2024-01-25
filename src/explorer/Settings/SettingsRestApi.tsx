/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, AccordionDetails, AccordionSummary, Box, FormControlLabel, FormHelperText, Switch } from "@mui/material"
import { MdExpandMore, MdWarning } from "react-icons/md"
import { TablePropsType } from "../../types/TablePropsType"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import SettingsRestApiAction from "./SettingsRestApiAction"
import { restApiOff, restApiOn, selectManagerSettings } from "../../store/managerSlice"
import { ManagerSettingsType } from "../../types/ManagerSettingsType"
import { DatabaseType } from "../../types/DatabaseType"
import { selectSelected } from "../../store/explorerSlice"
import log from "loglevel"
import { TableTypeEnum } from "../../enums/TableTypeEnum"
import { useState } from "react"

type Props = TablePropsType & {
	typ: TableTypeEnum,
	metaData: any,
	setIsUpdated: (isUpdated: boolean) => void,
}

const SettingsRestApi = (
	{
		dbs,
		tbl,
		typ,
		metaData,
		setIsUpdated,
	}: Props
) => {

	log.debug(dbs, tbl, typ, metaData)

	const dispatch = useAppDispatch()

	const managerSettings: ManagerSettingsType | undefined =
		useAppSelector(
			(state: RootState) =>
				selectManagerSettings(state)
		)
	log.debug(managerSettings)

	const selectedDatabases: DatabaseType =
		useAppSelector(
			(state: RootState) =>
				selectSelected(state)
		)
	log.debug(selectedDatabases)

	const [expanded, setExpanded] = useState<string>("")

	return (

		<Accordion
			disableGutters={true}
		>
			<AccordionSummary expandIcon={<MdExpandMore />}>
				REST API
			</AccordionSummary>

			<AccordionDetails>
				<Box>
					<FormControlLabel
						control={
							<Switch
								checked={managerSettings.rest_api !== null}
								onClick={(event: React.MouseEvent): void => {
									if (managerSettings.rest_api !== null) {
										dispatch(
											restApiOff({})
										)
									} else {
										dispatch(
											restApiOn({})
										)
									}

									setIsUpdated(true)
									event.stopPropagation()
								}}
							/>
						}
						label="Enable REST API"
						labelPlacement="end"
					/>

					{
						managerSettings.rest_api !== null &&

						<Box
							sx={{
								marginTop: "20px",
							}}
						>
							<SettingsRestApiAction
								dbs={dbs}
								tbl={tbl}
								action="select"
								setIsUpdated={setIsUpdated}
								expanded={expanded}
								setExpanded={setExpanded}
							/>
							{
								typ === TableTypeEnum.TABLE &&

								<>
									<SettingsRestApiAction
										dbs={dbs}
										tbl={tbl}
										action="insert"
										setIsUpdated={setIsUpdated}
										expanded={expanded}
										setExpanded={setExpanded}
									/>
									<SettingsRestApiAction
										dbs={dbs}
										tbl={tbl}
										action="update"
										setIsUpdated={setIsUpdated}
										expanded={expanded}
										setExpanded={setExpanded}
									/>
									<SettingsRestApiAction
										dbs={dbs}
										tbl={tbl}
										action="delete"
										setIsUpdated={setIsUpdated}
										expanded={expanded}
										setExpanded={setExpanded}
									/>
								</>
							}
						</Box>
					}

					{
						selectedDatabases[dbs] === "system" ||
						(
							selectedDatabases[dbs] === "wp" &&
							metaData.settings.wp.tables.includes(tbl)
						) &&

						<FormHelperText
							sx={{
								display: "inline-grid",
								gridTemplateColumns: "20px auto",
								gridGap: "5px",
								marginTop: "20px",
								alignItems: "center",
								"& svg": {
									fontSize: "20px",
								}
							}}
						>
							<MdWarning />
							We discourage enabling REST API services on WordPress and system tables
						</FormHelperText>
					}
				</Box>
			</AccordionDetails>
		</Accordion>

	)

}

export default SettingsRestApi