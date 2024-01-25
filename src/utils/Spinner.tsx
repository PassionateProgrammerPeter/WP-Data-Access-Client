import CSS from "csstype"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

interface SpinnerProps {
	title?: string
}

const Spinner = (
	{
		title
	}: SpinnerProps
) => {

	const boxStyle: CSS.Properties = {
		display: "grid",
		gridTemplateColumns: "auto auto",
		justifyContent: "center",
		alignItems: "center"
	}

	const typoStyle: CSS.Properties = {
		marginLeft: "10px"
	}

	return (
		<Box 
			sx={boxStyle}
		>
			<CircularProgress />
			{
				title &&
				<Typography
					sx={typoStyle}
				>
					{title}
				</Typography>
			}
		</Box>
	)

}

export default Spinner