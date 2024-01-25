import { Suspense, lazy } from "react"
import ReactDOM from "react-dom/client"
import Provider from "react-redux/es/components/Provider"
import { Store } from "./store/store"
import { Config } from "./utils/Config"
import { SnackbarProvider } from "notistack"
import log from "loglevel"

const restApiError = (
	root: ReactDOM.Root,
	msg: string,
) => {

	const Alert = lazy(() => import("./utils/Alert"))
	root.render(

		<Suspense>
			<Alert
				severity="error"
				message={msg}
				close={false}
			/>
		</Suspense>

	)

}

if (Config.appDebug) {
	log.setLevel("debug")
	log.debug(Config.appName + " started: debug = on")
} else {
	log.setLevel("info")
}

document.querySelectorAll(".pp-container").forEach(

	(rootElement) => {
		const root: ReactDOM.Root = ReactDOM.createRoot(rootElement)

		if (Config.appStatus === "") {

			if (Config.appUrl) {

				const AppContainer = lazy(() => import("./AppContainer"))
				root.render(

					<Provider store={Store}>
						<SnackbarProvider
							maxSnack={5}
							autoHideDuration={3000}
						/>

						<AppContainer dataSource={rootElement.getAttribute("data-source")} />
					</Provider>

				)

			} else {

				restApiError(
					root,
					"Invalid REST API configuration"
				)

			}
		} else {

			restApiError(
				root,
				Config.appStatus
			)

		}
	}

)

document.querySelectorAll(".pp-container-applist").forEach(

	(rootElement) => {
		const root: ReactDOM.Root = ReactDOM.createRoot(rootElement)

		if (Config.appStatus === "") {

			if (Config.appUrl) {

				const AppList = lazy(() => import("./apps/AppList"))
				root.render(

					<Provider store={Store}>
						<SnackbarProvider
							maxSnack={5}
							autoHideDuration={3000}
						/>

						<AppList />
					</Provider>

				)

			} else {

				restApiError(
					root,
					"Invalid REST API configuration"
				)

			}
		} else {

			restApiError(
				root,
				Config.appStatus
			)

		}
	}

)

document.querySelectorAll(".pp-container-app").forEach(

	(rootElement) => {
		const root: ReactDOM.Root = ReactDOM.createRoot(rootElement)

		if (Config.appStatus === "") {

			if (Config.appUrl) {

				const App = lazy(() => import("./App"))
				root.render(

					<Provider store={Store}>
						<SnackbarProvider
							maxSnack={5}
							autoHideDuration={3000}
						/>

						<App dataSource={rootElement.getAttribute("data-source")} />
					</Provider>

				)

			} else {

				restApiError(
					root,
					"Invalid REST API configuration"
				)

			}
		} else {

			restApiError(
				root,
				Config.appStatus
			)

		}
	}

)

document.querySelectorAll(".pp-container-explorer").forEach(

	(rootElement) => {
		const root: ReactDOM.Root = ReactDOM.createRoot(rootElement)

		if (Config.appStatus === "") {

			if (Config.appUrl) {

				const Explorer = lazy(() => import("./explorer/Explorer"))
				root.render(

					<Provider store={Store}>
						<SnackbarProvider
							maxSnack={5}
							autoHideDuration={3000}
						/>

						<Explorer />
					</Provider>

				)

			} else {

				restApiError(
					root,
					"Invalid REST API configuration"
				)

			}

		} else {

			restApiError(
				root,
				Config.appStatus
			)

		}
	}

)