import { Suspense, lazy } from "react"
import log from "loglevel"
import { Box } from "@mui/material"

const Alert = lazy(() => import("./utils/Alert"))

type Props = {
	dataSource: string | null
}

const App = (
	{
		dataSource
	}: Props
) => {

	log.debug(dataSource)

	let id: number

	try {
		// Check prop dataSource
		const data = JSON.parse(dataSource!.replaceAll("'", '"'))

		if (data.id && !isNaN(data.id)) {
			id = data.id
		} else {
			console.error("Invalid arguments")

			return (
				<Suspense>
					<Alert
						severity="error"
						message="Invalid arguments - check console for more information"
						close={false}
					/>
				</Suspense>
			)
		}
	} catch (error) {
		console.error("Invalid arguments", error)

		return (
			<Suspense>
				<Alert
					severity="error"
					message="Invalid arguments - check console for more information"
					close={false}
				/>
			</Suspense>
		)
	}

	return (

		<Box>
			Here goes app {id}
		</Box>

	)

}

export default App