import { Router } from 'express'
import { platformSignup } from '../controllers/authController.js'

const router = Router()

router.post('/platform/signup', platformSignup)

export default router

