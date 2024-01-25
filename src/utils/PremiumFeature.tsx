import { FormLabel } from "@mui/material"
import { FaWandMagicSparkles } from "react-icons/fa6"

type Props = {
	single?: boolean,
	margin?: string,
}

const PremiumFeature = (
	{
		single,
		margin,
	}: Props
) => {

	return (

		<>
			{
				true &&

				<FormLabel
					sx={{
						marginTop: margin === undefined ? "20px" : margin,
						display: "grid",
						gridTemplateColumns: "auto auto",
						justifyContent: "start",
						alignItems: "center",
						gap: "10px",
					}}
				>
					<FaWandMagicSparkles />
					{
						single === undefined

							?

							<>
								This is a premium feature
							</>

							:

							<>
								These are premium features
							</>

					}

				</FormLabel>
			}
		</>

	)

}

export default PremiumFeature