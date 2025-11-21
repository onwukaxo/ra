import { Router } from 'express'
import { getPublicSettings } from '../controllers/settingsController.js'

const router = Router()

router.get('/settings', getPublicSettings)

export default router