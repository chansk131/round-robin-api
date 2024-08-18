import express from "express"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get("/", (_, res) => {
  res.send("Hello World!")
})

app.get("/health-check", (_, res) => {
  res.send("OK")
})

app.post("/", (req, res) => {
  res.send(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
