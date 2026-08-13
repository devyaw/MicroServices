import "dotenv/config"
import express from "express"
import helmet from "helmet"

const app = express()
app.use(express.json())

app.use(helmet())


const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
