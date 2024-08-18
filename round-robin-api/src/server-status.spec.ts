import { describe, expect, it, jest } from "@jest/globals"
import { getConfig } from "./config"
import { initServerStatus } from "./server-status"

jest.mock("./config")

describe("initServerStatus", () => {
  it("returns empty array when applicationEndpoints is empty", () => {
    jest
      .mocked(getConfig)
      .mockImplementation(() => ({ APPLICATION_ENDPOINTS: [] }))

    const serverStatuses = initServerStatus()

    expect(serverStatuses).toEqual([])
  })

  it("returns all servers as endpoints with isHealthy status false", () => {
    jest.mocked(getConfig).mockImplementation(() => ({
      APPLICATION_ENDPOINTS: ["endpoint1", "endpoint2"],
    }))

    const serverStatuses = initServerStatus()

    expect(serverStatuses).toEqual([
      { endpoint: "endpoint1", isHealthy: false },
      { endpoint: "endpoint2", isHealthy: false },
    ])
  })
})
