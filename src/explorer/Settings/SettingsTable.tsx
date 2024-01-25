/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, AccordionDetails, AccordionSummary, Box, FormHelperText, FormLabel, Radio, RadioGroup } from "@mui/material"
import { MdExpandMore } from "react-icons/md"
import { TablePropsType } from "../../types/TablePropsType"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import { selectManagerSettings, updateSettings } from "../../store/managerSlice"
import log from "loglevel"
import { ManagerSettingsType } from "../../types/ManagerSettingsType"

type Props = TablePropsType & {
	setIsUpdated: (isUpdated: boolean) => void,
}

const SettingsTable = (
	{
		dbs,
		tbl,
		setIsUpdated,
	}: Props
) => {

	log.debug(dbs, tbl)

	const dispatch = useAppDispatch()

	const managerSettings: ManagerSettingsType | undefined =
		useAppSelector(
			(state: RootState) =>
				selectManagerSettings(state)
		)
	log.debug(managerSettings)

	const setHyperlinkDefinition = (
		hyperlink_definition: string
	) => {

		const settings: ManagerSettingsType = {
			...managerSettings,
			...{
				table_settings: {
					...managerSettings.table_settings,
					hyperlink_definition: hyperlink_definition
				}
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
				Table Settings
			</AccordionSummary>

			<AccordionDetails>
				<Box>
					<FormLabel>
						Process hyperlink columns as
					</FormLabel>

					<RadioGroup
						sx={{
							marginTop: "10px",
							marginBottom: "10px",
						}}
					>
						<FormLabel
							className="align-label-radio"
						>
							<Radio
								checked={managerSettings.table_settings.hyperlink_definition === "json"}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setHyperlinkDefinition("json")
									event.stopPropagation()
								}}
							/>
							Preformatted JSON
						</FormLabel>

						<FormLabel>
							<Radio
								checked={managerSettings.table_settings.hyperlink_definition === "text"}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setHyperlinkDefinition("text")
									event.stopPropagation()
								}}
							/>
							Plain text
						</FormLabel>
					</RadioGroup>

					<FormHelperText>
						Preformatted JSON supports individual label and target settings.
						Plain text converts column content to a hyperlink link.
					</FormHelperText>
				</Box>
			</AccordionDetails>
		</Accordion>

	)

}

export default SettingsTable