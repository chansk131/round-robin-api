type Config = {
  APPLICATION_ENDPOINTS: string[]
}

export const getConfig = (): Config => {
  const applicationPorts = process.env.ALL_PORTS
    ? process.env.ALL_PORTS.split(",")
    : []

  return {
    APPLICATION_ENDPOINTS: applicationPorts.map(
      (port) => `${process.env.APPLICATION_URL}:${port}`
    ),
  }
}
