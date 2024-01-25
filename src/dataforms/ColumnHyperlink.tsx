import { useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import { ColumnPropsType } from "../types/ColumnPropsType"
import { FormModeEnum } from "../enums/FormModeEnum"
import log from "loglevel"

type HyperlinkObjectType = {
	label: string,
	url: string,
	target: string
}

const ColumnHyperlink = (
	{
		columnName,
		columnValue,
		columnMetaData,
		onColumnChange,

		formMode,
	}: ColumnPropsType
) => {

	log.debug(
		columnName,
		columnValue,
		columnMetaData,
	)

	const [updated, setUpdated] = useState<boolean>(false)
	const [hyperlink, setHyperlink] = useState<HyperlinkObjectType>(JSON.parse(columnValue))
	useEffect(() => {

		if (updated) {
			onColumnChange(
				columnName,
				JSON.stringify(hyperlink)
			)
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hyperlink])

	if (
		hyperlink.label === undefined ||
		hyperlink.url === undefined ||
		hyperlink.target === undefined
	) {

		return (

			<div>
				Invalid hyperlink format
			</div>

		)

	}

	const updateHyperlink = (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		property: any
	): void => {

		setUpdated(true)
		setHyperlink({
			...hyperlink,
			...property
		})

	}

	return (

		<fieldset
			className="pp-fieldset"
			style={{
				padding: "20px"
			}}
		>
			<legend>
				{columnMetaData.formLabel}
			</legend>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr auto",
					alignItems: "center",
					gap: "20px"
				}}
			>
				<TextField
					label="Label"
					value={hyperlink.label}
					required={columnMetaData.is_nullable === "NO"}
					inputProps={{
						readOnly: formMode === FormModeEnum.VIEW
					}}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						updateHyperlink({
							label: event.target.value
						})
					}}
				/>

				<FormControl>
					<FormControlLabel
						control={
							<Checkbox
								id={columnName}
								checked={hyperlink.target === "_blank"}
								disabled={formMode === FormModeEnum.VIEW}
								onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
									updateHyperlink({
										target: checked ? "_blank" : ""
									})
								}}
							/>
						}
						label="Open link in a new tab"
					/>
				</FormControl>

				<TextField
					label="Url"
					value={hyperlink.url}
					required={columnMetaData.is_nullable === "NO"}
					inputProps={{
						readOnly: formMode === FormModeEnum.VIEW
					}}
					sx={{
						gridColumn: "1 / span 2",
					}}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						updateHyperlink({
							url: event.target.value
						})
					}}
				/>
			</div>
		</fieldset>

	)

}

export default ColumnHyperlink