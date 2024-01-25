import { Box, Typography } from "@mui/material"

type Props = {
	msg: string
}

const NoData = (
	{
		msg
	} : Props
) => {

	return (

		<Box
			sx={{
				padding: "1rem 0",
				marginBottom: "20px",
			}}
		>
			<Typography>
				{msg}
			</Typography>
		</Box>

	)

}

export default NoData