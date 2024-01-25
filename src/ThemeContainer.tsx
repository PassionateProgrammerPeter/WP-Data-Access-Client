/* eslint-disable @typescript-eslint/no-explicit-any */
import Container from "./Container"
import log from "loglevel"

type Props = {
	appId: string,
}

const ThemeContainer = (
	{
		appId,
	}: Props
) => {

	log.debug(appId)


	return (

			<Container
				appId={appId}
			/>

	)

}

export default ThemeContainer