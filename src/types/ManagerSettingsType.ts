/* eslint-disable @typescript-eslint/no-explicit-any */
export type ManagerSettingsType = {
	table_settings: {
		row_count_estimate: any,				// not maintained, only preserved
		row_count_estimate_value: string,		// not maintained, only preserved
		row_count_estimate_value_hard: string,	// not maintained, only preserved
		row_level_security: string,				// not maintained, only preserved
		query_buffer_size: string,				// not maintained, only preserved
		hyperlink_definition: string,
	},
	list_labels: any,
	form_labels: any,
	column_media: any,
	rest_api: any,
}