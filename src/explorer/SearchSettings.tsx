import { Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, FormControl, FormLabel } from "@mui/material"
import { DatabaseTypeEnum } from "../enums/DatabaseTypeEnum"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { RootState } from "../store/store"
import { addDbsType, deleteDbsType, selectDbsTypes } from "../store/explorerSlice"
import { DatabaseTreeActionType } from "../types/DatabaseTreeActionType"
import log from "loglevel"
import { selectAction } from "../store/uiSlice"

type Props = {
	setShowFilter: (filter: boolean) => void
}

const SearchSettings = (
	{
		setShowFilter
	}: Props
) => {

	const dispatch = useAppDispatch()

	const dbsTypes: DatabaseTypeEnum[] =
		useAppSelector(
			(state: RootState) =>
				selectDbsTypes(state)
		)
	log.debug(dbsTypes)

	const action: DatabaseTreeActionType | undefined =
		useAppSelector(
			(state: RootState) =>
				selectAction(state)
		)
	log.debug(action)

	const saveSettings = () => {
		localStorage.setItem("ppDbsTypes", JSON.stringify(dbsTypes))
	}

	return (

		<Card
			sx={{
				position: "absolute",
				top: "4em",
				right: "0",
				minWidth: "-webkit-fill-available",
				zIndex: 9999999
			}}
		>
			<CardHeader
				title="Database filter"
				sx={{
					textAlign: "center",
				}}
			/>

			<CardContent
				sx={{
					textAlign: "center",
					padding: "0 1em 1em 0"
				}}
			>
				<Box
					sx={{
						display: "inline-grid",
						textAlign: "left"
					}}
				>
					<FormControl>
						<FormLabel>
							<Checkbox
								checked={dbsTypes.includes(DatabaseTypeEnum.WP)}
								onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
									if (checked) {
										dispatch(
											addDbsType({
												dbsType: DatabaseTypeEnum.WP
											})
										)
									} else {
										dispatch(
											deleteDbsType({
												dbsType: DatabaseTypeEnum.WP
											})
										)
									}
								}}
							/>
							WordPress database
						</FormLabel>

					</FormControl>
					<FormControl>
						<FormLabel>
							<Checkbox
								checked={dbsTypes.includes(DatabaseTypeEnum.LOCAL)}
								onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
									if (checked) {
										dispatch(
											addDbsType({
												dbsType: DatabaseTypeEnum.LOCAL
											})
										)
									} else {
										dispatch(
											deleteDbsType({
												dbsType: DatabaseTypeEnum.LOCAL
											})
										)
									}
								}}
							/>
							Local databases
						</FormLabel>

					</FormControl>
					<FormControl>
						<FormLabel>
							<Checkbox
								checked={dbsTypes.includes(DatabaseTypeEnum.REMOTE)}
								onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
									if (checked) {
										dispatch(
											addDbsType({
												dbsType: DatabaseTypeEnum.REMOTE
											})
										)
									} else {
										dispatch(
											deleteDbsType({
												dbsType: DatabaseTypeEnum.REMOTE
											})
										)
									}
								}}
							/>
							Remote databases
						</FormLabel>

					</FormControl>
					<FormControl>
						<FormLabel>
							<Checkbox
								checked={dbsTypes.includes(DatabaseTypeEnum.SYSTEM)}
								onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
									if (checked) {
										dispatch(
											addDbsType({
												dbsType: DatabaseTypeEnum.SYSTEM
											})
										)
									} else {
										dispatch(
											deleteDbsType({
												dbsType: DatabaseTypeEnum.SYSTEM
											})
										)
									}
								}}
							/>
							System databases
						</FormLabel>
					</FormControl>
				</Box>
			</CardContent>

			<CardActions
				sx={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr"
				}}
			>
				<Button
					variant="contained"
					onClick={() => saveSettings()}
				>
					Remember
				</Button>
				<Button
					variant="contained"
					onClick={() => setShowFilter(false)}
				>
					OK
				</Button>
			</CardActions>
		</Card>

	)

}

export default SearchSettings