import express from "express"
import cron from "node-cron"
import { RoundRobin } from "./round-robin"
import {
  initServerStatus,
  isServerHealthy,
  ServerStatus,
} from "./server-status"

const app = express()
const port = process.env.PORT || 3000
const serverStatuses = initServerStatus()
const roundRobin = new RoundRobin()

app.use(express.json())

app.get("/", (_, res) => {
  res.send("Hello World!")
})

app.post("/", async (req, res) => {
  try {
    const endpoint = roundRobin.getHealthyEndpoint(serverStatuses)
    if (!endpoint) {
      throw new Error("server unavailable")
    }

    console.log("endpoint", endpoint)
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": "application/json",
      },
    })

    return res.send(await response.json())
  } catch (error) {
    console.error(error)
  }

  res.send(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const checkAllServerHealths = async (
  serverStatuses: ServerStatus[]
): Promise<void> => {
  for (let i = 0; i < serverStatuses.length; i++) {
    const serverStatus = serverStatuses[i]
    const url = `${serverStatus.endpoint}/health-check`
    serverStatus.isHealthy = await isServerHealthy(url)
  }
}

cron.schedule("* * * * * *", async () => {
  await checkAllServerHealths(serverStatuses)
})
