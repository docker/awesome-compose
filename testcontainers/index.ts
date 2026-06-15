import express from "express"
import { setupRedis } from "./setupRedis.js"

const app = express()
app.use(express.json())

const client = await setupRedis()

app.get("/", async (req, res) => {
  try {
    const newVisitorCount = await client.incr("visitorCount")
    res.send(`You are visitor number ${newVisitorCount}`)
  } catch (error) {
    console.error("Error accessing Redis:", error)
    res.status(500).send("Server error")
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
