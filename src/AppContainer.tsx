import { Suspense, lazy } from "react"
import MetaData from "./MetaData"
import { v4 as uuid } from "uuid"
import log from "loglevel"
import "../src/css/main.css"

const Alert = lazy(() => import("./utils/Alert"))

type Props = {
	dataSource: string | null
}

function AppContainer(
	{
		dataSource
	}: Props
) {

	log.debug(dataSource)

	let dbs: string = ""
	let tbl: string = ""

	try {
		// Check prop dataSource
		const data = JSON.parse(dataSource!.replaceAll("'", '"'))

		if (data.dbs && data.tbl) {
			dbs = data.dbs
			tbl = data.tbl
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
		
		<MetaData
			appId={uuid()}
			dbs={dbs} 
			tbl={tbl}
		/>
		
	)
}

export default AppContainer