import { useState, MouseEvent, ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { RootState } from "../store/store"
import { selectDrawerAnchor, selectDrawerWidth, setDrawerWidth } from "../store/uiSlice"
import Drawer from "@mui/material/Drawer"
import { DrawerStateType } from "../types/DrawerStateType"
import { Constants } from "./Constants"
import { AnchorEnum } from "../enums/AnchorEnum"
import CSS from "csstype"
import log from "loglevel"

type Props = {
	closeDrawer: () => void,
	children: ReactNode,
}

const ResizableDrawer = (
	{
		closeDrawer,
		children,
	}: Props
) => {

	const dispatch = useAppDispatch()

	const drawerWidth: number =
		useAppSelector(
			(state: RootState) =>
				selectDrawerWidth(state)
		)
	const setWidth = (width: number): void => {
		dispatch(
			setDrawerWidth({
				width: width
			})
		)
	}

	const anchor: AnchorEnum =
		useAppSelector(
			(state: RootState) =>
				selectDrawerAnchor(state)
		)
	log.debug(anchor)

	const [drawerState, setDrawerState] = useState<DrawerStateType>({
		isResizing: false,
		mouseX: undefined
	})

	const handleMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
		const newDrawerState = {
			...drawerState,
			...{
				isResizing: true,
				mouseX: e.clientX
			}
		}
		setDrawerState(newDrawerState)
	}

	const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
		if (drawerState.isResizing) {
			const drawer = document.getElementById("pp-setting-drawer")
			const drawerRoot = document.getElementById("pp-setting-drawer-root")
			if (drawer && drawerState.mouseX && drawerRoot) {
				let width: number
				if (anchor === AnchorEnum.RIGHT) {
					width = drawer.offsetWidth - (e.clientX - drawerState.mouseX)
				} else {
					width = drawer.offsetWidth + (e.clientX - drawerState.mouseX)
				}
				if (width > Constants.drawerMinWidth && width < Math.min(Constants.drawerMaxWidth, drawerRoot.offsetWidth * 0.9)) {
					const newDrawerState = {
						...drawerState,
						...{
							mouseX: e.clientX
						}
					}
					setWidth(width)
					setDrawerState(newDrawerState)
				}
			}
		}
	}

	const handleMouseUp = (): void => {
		const newDrawerState = {
			...drawerState,
			...{
				isResizing: false
			}
		}
		setDrawerState(newDrawerState)
	}

	// Prevent freezing drawer if initial value is outside range
	let realWidth = drawerWidth
	if (realWidth < Constants.drawerMinWidth) {
		realWidth = Constants.drawerMinWidth
	} else if (realWidth > Constants.drawerMaxWidth) {
		realWidth = Constants.drawerMaxWidth
	}

	const style: CSS.Properties = {
		width: "5px",
		cursor: "ew-resize",
		padding: "4px 0 0",
		borderLeft: "1px solid #ddd",
		position: "absolute",
		top: "0",
		bottom: "0",
		zIndex: "9999",
		backgroundColor: "#f4f7f9"
	}

	if (anchor === AnchorEnum.RIGHT) {
		style.left = "0"
	} else {
		style.right = "0"
	}

	log.debug(style)

	return (

		<Drawer
			id="pp-setting-drawer-root"
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			anchor={anchor}
			open={true}
			ModalProps={{
				onClose:(() => {
					closeDrawer()
				})
			}}
			PaperProps={{
				sx: {
					overflow: "hidden",
					width: realWidth,
					borderTop: "4px solid #f4f7f9",
					borderBottom: "4px solid #f4f7f9",
					height: "calc(100% - 8px)",
					boxSizing: "content-box",
				},
				id: "pp-setting-drawer"
			}}
			hideBackdrop={false}
			sx={{
				"& .MuiBackdrop-root": {
					opacity: "0.2 !important",
				}
			}}
		>

			<div
				onMouseDown={handleMouseDown}
				style={style}
			/>

			{children}

		</Drawer>

	)
}

export default ResizableDrawer