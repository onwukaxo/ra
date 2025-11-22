import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { SITE, buildWhatsappOrderMessage } from '../config/site'
import { useAuth } from '../context/AuthContext'

export default function CartDrawer({ open, onClose, items = [] }: any) {
  const { updateQuantity, removeFromCart, clearCart, updateSauce } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const total = items.reduce((s, i) => s + i.menuItem.price * i.quantity, 0)

  // 🔥 Auto-close when cart becomes empty
  useEffect(() => {
    if (open && items.length === 0) {
      onClose()
    }
  }, [open, items.length, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div
        className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col border-l border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button className="text-sm text-slate-600" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {items.map((i) => (
                <div
                  key={`${i.menuItem._id}:${i.sauce || ''}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 border-b py-3"
                >
                  {i.menuItem.imageUrl && (
                    <img
                      src={i.menuItem.imageUrl}
                      alt={i.menuItem.name}
                      className="h-14 w-14 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <div className="font-semibold">{i.menuItem.name}</div>
                    <div className="text-sm font-semibold text-gray-700">
                      ₦{(i.menuItem.price * i.quantity).toLocaleString()}
                    </div>
                    {i.sauce && (
                      <div className="mt-1 text-xs text-slate-600 flex items-center gap-2">
                        <span>Sauce:</span>
                        <select
                          value={i.sauce}
                          onChange={(e) => updateSauce(i.menuItem._id, (e.target as HTMLSelectElement).value as any)}
                          className="border rounded px-2 py-1 text-xs"
                        >
                          <option>Buffalo</option>
                          <option>Barbecue</option>
                        </select>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => {
                          const newQty = i.quantity - 1
                          if (newQty <= 0) {
                            removeFromCart(i.menuItem._id, i.sauce)
                          } else {
                            updateQuantity(i.menuItem._id, newQty, i.sauce)
                          }
                        }}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <FaMinus />
                      </button>
                      <span className="px-2 font-bold">{i.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(i.menuItem._id, i.quantity + 1, i.sauce)
                        }
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(i.menuItem._id, i.sauce)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Clear cart button */}
            <div className="mt-3 flex justify-between">
              <button
                className="py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 text-xs font-semibold"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-sm font-semibold mb-3">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>



          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              className="w-full px-4 py-3 sm:py-2 rounded-full bg-green-600 text-white hover:bg-green-700 text-base sm:text-sm font-semibold"
              onClick={() => {
                if (items.length === 0) return
                if (!user) {
                  const subtotal = total
                  const msg = buildWhatsappOrderMessage(items, { subtotal, total: subtotal }, {})
                  const url = `${SITE.contacts.whatsapp}?text=${encodeURIComponent(msg)}`
                  window.open(url, '_blank')
                } else {
                  onClose()
                  navigate('/cart')
                }
              }}
            >
              Checkout via WhatsApp
            </button>
            <Link
              to="/cart"
              onClick={onClose}
              className="w-full text-center px-4 py-3 sm:py-2 rounded-full border border-slate-300 text-base sm:text-sm font-semibold"
            >
              Make payment
            </Link>
          </div>
          <div className="mt-3 ">
            <Link to="/cart" onClick={onClose} className="text-xs text-slate-700">Go to cart</Link>
          </div>
                    <div className="flex gap-2 py-2">
            {/* <Link
              to="/order"
              onClick={onClose}
              className="flex-1 text-center px-4 py-2 rounded-full bg-ration-dark text-white hover:bg-ration-dark-hover text-sm font-semibold"
            >
              Checkout
            </Link> */}
            <button
              className="px-4 py-3 sm:py-2 rounded-full border border-slate-300 text-base sm:text-sm"
              onClick={onClose}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
