/* eslint-disable @typescript-eslint/no-explicit-any */
export const loadStyle = (
	styleUrl: string
): void => {

	const link = document.createElement("link")
	link.type = "text/css"
	link.rel = "stylesheet"
	link.href = styleUrl
	document.head.appendChild(link)

}

export const loadScript = (
	scriptUrl: string,
	scriptId?: string
): void => {

	if (scriptId !== undefined) {
		if (document.getElementById(scriptId)) {
			return
		}
	}

	const script = document.createElement("script")
	if (scriptId !== undefined) {
		script.id = scriptId
	}
	script.src = scriptUrl
	document.head.appendChild(script)

}

export const getSimpleDataType = (
	dataType: string,
	precise?: boolean,
): string => {

	switch (dataType.toLowerCase()) {

		case "decimal":
		case "double":
		case "double precision":
		case "float":
		case "real": {
			if (precise === true) {
				return "float"
			} else {
				return "number"
			}
		}
		case "bit":
		case "tinyint":
		case "smallint":
		case "int":
		case "integer":
		case "mediumint":
		case "bigint":
			return "number"

		case "datetime":
		case "timestamp":
			if (precise === true) {
				return "datetime"
			} else {
				return "date"
			}
		case "time":
			if (precise === true) {
				return "time"
			} else {
				return "date"
			}
		case "date":
			return "date"

		default:
			return "string"
	}

}

export const isView = (
	metaData: any,
): boolean => {

	return metaData.table_type.toLowerCase().includes("view")

}

export const getMetaDataColumnIndex = (
	metaData: any,
	columnName: string,
): number | undefined => {

	for (let i = 0; i < metaData.columns.length; i++) {
		if (metaData.columns[i].column_name === columnName) {
			return i
		}
	}

	return undefined

}