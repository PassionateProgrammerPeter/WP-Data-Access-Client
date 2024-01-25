import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Paper, { PaperProps } from "@mui/material/Paper"
import Draggable from "react-draggable"
import log from "loglevel"
import { Config } from "./Config"

function PaperComponent(props: PaperProps) {

	return (

		<Draggable
			handle="#draggable-dialog-title"
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>

	)

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ConfirmDialog = (props: any) => {

	const { title, message, open, setOpen, onConfirm } = props
	log.debug(props)

	return (

		<Dialog
			open={open}
			onClose={() =>
				setOpen(false)
			}
			PaperComponent={PaperComponent}
			aria-labelledby="confirm-dialog"
		>
			<DialogTitle
				style={{
					marginTop: "10px",
					cursor: "move"
				}}
				id="draggable-dialog-title"
			>
				{title}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{message}
				</DialogContentText>
			</DialogContent>
			<DialogActions
				sx={{
					marginRight: "15px",
					marginBottom: "15px"
				}}
			>
				<Button
					autoFocus
					variant="contained"
					onClick={(event: React.MouseEvent): void => {
						event.stopPropagation()
						setOpen(false)
						onConfirm()
					}}
				>
					Yes
				</Button>
				<Button
					variant="contained"
					onClick={(event: React.MouseEvent): void => {
						event.stopPropagation()
						setOpen(false)
					}}
				>
					No
				</Button>
				{
					props.onKeep &&
					Config.appOrig.appKeep &&

					<Button
						variant="contained"
						onClick={(event: React.MouseEvent): void => {
							event.stopPropagation()
							props.onKeep()
						}}
					>
						Keep
					</Button>
				}
			</DialogActions>
		</Dialog>

	)

}

export default ConfirmDialog