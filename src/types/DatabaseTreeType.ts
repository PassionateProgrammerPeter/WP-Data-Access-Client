/* eslint-disable @typescript-eslint/no-explicit-any */
export type DatabaseTreeType = {
	tables: string[],
	tablesLoaded: boolean,
	views: string[],
	viewsLoaded: boolean,
	columns: {
		[key: string]: any
	},
	columnsLoaded: {
		[key: string]: boolean
	},
	indexes: {
		[key: string]: any
	},
	indexesLoaded: {
		[key: string]: boolean
	},
	triggers: {
		[key: string]: any
	},
	triggersLoaded: {
		[key: string]: boolean
	},
	foreignKeys: {
		[key: string]: any
	},
	foreignKeysLoaded: {
		[key: string]: boolean
	},
	functions: string[],
	functionsLoaded: boolean,
	procedures: string[],
	proceduresLoaded: boolean,
}