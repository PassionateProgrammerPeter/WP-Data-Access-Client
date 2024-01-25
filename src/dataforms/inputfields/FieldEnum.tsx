import FieldEnumList from "./FieldEnumList"
import FieldEnumRadio from "./FieldEnumRadio"
import { ColumnPropsType } from "../../types/ColumnPropsType"
import { EnumTypeEnum } from "../../enums/EnumTypeEnum"
import { StoreFormColumnType } from "../../types/StoreFormColumnType"
import { selectFormColumnByName } from "../../store/formSlice"
import { Store } from "../../store/store"
import log from "loglevel"

type Props = ColumnPropsType & {
	appId: string,
	storeColumn: StoreFormColumnType,
}

const FieldEnum = (
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
	}: Props
) => {

	const column: StoreFormColumnType | undefined = selectFormColumnByName(Store.getState(), appId, columnName)
	log.debug(column, appId, columnName, columnValue)

	const enumValues =
		columnMetaData.column_type
			.replace("enum(", "")
			.replace(")", "")
			.replaceAll("'", "")
			.split(",")

	switch (column?.updatableEnum) {

		case EnumTypeEnum.RADIO_HORIZONTAL:
		case EnumTypeEnum.RADIO_VERTICAL:
			return (
				<FieldEnumRadio
					appId={appId}

					columnName={columnName}
					columnValue={columnValue}
					columnMetaData={columnMetaData}
					storeColumn={storeColumn}
					onColumnChange={onColumnChange}

					metaData={metaData}
					context={context}
					storeTable={storeTable}
					storeForm={storeForm}

					enumValues={enumValues}
					orientation={column?.updatableEnum}

					formMode={formMode}
					columnValidation={columnValidation}
				/>
			)

		default:
			return (
				<FieldEnumList
					appId={appId}

					columnName={columnName}
					columnValue={columnValue}
					columnMetaData={columnMetaData}
					storeColumn={storeColumn}
					onColumnChange={onColumnChange}

					metaData={metaData}
					context={context}
					storeTable={storeTable}
					storeForm={storeForm}

					enumValues={enumValues}

					formMode={formMode}
					columnValidation={columnValidation}
				/>
			)

	}

}

export default FieldEnum