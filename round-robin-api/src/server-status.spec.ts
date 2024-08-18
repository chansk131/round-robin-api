import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals"
import { delay, http } from "msw"
import { setupServer } from "msw/node"
import { getConfig } from "./config"
import { initServerStatus, isServerHealthy } from "./server-status"

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

describe("isServerHealthy", () => {
  const server = setupServer()

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it("returns true when API call responses with ok", async () => {
    server.use(
      http.get("http://localhost:3000/health-check", () => {
        return new Response("ok", {
          status: 200,
        })
      })
    )

    const result = await isServerHealthy("http://localhost:3000/health-check")

    expect(result).toBe(true)
  })

  it("returns false when API call NOT responses with ok", async () => {
    server.use(
      http.get("http://localhost:3000/health-check", () => {
        return new Response("Gateway Timeout", {
          status: 504,
        })
      })
    )

    const result = await isServerHealthy("http://localhost:3000/health-check")

    expect(result).toBe(false)
  })

  it("returns false when API times out", async () => {
    server.use(
      http.get("http://localhost:3000/health-check", async () => {
        await delay(1000)
        return new Response("ok", {
          status: 200,
        })
      })
    )

    const result = await isServerHealthy("http://localhost:3000/health-check")

    expect(result).toBe(false)
  })
})
