import express, { type Application, type Request, type Response } from "express"
import { pool } from "./DB"
import { userRoute } from "./modules/user/user.route"
const app: Application = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

app.get('/api/', (req: Request, res: Response) => {
    res.status(200).json({
        "message": "Express Server",
        "author": "Mohammad Abu Naim"
    })
})



app.use('/api/users', userRoute)

app.get('/api/users', userRoute)

app.get('/api/users', userRoute)


app.put('/api/users', userRoute)

app.delete('/api/users', userRoute)


export default app