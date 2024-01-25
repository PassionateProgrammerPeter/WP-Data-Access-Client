/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { Config } from "./utils/Config"
import { RestApi } from "./restapi/RestApi"
import { useAppDispatch } from "./store/hooks"
import { defaultTableColumn, initTable } from "./store/tableSlice"
import { defaultFormColumn, initForm } from "./store/formSlice"
import ThemeContainer from "./ThemeContainer"
import { TablePropsType } from "./types/TablePropsType"
import Spinner from "./utils/Spinner"
import { StoreTableColumnType } from "./types/StoreTableColumnType"
import { getMetaDataColumnIndex, isView } from "./ts/lib"
import { setError } from "./store/explorerSlice"
import { addMetaData } from "./store/metaDataSlice"
import { StoreFormColumnType } from "./types/StoreFormColumnType"
import { stopAction } from "./store/uiSlice"
import merge from "lodash.merge"
import log from "loglevel"

type Props = TablePropsType & {
	appId: string,
	exploring?: boolean,
}

const MetaData = (
	{
		dbs,
		tbl,
		appId,
		exploring,
	}: Props
) => {

	log.debug(dbs, tbl, appId)

	const dispatch = useAppDispatch()

	const [loadError, setLoadError] = useState<string>("")
	const [metaDataLoaded, setMetaDataLoaded] = useState<boolean>(false)

	useEffect(() => {

		if (!metaDataLoaded) {
			loadMetaData()
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dbs, tbl])

	const loadMetaData = () => {

		RestApi(
			Config.appUrlMeta,
			{
				dbs: dbs,
				tbl: tbl
			},
			function (response: any) {
				const data = response?.data
				log.debug("response data", dbs, tbl, data)

				if (
					data?.access?.select &&
					Array.isArray(data.access.select) &&
					data.access.select.includes("POST")
				) {
					prepareStore(data)
					setMetaDataLoaded(true)
				} else {
					let msg = "Unauthorized"

					if (
						response?.data?.message
					) {
						msg = response.data.message
					}

					msg += " - check console for more information"

					log.error(msg)
					setLoadError(msg)
				}
			}
		)

	}

	const prepareStore = (
		data: any
	): void => {

		const canInsert: boolean = data.access.insert?.some((item: any) => item.toUpperCase() === "POST")
		const canUpdate: boolean = data.access.update?.some((item: any) => item.toUpperCase() === "POST")
		const canDelete: boolean = data.access.delete?.some((item: any) => item.toUpperCase() === "POST")

		// Add database and table name to meta data
		data.src = {
			dbs,
			tbl,
		}

		// Add table privileges to meta data
		data.privs = {
			select: true,
			insert: canInsert,
			update: canUpdate,
			delete: canDelete
		}

		// Store meta data
		dispatch(
			addMetaData({
				appId: appId,
				metaData: { ...data }
			})
		)

		// Get table settings
		let tableSettings: any = {}
		if (data?.settings?.ui?.global?.table !== false) {
			tableSettings = { ...data?.settings?.ui?.global?.table }
		} else {
			// Prepare default
			tableSettings = {
				table: {
					transactions: {
						insert: canInsert,
						update: canUpdate,
						delete: canDelete
					},
					bulkActions: {
						pdf: false,
						csv: true,
						json: true,
						excel: false,
						xml: true,
						sql: true,
						delete: data?.privs?.delete
					}
				}
			}
		}

		// Init table columns
		const storeTableColumns: Array<StoreTableColumnType> = []
		for (let i = 0; i < data.columns.length; i++) {
			storeTableColumns[i] = defaultTableColumn(
				data.columns[i].column_name,
				data.table_labels[data.columns[i].column_name] ?? data.columns[i].column_name,
			)
		}
		const updatedTableColumns: Array<StoreTableColumnType> = []
		if (tableSettings.columns) {
			// Merge saved settings and database structure
			for (let i = 0; i < tableSettings.columns.length; i++) {
				const tableIndex = getMetaDataColumnIndex(data, tableSettings.columns[i].columnName)
				if (tableIndex !== undefined) {
					// Update database field
					updatedTableColumns.push(
						merge(
							{},
							storeTableColumns[tableIndex],
							tableSettings.columns[i]
						)
					)
				} else {
					// Add computed field
					updatedTableColumns.push(
						merge(
							{},
							defaultTableColumn(data.columns[i].column_name),
							tableSettings.columns[i]
						)
					)
				}
			}
			tableSettings.columns = updatedTableColumns
		} else {
			// Nothing to merge
			tableSettings.columns = storeTableColumns
		}

		// Init table store
		dispatch(
			initTable({
				appId: appId,
				tableState: tableSettings,
				tableAccess: {
					update: canUpdate,
					insert: canInsert,
					delete: canDelete
				},
				isView: isView(data),
				exploring: exploring === true
			})
		)

		// Get form settings
		let formSettings: any = { ...data?.settings?.ui?.global?.form }
		if (formSettings === false) {
			formSettings = {}
		}

		// Init form columns
		const storeFormColumns: Array<StoreFormColumnType> = []
		for (let i = 0; i < data.columns.length; i++) {
			storeFormColumns[i] = defaultFormColumn(
				data.columns[i].column_name,
				data.form_labels[data.columns[i].column_name] ?? data.columns[i].column_name,
			)
		}
		const updatedFormColumns: Array<StoreTableColumnType> = []
		if (formSettings.columns) {
			// Merge saved settings and database structure
			for (let i = 0; i < formSettings.columns.length; i++) {
				const tableIndex = getMetaDataColumnIndex(data, formSettings.columns[i].columnName)
				if (tableIndex !== undefined) {
					// Update database field
					updatedFormColumns.push(
						merge(
							{},
							storeTableColumns[tableIndex],
							formSettings.columns[i]
						)
					)
				} else {
					// Add computed field
					updatedFormColumns.push(
						merge(
							{},
							defaultFormColumn(formSettings.columns[i].column_name),
							formSettings.columns[i]
						)
					)
				}
			}
			formSettings.columns = updatedFormColumns
		} else {
			// Nothing to merge
			formSettings.columns = storeFormColumns
		}

		// Init form store
		dispatch(
			initForm({
				appId: appId,
				formState: formSettings,
			})
		)

		// Get theme settings
		let themeSettings: any = {...data?.settings?.ui?.global?.theme}
		if (themeSettings === false) {
			themeSettings = {}
		}


	}

	if (loadError !== "") {
		dispatch(
			setError({
				error: loadError
			})
		)

		dispatch(
			stopAction({})
		)

		return null
	}

	if (metaDataLoaded) {
		return (
			<ThemeContainer
				appId={appId}
			/>
		)
	}

	return (
		<Spinner title="Loading meta data..." />
	)

}

export default MetaData