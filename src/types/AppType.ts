import { AppTypeEnum } from "../enums/AppTypeEnum";

export type AppType = {
	appId: number,
	appName: string,
	appTitle: string,
	appType: AppTypeEnum,
	appAccess: string,
	appAddToMenu: boolean,
	appMenuTitle: string,
}