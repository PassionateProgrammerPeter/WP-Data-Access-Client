/* eslint-disable @typescript-eslint/no-explicit-any */
import "./tooltip.css"

type TooltipType = {
	children: any, 
	title: string, 
	position?: string
}

const Tooltip = (
	{ 
		children, 
		title, 
		position
	}: TooltipType
) => {

	return (

		<div 
			style={{
				display: "inline-block",
				width: "fit-content"
			}}
			className={`tooltip`} 
			data-position={position ?? "top"} 
			data-tool-tip={title}
		>
			{children}
		</div>

	)

}

export default Tooltip