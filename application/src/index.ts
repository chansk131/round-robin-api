import express from "express"

const app = express()
const port = process.env.PORT || 3000

let mode: "normal" | "slow" | "error" = "normal"

app.use(express.json())

app.get("/", (_, res) => {
  res.send("Hello World!")
})

app.get("/health-check", async (_, res) => {
  switch (mode) {
    case "normal":
      res.send("OK")
      break
    case "slow":
      await new Promise((resolve) => setTimeout(resolve, 1000))
      res.send("OK")
      break
    case "error":
      res.status(503)
      break
    default:
      break
  }
})

app.post("/", (req, res) => {
  res.send(req.body)
})

app.post("/debug", (req, res) => {
  mode = req.body.mode
  res.send({ mode })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
