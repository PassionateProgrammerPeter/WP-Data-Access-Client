/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RowActionEnum } from "../enums/RowActionEnum"
import TableQuery from "./TableQuery"
import log from "loglevel"

type Props = {
	appId: string,
	display: boolean,
	refresh: boolean,
	showForm: (keys: any, action: RowActionEnum) => void
}

const Table = (
	{
		appId,
		display,
		refresh,
		showForm
	}: Props
) => {
	log.debug(appId, display, refresh)

	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<TableQuery
				appId={appId}
				display={display}
				refresh={refresh}
				showForm={showForm}
			/>
		</QueryClientProvider>
	)
}

export default Table