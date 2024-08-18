import { describe, expect, it, jest } from "@jest/globals"
import { RoundRobin } from "./round-robin"
import { isServerHealthy } from "./server-status"

jest.mock("./server-status")

describe("RoundRobin", () => {
  describe("getHealthyEndpoint", () => {
    it("returns undefined when serverStatuses are empty", () => {
      const roundRobin = new RoundRobin()

      const result = roundRobin.getHealthyEndpoint([])

      expect(result).toBeUndefined()
    })

    it("returns undefined when serverStatus are all unhealthy", () => {
      const roundRobin = new RoundRobin()

      const result = roundRobin.getHealthyEndpoint([
        { endpoint: "1", isHealthy: false },
      ])

      expect(result).toBeUndefined()
    })

    it("returns healthy endpoint if server is healthy", () => {
      const roundRobin = new RoundRobin()

      const result = roundRobin.getHealthyEndpoint([
        { endpoint: "1", isHealthy: true },
        { endpoint: "2", isHealthy: false },
      ])

      expect(result).toBe("1")
    })
  })
})
