import { MRT_TableOptions } from "material-react-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableOptions: MRT_TableOptions<any> = {
	columns: [],
	data: [],
	initialState: {},
	enableColumnActions: false,
	enableColumnFilters: false,
	enablePagination: false,
	enableSorting: false,
	enableBottomToolbar: false,
	enableTopToolbar: false,
	muiTableBodyRowProps: {
		hover: true
	},
	muiTableHeadCellProps: {
		sx: {
			paddingTop: "1rem",
			paddingRight: "1rem",
			paddingBottom: "1rem",
			paddingLeft: "1rem",
		}
	},
	muiTableBodyCellProps: {
		sx: {
			verticalAlign: "top"
		}
	},
	muiTableProps: {
		sx: {
			border: "unset",
			"& th, td": {
				borderTop: "unset",
				borderRight: "unset",
				borderLeft: "unset",
			},
		},
	},
	muiTablePaperProps: {
		sx: {
			boxShadow: "none",
			marginRight: "30px",
			marginBottom: "40px",
		}
	},
}