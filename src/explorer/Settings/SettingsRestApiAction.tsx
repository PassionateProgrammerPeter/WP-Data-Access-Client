/* eslint-disable @typescript-eslint/no-explicit-any */
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, Switch, TextField } from "@mui/material"
import { MdExpandMore, MdWarning } from "react-icons/md"
import { TablePropsType } from "../../types/TablePropsType"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { RootState } from "../../store/store"
import clonedeep from "lodash.clonedeep"
import log from "loglevel"
import { selectManagerMetaData, selectManagerSettings, updateSettings } from "../../store/managerSlice"
import { ManagerSettingsType } from "../../types/ManagerSettingsType"

type AutocompleteType = {
	key: string,
	value: string,
}

type Props = TablePropsType & {
	action: string,
	setIsUpdated: (isUpdated: boolean) => void,
	expanded: string,
	setExpanded: (expanded: string) => void,

}

const SettingsRestApiAction = (
	{
		dbs,
		tbl,
		action,
		setIsUpdated,
		expanded,
		setExpanded,
	}: Props
) => {

	log.debug(dbs, tbl, action)

	const dispatch = useAppDispatch()

	const metaData: any =
		useAppSelector(
			(state: RootState) =>
				selectManagerMetaData(state)
		)
	log.debug(metaData)

	const roles: AutocompleteType[] = []
	if (metaData?.settings?.wp?.roles !== undefined) {
		for (const role in metaData.settings.wp.roles) {
			roles.push({
				key: role,
				value: metaData.settings.wp.roles[role]
			})
		}
	}
	log.debug(roles)

	const users: AutocompleteType[] = []
	if (metaData?.settings?.wp?.users !== undefined) {
		for (const user in metaData.settings.wp.users) {
			users.push({
				key: user,
				value: metaData.settings.wp.users[user]
			})
		}
	}
	log.debug(users)

	const managerSettings: ManagerSettingsType | undefined =
		useAppSelector(
			(state: RootState) =>
				selectManagerSettings(state)
		)
	log.debug(managerSettings)

	let authorized_roles: string[] = []
	if (managerSettings.rest_api[action]?.authorized_roles !== undefined) {
		authorized_roles = managerSettings.rest_api[action].authorized_roles
	}
	log.debug(authorized_roles)

	let authorized_users: string[] = []
	if (managerSettings.rest_api[action]?.authorized_users !== undefined) {
		authorized_users = managerSettings.rest_api[action].authorized_users
	}
	log.debug(authorized_users)

	const setMethod = (
		method: string,
		addMethod: boolean,
	) => {

		const settings: any = clonedeep(managerSettings)
		if (addMethod) {
			settings.rest_api[action].methods.push(method)
		} else {
			const index = settings.rest_api[action].methods.indexOf(method)
			if (index !== -1) {
				settings.rest_api[action].methods.splice(index, 1)
			}
		}

		dispatch(
			updateSettings({
				settings: settings
			})
		)

		setIsUpdated(true)

	}

	const setAuthorization = (
		authorization: string
	) => {

		const settings: any = clonedeep(managerSettings)
		settings.rest_api[action].authorization = authorization

		dispatch(
			updateSettings({
				settings: settings
			})
		)

		setIsUpdated(true)

	}

	const setRoles = (
		roles: AutocompleteType[]
	) => {

		const settings: any = clonedeep(managerSettings)
		settings.rest_api[action].authorized_roles = roles.map(x => x.key)

		dispatch(
			updateSettings({
				settings: settings
			})
		)

		setIsUpdated(true)

	}

	const setUsers = (
		users: AutocompleteType[]
	) => {

		const settings: any = clonedeep(managerSettings)
		settings.rest_api[action].authorized_users = users.map(x => x.key)

		dispatch(
			updateSettings({
				settings: settings
			})
		)

		setIsUpdated(true)

	}

	return (

		<Accordion
			disableGutters={true}
			expanded={expanded === action}
			onChange={() => {
				if (expanded === action) {
					setExpanded("")
				} else {
					setExpanded(action)
				}
			}}
		>
			<AccordionSummary
				expandIcon={<MdExpandMore />}
				sx={{
					textTransform: "capitalize",
				}}
			>
				{action}
			</AccordionSummary>

			<AccordionDetails>
				<Box>
					<FormLabel>
						Supported HTTP methods
					</FormLabel>

					<Box
						sx={{
							marginTop: "20px",
							marginBottom: "20px",
						}}
					>
						<FormControlLabel
							control={
								<Switch
									checked={managerSettings.rest_api?.[action]?.methods?.includes("GET")}
									onClick={(event: React.MouseEvent): void => {
										setMethod("GET", !managerSettings.rest_api?.[action]?.methods?.includes("GET"))

										event.stopPropagation()
									}}
								/>
							}
							label="GET"
							labelPlacement="end"
						/>

						<FormControlLabel
							control={
								<Switch
									checked={managerSettings.rest_api?.[action]?.methods?.includes("POST")}
									onClick={(event: React.MouseEvent): void => {
										setMethod("POST", !managerSettings.rest_api?.[action]?.methods?.includes("POST"))
										event.stopPropagation()
									}}
								/>
							}
							label="POST"
							labelPlacement="end"
						/>
					</Box>

					<Box
						sx={{
							marginTop: "20px",
							marginBottom: "20px",
						}}
					>
						<FormLabel>
							Authorization
						</FormLabel>

						<Box
							sx={{
								marginTop: "10px",
								marginBottom: "20px",
							}}
						>
							<RadioGroup>
								<FormLabel
									className="align-label-radio"
									sx={{
										cursor: "pointer",
									}}
								>
									<Radio
										checked={managerSettings.rest_api?.[action]?.authorization === "authorized"}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											setAuthorization("authorized")
											event.stopPropagation()
										}}
									/>
									Authorized access only
								</FormLabel>

								<Box
									sx={{
										display: "grid",
										gridGap: "10px",
										margin: "20px",
									}}
								>
									<Autocomplete
										multiple
										options={roles}
										getOptionLabel={(option: any) => option.value}
										value={roles.filter(x => authorized_roles.includes(x.key))}
										onChange={(_event, newInputValue) => {
											setRoles(newInputValue)
										}}
										renderInput={(params) => (
											<TextField {...params} label="Roles" />
										)}
									/>

									<Autocomplete
										multiple
										options={users}
										getOptionLabel={(option: any) => option.value}
										value={users.filter(x => authorized_users.includes(x.key))}
										onChange={(_event, newInputValue) => {
											setUsers(newInputValue)
										}}
										renderInput={(params) => (
											<TextField {...params} label="Users" />
										)}
									/>
								</Box>

								<FormLabel
									className="align-label-radio"
									sx={{
										cursor: "pointer",
									}}
								>
									<Radio
										checked={managerSettings.rest_api?.[action]?.authorization === "anonymous"}
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											setAuthorization("anonymous")
											event.stopPropagation()
										}}
									/>
									Anonymous access
								</FormLabel>

								{
									managerSettings.rest_api?.[action]?.authorization === "anonymous" &&
									(
										action === "insert" ||
										action === "update" ||
										action === "delete"
									) &&

									<FormHelperText
										sx={{
											display: "inline-grid",
											gridTemplateColumns: "20px auto",
											gridGap: "10px",
											margin: "20px 0 0 0",
											padding: 0,
											alignItems: "center",
											fontWeight: "900",
											"& svg": {
												fontSize: "20px",
											}
										}}
									>
										<MdWarning />
										Use this setting only if you know what you are doing
									</FormHelperText>
								}

								{
									managerSettings.rest_api?.[action]?.authorization === "anonymous" &&
									action === "select" &&

									<FormHelperText
										sx={{
											margin: "20px 0 0 0",
											padding: 0,
											alignItems: "center",
											fontWeight: "900",
											"& svg": {
												fontSize: "20px",
											}
										}}
									>
										This setting allows non-authorized users to query this table
									</FormHelperText>
								}
							</RadioGroup>
						</Box>
					</Box>
				</Box>
			</AccordionDetails>
		</Accordion>

	)

}

export default SettingsRestApiAction