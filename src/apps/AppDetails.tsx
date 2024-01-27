import log from "loglevel"
import { AppType } from "../types/AppType"
import { Box } from "@mui/material"

type Props = {
	app: AppType,
}

const AppDetails = (
	{
		app,
	}: Props
) => {

	log.debug(app)

	return (

		<Box
			sx={{
				padding: "30px",
			}}
		>
			{app.appTitle}
		</Box>

	)

}

export default AppDetails