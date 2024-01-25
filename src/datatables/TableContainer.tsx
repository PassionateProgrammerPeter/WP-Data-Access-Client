/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "loglevel"
import { RowActionEnum } from "../enums/RowActionEnum"
import { Suspense, lazy } from "react"
import { useAppSelector } from "../store/hooks"
import { RootState } from "../store/store"
import { selectTableSettingsOpen } from "../store/uiSlice"
import { AdminThemeInit } from "../themes/AdminTheme"
import { Theme, ThemeProvider } from "@mui/material"
import Spinner from "../utils/Spinner"

const Table = lazy(() => import("./Table"))
const Settings = lazy(() => import("./settings/Settings"))

type Props = {
	appId: string,
	display: boolean,
	refresh: boolean,
	showForm: (keys: any, action: RowActionEnum) => void,
}

const TableContainer = (
	{
		appId,
		display,
		refresh,
		showForm,
	}: Props
) => {

	log.debug(appId, appId, display, refresh)

	const tableSettingsVisible: boolean =
		useAppSelector(
			(state: RootState) =>
				selectTableSettingsOpen(state, appId)
		)

	const theme: Theme = AdminThemeInit()

	return (

		<>
			<Suspense fallback={<Spinner title="Loading table..." />}>
				<Table
					appId={appId}
					display={display}
					refresh={refresh}
					showForm={showForm}
				/>
			</Suspense>

			<div style={{ display: "none" }}>
				{
					tableSettingsVisible &&

					<Suspense fallback={<Spinner title="Loading Table Builder..." />}>
						<ThemeProvider theme={theme}>
							<Settings
								appId={appId}
							/>
						</ThemeProvider>
					</Suspense>
				}
			</div>
		</>

	)

}

export default TableContainer