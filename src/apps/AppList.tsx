/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { RestApi } from "../restapi/RestApi"
import { Config } from "../utils/Config"
import { Theme, ThemeProvider } from "@mui/material"
import { AdminThemeInit } from "../themes/AdminTheme"
import { TreeView } from "@mui/x-tree-view/TreeView"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { MdExpandLess, MdExpandMore } from "react-icons/md"
import { AppType } from "../types/AppType"
import AppDetails from "./AppDetails"
import AppLabel from "./AppLabel"
import Spinner from "../utils/Spinner"
import log from "loglevel"

const AppList = () => {

	const [apps, setApps] = useState<AppType[]>([])

	useEffect(() => {

		loadApps() // Only needed once on page load

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const loadApps = () => {

		RestApi(
			Config.appUrlAppList,
			{},
			function (response: any) {
				const data = response?.data
				log.debug("response data", data)

				if (
					Array.isArray(data)
				) {
					const appList: AppType[] = []
					for (let i = 0; i < data.length; i++) {
						appList.push({
							appId: data[i].app_id,
							appName: data[i].app_name,
							appTitle: data[i].app_title,
							appType: data[i].app_type,
							appAccess: data[i].app_access,
							appAddToMenu: data[i].app_add_to_menu,
							appMenuTitle: data[i].app_menu_title,
						})
					}
					setApps(appList)
				} else {
					setApps([])
				}
			}
		)

	}

	const theme: Theme = AdminThemeInit()

	return (

		<ThemeProvider theme={theme}>
			{
				apps.length === 0

					?

					<Spinner title="Loading apps..." />

					:

					<TreeView
						aria-label="Data Apps"
						defaultCollapseIcon={<MdExpandLess />}
						defaultExpandIcon={<MdExpandMore />}
						sx={{
							gridGap: "0",
							borderBottom: "1px solid rgba(0, 0, 0, 0.34)",		
						}}
					>
						{
							...apps.map((app: AppType) => {

								return (

									<TreeItem
										key={app.appName}
										nodeId={app.appName}
										label={
											<AppLabel
												app={app}
											/>
										}
									>
										<AppDetails
											app={app}
										/>
									</TreeItem>

								)

							})
						}
					</TreeView>
			}
		</ThemeProvider>

	)

}

export default AppList