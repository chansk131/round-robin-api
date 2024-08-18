import express from "express"
import { initServerStatus } from "./server-status"

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
