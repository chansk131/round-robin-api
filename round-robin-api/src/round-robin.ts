import { isServerHealthy, ServerStatus } from "./server-status"

export class RoundRobin {
  private currentServerIndex = 0

  public getHealthyEndpoint(
    serverStatuses: ServerStatus[] = []
  ): string | undefined {
    const healthyServers = serverStatuses
      .filter((serverStatus) => serverStatus.isHealthy)
      .map((serverStatus) => serverStatus.endpoint)

    if (!healthyServers.length) {
      return undefined
    }

    const newServerIndex = this.currentServerIndex % healthyServers.length
    this.currentServerIndex += 1

    const newServerEndpoint = healthyServers[newServerIndex]

    return newServerEndpoint
  }
}
