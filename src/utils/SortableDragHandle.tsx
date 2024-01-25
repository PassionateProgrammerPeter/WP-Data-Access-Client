import { useDraggable } from "@dnd-kit/core"
import { FaUpDownLeftRight } from "react-icons/fa6"

type Props = {
	id: string,
	enabled: boolean
}

const SortableDragHandle = (
	{
		id,
		enabled
	}: Props
) => {

	const { attributes, listeners, setNodeRef } = useDraggable({
		id: id,
	})

	const handleStyle: React.CSSProperties | undefined = {
		margin: "auto",
		marginRight: "12px",
		cursor: "move"
	}

	if (!enabled) {
		handleStyle.visibility = "hidden"
	} else {
		handleStyle.visibility = "visible"
	}

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			style={handleStyle}
		>
			<FaUpDownLeftRight />
		</div>
	)

}

export default SortableDragHandle