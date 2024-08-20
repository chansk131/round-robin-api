import { getConfig } from "./config"

export type ServerStatus = {
  endpoint: string
  isHealthy: boolean
}

export const initServerStatus = () => {
  const applicationEndpoints = getConfig().APPLICATION_ENDPOINTS
  console.log({ applicationEndpoints })

  return applicationEndpoints.map((endpoint) => ({
    endpoint,
    isHealthy: false,
  }))
}

export const isServerHealthy = async (
  url: string,
  timeout = 500
): Promise<boolean> => {
  try {
    console.log("checking health for endpoint", url)
    const response = await fetch(url, { signal: AbortSignal.timeout(timeout) })
    if (response.ok) {
      console.log("server is ok")
      return true
    }

    console.log("server response NOT ok")
    return false
  } catch (error) {
    console.error(error, url)
    return false
  }
}
