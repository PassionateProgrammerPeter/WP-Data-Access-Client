import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Paper, { PaperProps } from "@mui/material/Paper"
import Draggable from "react-draggable"

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
const AlertDialog = (props: any) => {

	const { title, message, open, setOpen } = props

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
					variant="contained"
					onClick={() =>
						setOpen(false)
					}
				>
					OK
				</Button>
			</DialogActions>
		</Dialog>

	)

}

export default AlertDialog