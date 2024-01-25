import { Theme, createTheme } from "@mui/material/styles"
import * as color from "@mui/material/colors"
import type { } from "@mui/x-tree-view/themeAugmentation"
import log from "loglevel"

export let AdminTheme: Theme | undefined

export const AdminThemeInit = () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const borderRadius: string = "4px"

	log.debug("init admin theme")
	
	AdminTheme = createTheme({
		palette: {
			mode: "light",
			primary: {
				main: color.grey[900],
			},
			secondary: {
				main: color.grey[200],
			},
		},
		typography: {
			fontFamily: "inherit",
			fontSize: undefined
		},
		components: {
			MuiPaper: {
				styleOverrides: {
					root: {
						borderRadius: borderRadius,
					},
				},
			},
			MuiToolbar: {
				styleOverrides: {
					root: {
						borderRadius: borderRadius,
					},
				},
			},
			MuiInputBase: {
				styleOverrides: {
					root: {
						input: {
							color: color.blue[900],
							backgroundColor: "transparent",
							borderColor: "rgba(0, 0, 0, 0.23)",
							fontWeight: "normal",
							padding: "16.5px 14px",
							border: "none",
						},
						"input:focus, textarea:focus": {
							boxShadow: "none",
							outline: "none",
						},
					},
				},
			},
			MuiFormControlLabel: {
				styleOverrides: {
					label: {
						fontSize: "1rem",
					},
				},
			},
			MuiFormLabel: {
				styleOverrides: {
					root: {
						borderRadius: borderRadius,
						fontSize: "1rem",
					},
				},
			},
			MuiInputLabel: {
				defaultProps: { 
					shrink: true
				},
			},
			MuiOutlinedInput: {
				defaultProps: {
					notched: true,
				},
			},
			MuiFormHelperText: {
				styleOverrides: {
					root: {
						fontSize: "0.75rem",
					},
				},
			},
			MuiAccordionSummary: {
				styleOverrides: {
					root: {
						fontSize: 19,
						marginTop: "1px",
					},
					content: {
						fontWeight: "normal",
						padding: "20px 20px 20px 20px",
					},
				},
			},
			MuiAccordionDetails: {
				styleOverrides: {
					root: {
						margin: "0 40px 45px 40px",
						padding: 0,
					},
				},
			},
			MuiLink: {
				styleOverrides: {
					root: {
						color: color.blue[700],
					},
				},
			},
			MuiTreeView: {
				styleOverrides: {
					root: {
						backgroundColor: "#fff !important",
						"& .MuiTreeItem-iconContainer": {
							color: "rgba(0, 0, 0, 0.34)",
						},
						"& .MuiTreeItem-content:hover": {
							backgroundColor: "unset !important",
						},
						"& .Mui-expanded": {
							backgroundColor: "unset !important",
						},
						"& .Mui-selected": {
							backgroundColor: "unset !important",
						},
						"& .Mui-focused": {
							backgroundColor: "unset !important",
						},
					},
				},
			},
			MuiTreeItem: {
				styleOverrides: {
					root: {
						borderTop: "1px solid rgba(0, 0, 0, 0.34)",
						"& .MuiTreeItem-content": {
							flexDirection: "row-reverse",
							padding: "0 20px 0 30px",
							height: "86px",
						},
						"& .MuiTreeItem-content:hover": {
							backgroundColor: "unset !important",
						},
						"& .Mui-expanded": {
							backgroundColor: "unset !important",
						},
						"& .Mui-selected": {
							backgroundColor: "unset !important",
						},
						"& .Mui-focused": {
							backgroundColor: "unset !important",
						},
						"& .MuiTreeItem-group": {
							marginLeft: "30px",
						}
					},
				},
			},
		},
		zIndex: {
			drawer: 9999999,
			modal: 99999990,
			tooltip: 99999999,
			snackbar: 999999999,
		},
	})

	return AdminTheme
}