import express from "express"
import {
  initServerStatus,
  isServerHealthy,
  ServerStatus,
} from "./server-status"

const app = express()
const port = process.env.PORT || 3000
const serverStatuses = initServerStatus()

app.use(express.json())

app.get("/", (_, res) => {
  res.send("Hello World!")
})

app.post("/", (req, res) => {
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

checkAllServerHealths(serverStatuses)
