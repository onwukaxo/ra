import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { SITE, buildWhatsappOrderMessage } from '../config/site'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, updateSauce, total } = useCart()
  const navigate = useNavigate()
  const { user } = useAuth()

  const proceed = () => {
    if (items.length === 0) return
    navigate('/order')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Your cart</h1>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm">
          <p className="text-slate-600">Your cart is empty. Add items from the menu.</p>
          <div className="mt-3">
            <button onClick={() => navigate('/menu')} className="px-4 py-3 sm:py-2 rounded-full bg-ration-dark text-white text-base sm:text-sm">Back to Menu</button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm space-y-2">
            {items.map((i) => (
              <div key={`${i.menuItem._id}:${i.sauce || ''}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <div className="font-medium">{i.menuItem.name}</div>
                  {String(i.menuItem.category || '').toLowerCase() === 'wings' && (
                    <div className="mt-1 text-xs text-slate-600 flex items-center gap-2">
                      <span>Sauce:</span>
                      <select
                        value={i.sauce || 'Buffalo'}
                        onChange={(e)=>updateSauce(i.menuItem._id, (e.target as HTMLSelectElement).value as any)}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        <option>Buffalo</option>
                        <option>Barbecue</option>
                      </select>
                    </div>
                  )}
                  <div className="text-xs text-slate-600">₦{(i.menuItem.price * i.quantity).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newQty = i.quantity - 1
                      if (newQty <= 0) {
                        removeFromCart(i.menuItem._id, i.sauce)
                      } else {
                        updateQuantity(i.menuItem._id, newQty, i.sauce)
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="min-w-6 text-center font-bold">{i.quantity}</span>
                  <button
                    onClick={() => updateQuantity(i.menuItem._id, i.quantity + 1, i.sauce)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(i.menuItem._id, i.sauce)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-sm font-semibold">
            <span>Subtotal</span>
            <span>₦{total.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => {
                if (items.length === 0) return
                if (!user) {
                  const subtotal = total
                  const grandTotal = subtotal
                  const msg = buildWhatsappOrderMessage(items, { subtotal, total: grandTotal }, {})
                  const url = `${SITE.contacts.whatsapp}?text=${encodeURIComponent(msg)}`
                  window.open(url, '_blank')
                } else {
                  navigate('/order', { state: { checkoutMethod: 'whatsapp' } })
                }
              }}
              className="w-full px-4 py-3 sm:py-2 rounded-full bg-ration-green-hover text-white border border-slate-300 text-base sm:text-sm disabled:opacity-60"
              disabled={items.length === 0}
            >
              Checkout via WhatsApp
            </button>
            <button
              onClick={() => {
                if (items.length === 0) return
                navigate('/order', { state: { checkoutMethod: 'payment' } })
              }}
              className="w-full px-4 py-3 sm:py-2 rounded-full bg-ration-dark text-ration-yellow border border-slate-300 text-base sm:text-sm disabled:opacity-60"
              disabled={items.length === 0}
            >
              Proceed to payment
            </button>
          </div>
        </>
      )}
    </div>
  )
}
