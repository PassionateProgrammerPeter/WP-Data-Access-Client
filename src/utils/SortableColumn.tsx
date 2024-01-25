import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const SortableColumn = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	props: any
) => {

	const {
		setNodeRef,
		transform,
		transition
	} = useSortable({
		id: props.id
	})

	const itemStyle: React.CSSProperties | undefined = {
		transform: CSS.Transform.toString(transform),
		transition
	}

	return (

		<div
			ref={setNodeRef}
			key={props.id}
			style={itemStyle}
		>
			{props.children}
		</div>

	)

}

export default SortableColumn