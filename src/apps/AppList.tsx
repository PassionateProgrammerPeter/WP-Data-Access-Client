/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { RestApi } from "../restapi/RestApi"
import { Config } from "../utils/Config"
import { AppType } from "../types/AppType"
import Spinner from "../utils/Spinner"
import AppLine from "./AppLine"
import log from "loglevel"
import { Box } from "@mui/material"

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

	return (

		<Box>
			{
				apps.length === 0 &&
				<Spinner title="Loading apps..." />
			}

			{
				...apps.map((app: AppType, index: number) => {

					return (

						<AppLine
							app={app}
							index={index}
						/>

					)

				})
			}
		</Box>

	)

}

export default AppList