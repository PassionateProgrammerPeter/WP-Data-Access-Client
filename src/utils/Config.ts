/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigType } from "../types/ConfigType"
import log from "loglevel"

let original_config: any = {} // Save original config properties
const global_config: any = {} // Used to overwrite config properties
if ("PP_APP_CONFIG" in window) {
	original_config = window.PP_APP_CONFIG
	for (const prop in original_config) {
		// Overwrite explicitly defined properties only
		global_config[prop] = original_config[prop]
	}
}


	global_config.title = "WP Data Access"
	global_config.plugin = true

	if (global_config.skipWpSettings !== true) {
		const wpApiSettings = (window as any).wpApiSettings
		global_config.token = wpApiSettings.nonce
		if (wpApiSettings) {
			// WordPress installation : use WP REST API
			global_config.urlRoot = wpApiSettings.root + "wpda/"
			if ("PP_APP_CONFIG" in window) {
				global_config.siteInfo = {
					appSite: global_config.appSite,
					appLicense: global_config.appLicense,
				}
			} else {
				// Fatal error: invalid installation
				global_config.appStatus = "Invalid installation (please contact support)"
			}
		} else {
			// Fatal error: stop execution
			global_config.appStatus = "Invalid installation (please contact support)"
		}
	}

export const Config: ConfigType = {
	appName: global_config.title,
	appSiteInfo: global_config.siteInfo,
	appToken: global_config.token,
	appPlugin: global_config.plugin,
	appStatus: global_config.appStatus ?? "",
	appDebug: global_config.appDebug ? Boolean(global_config.appDebug) : false,
	appUrl: global_config.urlRoot,
	appUrlAppList: global_config.urlAppList ?? "app/list",
	appUrlTreeDbs: global_config.urlTreeDbs ?? "tree/dbs",
	appUrlTreeTbl: global_config.urlTreeTbl ?? "tree/tbl",
	appUrlTreeVws: global_config.urlTreeTbl ?? "tree/vws",
	appUrlTreeCls: global_config.urlTreeTbl ?? "tree/cls",
	appUrlTreeIdx: global_config.urlTreeTbl ?? "tree/idx",
	appUrlTreeFrk: global_config.urlTreeTbl ?? "tree/frk",
	appUrlTreeTrg: global_config.urlTreeTbl ?? "tree/trg",
	appUrlTreeFnc: global_config.urlTreeTbl ?? "tree/fnc",
	appUrlTreePrc: global_config.urlTreeTbl ?? "tree/prc",
	appUrlMeta: global_config.urlMeta ?? "table/meta",
	appUrlGet: global_config.urlGet ?? "table/get",
	appUrlLov: global_config.urlGet ?? "table/lov",
	appUrlSelect: global_config.urlTable ?? "table/select",
	appUrlInsert: global_config.urlInsert ?? "table/insert",
	appUrlUpdate: global_config.urlUpdate ?? "table/update",
	appUrlDelete: global_config.urlDelete ?? "table/delete",
	appUrlTable: global_config.urlTable ?? "table/datatable",
	appUrlSettings: "save-settings",
	appUrlActionRename: "action/rename",
	appUrlActionCopy: "action/copy",
	appUrlActionTruncate: "action/truncate",
	appUrlActionDrop: "action/drop",
	appOrig: original_config,
}

Object.freeze(Config)

log.debug(Config)
