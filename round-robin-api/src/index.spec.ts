import { expect } from "@jest/globals"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import request from "supertest"
import { bootstrap } from "./bootstrap"

jest.mock("./config", () => ({
  getConfig: () => ({ APPLICATION_ENDPOINTS: ["http://api:3001"] }),
}))
jest.mock("node-cron", () => {
  return {
    schedule: jest.fn((_, callback) => callback()),
  }
})

describe("POST /", () => {
  const server = setupServer(
    http.get("http://api:3001/health-check", () => {
      return new Response("ok", {
        status: 200,
      })
    }),
    http.post("http://api:3001/", async ({ request }) => {
      const body = await request.json()
      return HttpResponse.json(body)
    })
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it("calls API and receives response with x-endpoint header", async () => {
    return request(bootstrap())
      .post("/")
      .send({ hello: "world" })
      .expect(200)
      .then(({ body, header }) => {
        expect(body).toEqual({ hello: "world" })
        expect(header).toEqual(
          expect.objectContaining({ "x-endpoint": "http://api:3001" })
        )
      })
  })
})
