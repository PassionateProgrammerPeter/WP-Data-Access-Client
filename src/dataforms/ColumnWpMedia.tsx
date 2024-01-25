import { useRef } from "react"
import { Config } from "../utils/Config"
import { useAppDispatch } from "../store/hooks"
import { updateMediaColumn } from "../store/formSlice"
import { Button, FormControl } from "@mui/material"
import { ColumnPropsType } from "../types/ColumnPropsType"
import { getSimpleDataType } from "../ts/lib"
import { FaFilePdf, FaFilm, FaImage, FaMedapps, FaMusic } from "react-icons/fa6"
import log from "loglevel"

type Props = ColumnPropsType & {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	columnMedia: any,
	mediaType: string
}

const mediaTitle: string = "Upload or select %s from your WordPress media library"

const ColumnWpMedia = (
	{
		appId,

		columnName,
		columnValue,
		columnMetaData,
		onColumnChange,
		
		columnMedia,
		mediaType
	}: Props
) => {

	log.debug(
		appId,

		columnName,
		columnValue,
		columnMetaData,

		columnMedia,
		mediaType
	)

	const inputRef = useRef(null)

	const dispatch = useAppDispatch()

	const getMediaInfo = (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		mediaObject: any
	) => {

		log.debug(mediaObject)

		if (
			mediaObject?.id &&
			mediaObject?.url &&
			mediaObject?.mime &&
			mediaObject?.title
		) {
			return {
				value: mediaObject.id,
				media: {
					url: mediaObject.url,
					mime_type: mediaObject.mime,
					title: mediaObject.title
				}
			}
		}

		return undefined

	}

	const updateMedia = (): void => {

		log.debug("update media")

		const isMultiple: boolean = getSimpleDataType(columnMetaData.data_type) !== "number"
		log.debug(isMultiple)

		let frameTitle: string = "media"
		let libMediaType: string = ""
		switch (mediaType) {
			case "WP-Image":
				frameTitle = "images(s)"
				libMediaType = "image"
				break
			case "WP-Audio":
				frameTitle = "audio"
				libMediaType = "audio"
				break
			case "WP-Video":
				frameTitle = "video(s)"
				libMediaType = "video"
				break
		}
		log.debug(frameTitle, libMediaType)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const frame = (window as any).wp.media({
			title: mediaTitle.replace("%s", frameTitle),
			button: {
				text: 'Select'
			},
			library: {
				type: libMediaType
			},
			multiple: isMultiple,
			render: false
		})

		log.debug(frame)

		frame.on("select", function () {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const media: any = []
			if (isMultiple) {
				const mediaArray = frame.state().get('selection').toJSON()
				log.debug(mediaArray)

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				mediaArray.map((mediaElement: any) => {
					log.debug(mediaElement)
					const mediaObject = getMediaInfo(mediaElement)
					if (mediaObject) {
						media.push(mediaObject)
					}
				})
			} else {
				const mediaObject = getMediaInfo(frame.state().get('selection').first().toJSON())
				if (mediaObject) {
					media.push(mediaObject)
				}
			}

			log.debug(media)

			const mediaIds = []
			const mediaObjects = []
			for (let i = 0; i < media.length; i++) {
				mediaIds.push(media[i].value)
				mediaObjects.push(JSON.stringify(media[i].media))
			}

			log.debug(mediaIds, mediaObjects)

			// Update state
			onColumnChange(columnName, mediaIds.toString())

			// Update media column
			dispatch(
				updateMediaColumn({
					appId: appId,
					columnName: columnName,
					columnValue: mediaObjects
				})
			)
		})

		frame.open()

	}

	const deleteMedia = (): void => {

		log.debug("delete media")

		// Update state
		onColumnChange(columnName, null)

		// Update media column
		dispatch(
			updateMediaColumn({
				appId: appId,
				columnName: columnName,
				columnValue: []
			})
		)

	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const showMediaElement = (mediaObject: any) => {

		switch (mediaType) {

			case "WP-Image": {

				return (

					<img
						src={mediaObject.url}
						title={mediaObject.title}
						alt={mediaObject.title}
					/>

				)

			}

			case "WP-Attachment": {

				const mime_type = mediaObject.mime_type.split("/")

				return (

					<a
						href={mediaObject.url}
						title={mediaObject.title}
						target="_blank"
						className="pp-hyperlink"
					>
						<div>
							{ mime_type[0] === "image" && <FaImage /> }
							{ mime_type[0] === "audio" && <FaMusic /> }
							{ mime_type[0] === "video" && <FaFilm /> }
							{ mime_type[0] === "application" ? mime_type[1] === "pdf" ? <FaFilePdf /> : <FaMedapps />: <></> }
						</div>
						<div className="link-label">
							{mediaObject.title}
						</div>
					</a>

				)

			}

			case "WP-Audio": {

				return (

					<audio controls>
						<source
							src={mediaObject.url}
							type={mediaObject.mime_type}
						/>
					</audio>

				)

			}

			case "WP-Video": {

				return (

					<video controls>
						<source
							src={mediaObject.url}
							type={mediaObject.mime_type}
						/>
					</video>

				)

			}

		}

	}

	return (

		<div className={`media ${mediaType}`}>

			<FormControl>

				{

					columnMedia?.map((value: string) => {

						try {

							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const mediaObject: any = JSON.parse(value)

							if (!mediaObject?.url) {

								return null

							}

							return (

								<div
									ref={inputRef}
									key={mediaObject.url}
									className="content"
								>
									{
										showMediaElement(mediaObject)

									}
								</div>

							)

						} catch (error) {

							log.error("Invalid media properties", error)

							return (

								<span>
									Error reading media
								</span>

							)

						}

					})

				}

				<input type="hidden" value={columnValue} />

			</FormControl>

			<div className="actions">

				<Button
					variant="outlined"
					onClick={updateMedia}
					disabled={!Config.appPlugin}
				>
					Select
				</Button>

				<Button
					variant="outlined"
					onClick={deleteMedia}
					disabled={!Config.appPlugin}
				>
					Delete
				</Button>

			</div>

		</div>

	)

}

export default ColumnWpMedia