// client/src/pages/Payment.jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'
import { SITE, buildWhatsappOrderMessage } from '../config/site'

export default function Payment() {
  const { items, clearCart, total } = useCart()
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: location } })
    }
  }, [loading, user, navigate, location])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [orderCreated, setOrderCreated] = useState(false)
  const [orderRef] = useState(() => `RAT-${Date.now()}`)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [lastOrderId, setLastOrderId] = useState(null)


  const grandTotal = useMemo(() => total, [total])

  const handleWhatsappCheckout = () => {
    const msg = buildWhatsappOrderMessage(items, { subtotal: total, total: grandTotal }, {})
    const url = `${SITE.contacts.whatsapp}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  const handleCreateOrder = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    if (items.length === 0) return
    setSubmitting(true)
    setMessage('')
    try {
      const payload = {
        items: items.map(i => ({ menuItem: i.menuItem._id, quantity: i.quantity, sauce: i.sauce })),
        notes: `OrderRef: ${orderRef}`,
        total,
        paymentMethod: 'bank_transfer',
      }
      const res = await api.post('/orders', payload)
      setOrderCreated(true)
      clearCart()
      setMessage('Order created. Please complete bank transfer to finalize.')
      setOrderSuccess(true)
      if (res?.data?.data?._id) {
        setLastOrderId(res.data.data._id)
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create order.')
    } finally {
      setSubmitting(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="space-y-4">
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <p className="font-semibold mb-1">Thank you! Your order has been placed.</p>
            <p className="mb-2">You can track your orders and see their status on your orders page.</p>
            <Link to="/orders" className="inline-flex items-center text-xs font-semibold text-ration-dark underline underline-offset-2 hover:text-ration-dark-hover">View my orders</Link>
            {lastOrderId && (
              <div className="mt-1 text-xs text-slate-600">Order ID: #{String(lastOrderId).slice(-6)}</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Checking session...</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Payment</h1>

        {items.length === 0 && !orderCreated ? (
          <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm">
            <p className="text-slate-600">{message || 'Your cart is empty. Add items from the menu.'}</p>
            <div className="mt-3">
              <Link to="/menu" className="px-4 py-2 rounded-full bg-ration-dark text-white text-sm">Back to Menu</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white border border-slate-100 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <div className="text-xs text-slate-600">Ref: {orderRef}</div>
              </div>
              <ul className="mt-2 space-y-2 text-sm">
                {items.map((i) => (
                  <li key={i.menuItem._id} className="flex justify-between">
                    <div>
                      <div className="font-medium">{i.menuItem.name}</div>
                      {i.sauce && <div className="text-xs text-slate-600">Sauce: {i.sauce}</div>}
                    </div>
                    <div className="text-slate-700">₦{(i.menuItem.price * i.quantity).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>₦{grandTotal.toLocaleString()}</span>
              </div>
              {items.length > 0 && (
                <div className="mt-1 text-xs text-slate-600">Delivery fee is paid to the rider upon delivery.</div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleCreateOrder}
                disabled={submitting || items.length === 0}
                className="hidden w-full px-4 py-2 rounded-full bg-ration-dark text-ration-yellow text-sm hover:bg-primary-600 disabled:opacity-60"
              >
                {submitting ? 'Creating order...' : 'Pay via bank transfer'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Bank Details</h2>
        <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm">
          <div className="font-semibold mb-1">Amount to pay: ₦{grandTotal.toLocaleString()}</div>
          <div className="text-xs text-slate-600 mb-2">Delivery fee is paid to the rider upon delivery.</div>
          <div>Bank: {SITE.bank.name}</div>
          <div>Account Name: {SITE.bank.accountName}</div>
          <div className="flex items-center gap-2">
            <span>Account Number: {SITE.bank.accountNumber}</span>
            <button
              className="text-xs px-2 py-1 rounded-full border border-slate-300"
              onClick={() => navigator.clipboard?.writeText?.(SITE.bank.accountNumber)}
            >
              Copy
            </button>
          </div>
          <div className="mt-2 text-slate-600">Transfer the exact amount and keep your proof of payment.</div>
          {orderCreated && (
            <div className="mt-3 text-xs text-slate-700">
              Your order has been created. Use reference <span className="font-semibold">{orderRef}</span> when sharing proof of payment.
            </div>
          )}
        </div>

        <button
          onClick={handleCreateOrder}
          disabled={submitting || items.length === 0}
          className="w-full px-4 py-2 rounded-full bg-ration-dark text-ration-yellow text-sm hover:bg-primary-600 disabled:opacity-60"
        >
          {submitting ? 'Placing order…' : 'I have paid / Place order'}
        </button>

        {orderSuccess && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <p className="font-semibold mb-1">Thank you! Your order has been placed.</p>
            <p className="mb-2">You can track your orders and see their status on your orders page.</p>
            <Link
              to="/orders"
              className="inline-flex items-center text-xs font-semibold text-ration-dark underline underline-offset-2 hover:text-ration-dark-hover"
            >
              View my orders
            </Link>
            {lastOrderId && (
              <div className="mt-1 text-xs text-slate-600">Order ID: #{String(lastOrderId).slice(-6)}</div>
            )}
          </div>
        )}

        <div className="mt-2 text-xs">
          <a href={SITE.contacts.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Need help? Chat on WhatsApp</a>
        </div>

        {message && <p className="text-xs text-slate-600">{message}</p>}
      </div>
    </div>
  )
}
