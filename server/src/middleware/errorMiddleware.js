export function notFound(req, res, next) {
  res.status(404)
  res.json({ success: false, message: `Not Found - ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  console.error(err)
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
  })
}