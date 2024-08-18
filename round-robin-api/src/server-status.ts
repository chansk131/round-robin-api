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
