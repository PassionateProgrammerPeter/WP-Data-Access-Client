import { ReactNode } from "react"
import { Box } from "@mui/material"
import { MdNotInterested } from "react-icons/md"
import { AdminTheme } from "../themes/AdminTheme"
import CSS from "csstype"

type Props = {
	checked: boolean,
	children: ReactNode,
	alignRight?: boolean,
}

const IconOnOff = (
	{
		checked,
		children,
		alignRight,
	}: Props
) => {

	const svgOffStyle: CSS.Properties = {
		width: "13px",
		height: "13px",
		top: "unset",
		backgroundColor: AdminTheme?.palette.background.paper,
	}

	if (alignRight === false) {
		svgOffStyle.right = "unset"
	} else {
		svgOffStyle.left = "unset"
	}

	return (

		<Box
			sx={{
				position: "relative",
				width: "24px",
				height: "24px",
				"& svg": {
					position: "absolute",
					width: "24px",
					height: "24px",
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
				},
				"& svg.off": svgOffStyle
			}}
		>
			{children}
			{
				!checked &&

				<MdNotInterested
					className="off"
					color={AdminTheme?.palette.error.main}
				/>
			}
		</Box>

	)
}

export default IconOnOff