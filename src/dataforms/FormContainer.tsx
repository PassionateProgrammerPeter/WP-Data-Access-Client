/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, Suspense } from "react"
import { RootState } from "../store/store"
import { useAppSelector } from "../store/hooks"
import { selectFormSettingsOpen } from "../store/uiSlice"
import Spinner from "../utils/Spinner"
import { FormModeEnum } from "../enums/FormModeEnum"
import { RowActionEnum } from "../enums/RowActionEnum"
import { Theme, ThemeProvider } from "@mui/material"
import { AdminThemeInit } from "../themes/AdminTheme"
import Form from "./Form"

const Settings = lazy(() => import("./settings/Settings"))

type Props = {
	appId: string,
	primaryKey: any,
	formMode: FormModeEnum,
	showTable: (rerender: boolean) => void,
	showForm: (keys: any, action: RowActionEnum) => void,
}

export const FormContainer = (
	{
		appId,
		primaryKey,
		formMode,
		showTable,
		showForm,
	}: Props
) => {

	const formSettingsVisible: boolean =
		useAppSelector(
			(state: RootState) =>
				selectFormSettingsOpen(state, appId)
		)

	const theme: Theme = AdminThemeInit()

	return (

		<>
			<Form
				appId={appId}
				primaryKey={primaryKey}
				formMode={formMode}
				showTable={showTable}
				showForm={showForm}
			/>

			{
				formSettingsVisible &&

				<Suspense fallback={<Spinner title="Loading form settings..." />}>
					<ThemeProvider theme={theme}>
						<Settings
							appId={appId}
						/>
					</ThemeProvider>
				</Suspense>
			}
		</>

	)
}

export default FormContainer