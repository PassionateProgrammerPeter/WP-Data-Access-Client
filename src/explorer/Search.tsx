import { Box, IconButton, InputAdornment, TextField } from "@mui/material"
import { useState } from "react"
import { MdFilterAlt, MdSearch } from "react-icons/md"
import SearchSettings from "./SearchSettings"

type Props = {
	search: string,
	setSearch: (search: string) => void,
	addFilter?: boolean,
}

const Search = (
	{
		search,
		setSearch,
		addFilter,
	}: Props

) => {

	const [showFilter, setShowFilter] = useState<boolean>(false)

	return (

		<Box
			sx={{
				position: "relative",
				marginRight: "20px",
			}}
		>
			<TextField
				value={search}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
					setSearch(event.target.value)
				}}
				onClick={(event: React.MouseEvent) => {
					event.stopPropagation()
				}}
				sx={{
					backgroundColor: "#fff",
					fontSize: "1em",
					margin: 0,
					padding: 0,
					borderRadius: "4px",
					"&.MuiFormControl-root.MuiTextField-root .MuiInputBase-root": {
						paddingRight: 0,
					},
					"&.MuiFormControl-root.MuiTextField-root input": {
						padding: "8px",
					},
				}}
				InputProps={{
					startAdornment:
						<InputAdornment
							position="end"
							sx={{
								fontSize: "1.5rem",
								padding: 0,
								margin: 0,
							}}
						>
							<MdSearch />
						</InputAdornment>,
					endAdornment:
						<>
							{
								addFilter &&
								
								<InputAdornment
									position="end"
									sx={{
										fontSize: "1.5rem",
										padding: 0,
										margin: 0,
									}}
								>
									<IconButton
										onClick={() => {
											setShowFilter(!showFilter)
										}}
									>
										<MdFilterAlt />
									</IconButton>
								</InputAdornment>
							}
						</>
				}}
			/>
			{
				showFilter &&

				<SearchSettings
					setShowFilter={setShowFilter}
				/>
			}
		</Box>

	)

}

export default Search