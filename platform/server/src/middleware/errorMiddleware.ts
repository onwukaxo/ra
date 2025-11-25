import { Request, Response, NextFunction } from 'express'

export function notFound(req: Request, res: Response, _next: NextFunction) {
  res.status(404)
  res.json({ success: false, message: `Not Found - ${req.originalUrl}` })
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error(err)
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
  })
}
