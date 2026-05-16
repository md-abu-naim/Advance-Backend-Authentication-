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

app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users
            `)

        res.status(200).json({
            success: true,
            message: "Users retrived successfully",
            data: result.rows,
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})

app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await pool.query(`
            SELECT * FROM users WHERE id=$1
            `, [id])

        if (result.rows?.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            })
        }

        res.status(200).json({
            success: true,
            message: "User retrived successfully",
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})


app.put('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, password, is_active } = req.body
        const result = await pool.query(`
            UPDATE users SET
             name=COALESCE($1, name),
              password=COALESCE($2, password),
               is_active=COALESCE($3, is_active)

             WHERE id=$4 RETURNING *
            `, [name, password, is_active, id])

        if (result.rows?.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            })
        }

        res.status(200).json({
            success: true,
            message: "User update successfully",
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})

app.delete('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await pool.query(`
            DELETE FROM users WHERE id=$1
            `, [id])

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            })
        }

        res.status(200).json({
            success: true,
            message: "User delete successfully",
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
})


export default app