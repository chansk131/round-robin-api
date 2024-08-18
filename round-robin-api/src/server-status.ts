import { getConfig } from "./config"

export type ServerStatus = {
  endpoint: string
  isHealthy: boolean
}

export const initServerStatus = () => {
  const { APPLICATION_ENDPOINTS: applicationEndpoints } = getConfig()
  console.log({ applicationEndpoints })

  return applicationEndpoints.map((endpoint) => ({
    endpoint,
    isHealthy: false,
  }))
}

export const isServerHealthy = async (url: string): Promise<boolean> => {
  try {
    console.log("checking health for endpoint", url)
    const response = await fetch(url, { signal: AbortSignal.timeout(500) })
    if (response.ok) {
      console.log("server is ok")
      return true
    }

    console.log("server response NOT ok")
    return false
  } catch (error) {
    console.error(error)
    return false
  }
}
