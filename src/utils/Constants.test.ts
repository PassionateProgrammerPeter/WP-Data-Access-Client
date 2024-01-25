import { test, expect } from "vitest"
import { Constants, ConstantsType } from "./Constants"

test("app constants", () => {
	const ref: ConstantsType = {
		drawerMinWidth: 480,
		drawerMaxWidth: 540
	}
	
	expect(Constants).toStrictEqual(ref)
})