import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import communityRoutes from './routes/communityRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import platformRoutes from './routes/platformRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true, credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' })
})

app.use(healthRoutes)

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api', platformRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
