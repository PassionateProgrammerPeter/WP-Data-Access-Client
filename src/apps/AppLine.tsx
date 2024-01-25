/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react"
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Input, Tooltip } from "@mui/material"
import { MdEdit, MdExpandMore, MdGroupAdd } from "react-icons/md"
import { AppType } from "../types/AppType"
import log from "loglevel"

type Props = {
	app: AppType,
	index: number,
}

const AppLine = (
	{
		app,
		index,
	}: Props
) => {

	const input: any = useRef(null)

	return (

		<Accordion
			key={index}
			disableGutters={true}
			sx={{
				borderRadius: "0 !important",
			}}
		>

			<AccordionSummary
				expandIcon={<MdExpandMore />}
				sx={{
					padding: "10px 40px",
					"&.Mui-focusVisible": {
						backgroundColor: "unset",
					},
				}}
			>
				<Box
					sx={{
						width: "100%",
						display: "grid",
						gridTemplateColumns: "auto auto",
						justifyContent: "space-between",
						alignItems: "center",
						paddingRight: "20px",
					}}
				>
					<Box>
						<Input
							value={app.appName}
							inputRef={input}
							sx={{
								marginRight: "1rem",
								"&::before": {
									border: "none",
								},
								"& input": {
									padding: 0,
									border: "none",
								}
							}}
							onClick={(event) => {
								event.stopPropagation()
							}}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								log.debug(event)
							}}
						/>
					</Box>

					<Box>
						<Tooltip title="Edit app name">
							<IconButton
								onClick={(event) => {
									input.current.focus()
									event.stopPropagation()
								}}
							>
								<MdEdit />
							</IconButton>
						</Tooltip>

						<Tooltip title="Share app">
							<IconButton
								onClick={(event) => {
									event.stopPropagation()
								}}
							>
								<MdGroupAdd />
							</IconButton>
						</Tooltip>
					</Box>

				</Box>
			</AccordionSummary>

			<AccordionDetails>
				<Box
					sx={{
						padding: "30px",
					}}
				>
					{app.appTitle}
				</Box>
			</AccordionDetails>

		</Accordion>

	)

}

export default AppLine