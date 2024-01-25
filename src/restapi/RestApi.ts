import axios from "axios"
import { Config } from "../utils/Config"
import log from "loglevel"

export const RestApi = (
	action: string,
	data: object,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: any
) => {
	log.debug(action, data)

	let headers = {}
	if (Config.appPlugin) {
		// Adding WordPress support when available
		headers = {
			headers: {
				"X-WP-Nonce": Config.appToken
			}
		}
	}

	axios.post(
		Config.appUrl + action,
		data,
		headers
	)
		.then((response) => {
			log.debug(data, response)
			if (response?.data) {
				callback(response.data)
			} else {
				callback(response)
			}
		})
		.catch(error => {
			log.error(error)
			if (error?.response?.data) {
				callback(error.response.data)
			} else (
				callback(error)
			)
		})
}

export const RestApiPromise = async (
	action: string,
	data: object
) => {
	log.debug(action, data)

	let headers = {}
	if (Config.appPlugin) {
		// Adding WordPress support when available
		headers = {
			headers: {
				"X-WP-Nonce": Config.appToken
			}
		}
	}

	return await axios.post(
		Config.appUrl + action,
		data,
		headers
	)
		.then(
			response => {
				log.debug(response)
				return response
			}
		)
		.catch(
			error => { 
				console.error(error)
				return Promise.reject(error) 
			}
		)
}