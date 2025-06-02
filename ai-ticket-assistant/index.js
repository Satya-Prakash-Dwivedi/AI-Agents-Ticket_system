import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import userRoutes from "./routes/user.js"

const PORT = process.env.PORT || 3000
const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", userRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected ✅")
        app.listen(PORT, () => console.log(`Server 🚀 running at http://localhost:${PORT}`))
    })
    .catch((err) => console.error(" ❌ MongoDB error : ", err))