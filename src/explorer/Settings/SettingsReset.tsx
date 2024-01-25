import { useState } from "react"
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, FormHelperText } from "@mui/material"
import { MdExpandMore, MdWarning } from "react-icons/md"
import { saveSettings } from "../../restapi/Actions"
import { ScopeEnum } from "../../enums/ScopeEnum"
import { TargetEnum } from "../../enums/TargetEnum"
import { TablePropsType } from "../../types/TablePropsType"
import ConfirmDialog from "../../utils/ConfirmDialog"
import { enqueueSnackbar } from "notistack"
import log from "loglevel"

const SettingsReset = (
	{
		dbs,
		tbl,
	}: TablePropsType
) => {

	log.debug(dbs, tbl)

	const [confirmDeleteSettings, setConfirmDeleteSettings] = useState<boolean>(false)
	const [target, setTarget] = useState<TargetEnum | undefined>(undefined)

	return (

		<>

			<Accordion
				disableGutters={true}
			>
				<AccordionSummary expandIcon={<MdExpandMore />}>
					Reset
				</AccordionSummary>

				<AccordionDetails>
					<Box
						sx={{
							display: "grid",
							gridGap: "20px",
						}}
					>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								setTarget(TargetEnum.TABLE)
								setConfirmDeleteSettings(true)
							}}
						>
							Delete Table Builder settings
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								setTarget(TargetEnum.FORM)
								setConfirmDeleteSettings(true)
							}}
						>
							Delete Form Builder settings
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								setTarget(TargetEnum.THEME)
								setConfirmDeleteSettings(true)
							}}
						>
							Delete Theme settings
						</Button>
						<FormHelperText
							sx={{
								display: "inline-grid",
								gridTemplateColumns: "20px auto",
								gridGap: "5px",
								alignItems: "center",
								"& svg": {
									fontSize: "20px",
								}
							}}
						>
							<MdWarning />
							A reset cannot be undone!
						</FormHelperText>
					</Box>
				</AccordionDetails>
			</Accordion>

			<ConfirmDialog
				title={`Delete ${target} settings?`}
				message="Are you sure? This action cannot be undone!"
				open={confirmDeleteSettings}
				setOpen={setConfirmDeleteSettings}
				onConfirm={() => {
					if (target !== undefined) {
						saveSettings(
							ScopeEnum.GLOBAL,
							target,
							dbs,
							tbl,
							null,
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							((data: any) => {
								if (data?.code && data?.message) {
									switch (data.code) {
										case "ok":
											enqueueSnackbar(data.message, { variant: "success" })
											break
										case "error":
											enqueueSnackbar(data.message, { variant: "error" })
											break
										default:
											enqueueSnackbar(data.message, { variant: "info" })
									}
								} else {
									log.error(data)
									enqueueSnackbar("Invalid response - check console for more information", { variant: "error" })
								}
							})
						)
					}
				}}
			/>

		</>

	)

}

export default SettingsReset