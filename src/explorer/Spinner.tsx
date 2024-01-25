import { Box, CircularProgress, Typography } from "@mui/material"

const Spinner = () => {

	return (

		<Box
			sx={{
				display: "grid",
				gridTemplateColumns: "auto auto",
				justifyContent: "start",
				alignItems: "center",
				gap: "10px",
				padding: "10px"
			}}
		>
			<CircularProgress
				sx={{
					width: "1em !important",
					height: "1em !important"
				}}
			/>
			<Typography>
				Loading...
			</Typography>
		</Box>

	)

}

export default Spinner