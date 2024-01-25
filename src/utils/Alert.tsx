import { useEffect, useState } from "react"
import MuiAlert from "@mui/material/Alert"
import MuiAlertTitle from "@mui/material/AlertTitle"
import IconButton from "@mui/material/IconButton"
import { ErrorType } from "../types/ErrorType"
import { BsXCircleFill } from "react-icons/bs"
import log from "loglevel"
import { AdminTheme } from "../themes/AdminTheme"

type Props = ErrorType & {
	now?: string,
	close?: boolean,
	setClose?: () => void
}

const Alert = (
	{
		severity,
		message,
		now,
		close,
		setClose
	}: Props
) => {

	log.debug(severity, message)

	const [alert, setAlert] = useState<ErrorType | null>(null)

	useEffect(() => {
		setAlert({
			severity: severity,
			message: message
		})
	}, [severity, message, now])

	const handleOnClick = (): void => {
		setAlert(null)

		if (setClose!==undefined) {
			setClose()
		}
	}

	return (
		<>
			{
				alert !== null &&

				<MuiAlert
					severity={alert.severity}
					sx={{
						borderRadius: "4px",
						border: `1px solid ${AdminTheme?.palette.error.dark}`
					}}
					action={
						close !== false &&
						<IconButton
							onClick={handleOnClick}
							sx={{
								width: "30px",
								height: "30px"
							}}
						>
							<BsXCircleFill/>
						</IconButton>
					}
				>
					{
						alert.severity.toString() === "error" &&
						<MuiAlertTitle>Error</MuiAlertTitle>
					}

					{
						alert.severity.toString() === "warning" &&
						<MuiAlertTitle>Warning</MuiAlertTitle>
					}

					{

						alert.severity.toString() === "info" &&
						<MuiAlertTitle>Info</MuiAlertTitle>
					}

					{
						alert.severity.toString() === "success" &&
						<MuiAlertTitle>Success</MuiAlertTitle>
					}

					{alert.message}
				</MuiAlert>
			}
		</>
	)

}

export default Alert