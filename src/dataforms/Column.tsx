import { Suspense, lazy } from "react"
import { ColumnPropsType } from "../types/ColumnPropsType"
import log from "loglevel"

const FieldText = lazy(() => import("./inputfields/FieldText"))
const FieldTextarea = lazy(() => import("./inputfields/FieldTextarea"))
const FieldNumber = lazy(() => import("./inputfields/FieldNumber"))
const FieldSet = lazy(() => import("./inputfields/FieldSet"))
const FieldEnum = lazy(() => import("./inputfields/FieldEnum"))
const FieldDate = lazy(() => import("./inputfields/FieldDate"))
const FieldDatetime = lazy(() => import("./inputfields/FieldDatetime"))
const FieldTime = lazy(() => import("./inputfields/FieldTime"))
const FieldCheckbox = lazy(() => import("./inputfields/FieldCheckbox"))
const ColumnWpMedia = lazy(() => import("./ColumnWpMedia.tsx"))
const ColumnHyperlink = lazy(() => import("./ColumnHyperlink"))

const Column = (
	{
		appId,

		columnName,
		columnValue,
		columnMetaData,
		storeColumn,
		columnValidation,
		onColumnChange,

		metaData,
		context,
		storeTable,
		storeForm,

		formMode,
	}: ColumnPropsType
) => {

	log.debug(
		appId,

		columnName,
		columnValue,
		columnMetaData,
		storeColumn,

		metaData,
		context,
		storeTable,
		storeForm,
	)

	if (metaData?.media[columnName]) {

		// Handle WordPress media column
		// EXCLUDE: ImageURL, HyperlinkURL (url is entered as normal text)
		if (
			[
				"WP-Image",
				"WP-Attachment",
				"WP-Audio",
				"WP-Video"
			].includes(metaData?.media[columnName])
		) {

			// WP Image
			return (

				<Suspense>
					<ColumnWpMedia
						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumn}
						columnValidation={columnValidation}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={storeTable}
						storeForm={storeForm}

						formMode={formMode}

						columnMedia={context?.media[columnName]}
						mediaType={metaData?.media[columnName]}
					/>
				</Suspense>

			)

		} else if (
			metaData?.media[columnName] === "HyperlinkObject"
		) {

			// HyperlinkObjects are store in JSON format
			return (

				<Suspense>
					<ColumnHyperlink
						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumn}
						columnValidation={columnValidation}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={storeTable}
						storeForm={storeForm}

						formMode={formMode}
					/>
				</Suspense>

			)

		}

	}

	if (columnMetaData.column_type.toLowerCase() === "tinyint(1)") {

		// Show checkbox for data type tinyint(1)
		return (
			<Suspense>
				<FieldCheckbox
					appId={appId}

					columnName={columnName}
					columnValue={columnValue}
					columnMetaData={columnMetaData}
					storeColumn={storeColumn}
					columnValidation={columnValidation}
					onColumnChange={onColumnChange}

					metaData={metaData}
					context={context}
					storeTable={storeTable}
					storeForm={storeForm}

					formMode={formMode}
				/>
			</Suspense>
		)

	}

	switch (columnMetaData.data_type.toLowerCase()) {

		case "decimal":
		case "double":
		case "double precision":
		case "float":
		case "real":
		case "bit":
		case "tinyint":
		case "smallint":
		case "int":
		case "integer":
		case "mediumint":
		case "bigint":

			return (

				<Suspense>
					<FieldNumber
						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumn}
						columnValidation={columnValidation}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={storeTable}
						storeForm={storeForm}

						formMode={formMode}
					/>
				</Suspense>

			)

		case "enum":
			return (

				<Suspense>
					<FieldEnum
						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumn}
						columnValidation={columnValidation}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={storeTable}
						storeForm={storeForm}

						formMode={formMode}
					/>
				</Suspense>

			)

		case "set":
			return (

				<Suspense>
					<FieldSet
						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumn}
						columnValidation={columnValidation}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={storeTable}
						storeForm={storeForm}

						formMode={formMode}
					/>
				</Suspense>

			)

		case "time":
			return (

				<Suspense>
					<FieldTime
						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumn}
						columnValidation={columnValidation}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={storeTable}
						storeForm={storeForm}

						formMode={formMode}
					/>
				</Suspense>

			)

		case "date":
			return (

				<Suspense>
					<FieldDate
						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumn}
						columnValidation={columnValidation}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={storeTable}
						storeForm={storeForm}

						formMode={formMode}
					/>
				</Suspense>

			)

		case "datetime":
		case "timestamp":
			return (

				<Suspense>
					<FieldDatetime
						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumn}
						columnValidation={columnValidation}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={storeTable}
						storeForm={storeForm}

						formMode={formMode}
					/>
				</Suspense>

			)

		case "tinytext":
		case "text":
		case "mediumtext":
		case "longtext":
			return (

				<Suspense>
					<FieldTextarea
						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumn}
						columnValidation={columnValidation}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={storeTable}
						storeForm={storeForm}

						formMode={formMode}
					/>
				</Suspense>

			)

		default:
			return (

				<Suspense>
					<FieldText
						appId={appId}

						columnName={columnName}
						columnValue={columnValue}
						columnMetaData={columnMetaData}
						storeColumn={storeColumn}
						columnValidation={columnValidation}
						onColumnChange={onColumnChange}

						metaData={metaData}
						context={context}
						storeTable={storeTable}
						storeForm={storeForm}

						formMode={formMode}
					/>
				</Suspense>

			)

	}

}

export default Column