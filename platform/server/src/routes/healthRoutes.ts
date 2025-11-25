import { Router } from 'express'
import os from 'os'
import mongoose from 'mongoose'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), uptime: process.uptime(), host: os.hostname() })
})

router.get('/ready', (_req, res) => {
  const states: Record<number, string> = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  const dbState = states[mongoose.connection.readyState] || 'unknown'
  const ok = mongoose.connection.readyState === 1
  res.json({ db: ok ? 'connected' : dbState, server: 'ready' })
})

export default router

