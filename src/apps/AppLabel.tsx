import { useRef } from "react"
import { Box, IconButton, Input, InputAdornment, Tooltip } from "@mui/material"
import { AppType } from "../types/AppType"
import { MdEdit, MdGroupAdd, MdSettings } from "react-icons/md"
import log from "loglevel"

type Props = {
	app: AppType,
}

const AppLabel = (
	{
		app,
	}: Props
) => {

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const input: any = useRef(null)
	
	return (

		<Box
			sx={{
				width: "calc(100% - 10px)",
				display: "grid",
				gridTemplateColumns: "auto auto",
				justifyContent: "space-between",
				alignItems: "center",
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
					endAdornment={
						<InputAdornment
							position="end"
							style={{ pointerEvents: "none" }}
						>
							<MdEdit />
						</InputAdornment>
					}
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
						<MdSettings />
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

	)

}

export default AppLabel