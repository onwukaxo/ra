import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function OrdersTab({ orders = [] }) {
  const navigate = useNavigate()
  const { addToCart, clearCart } = useCart()

  const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const reorder = (order) => {
    clearCart()
    for (const i of order.items || []) {
      const menuItem = i.menuItem || i.item || {}
      if (!menuItem?._id) continue
      addToCart(menuItem, i.quantity || 1, i.sauce)
    }
    navigate('/cart')
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
      <h2 className="text-lg font-semibold">Your Orders</h2>
      {sorted.length === 0 ? (
        <p className="text-sm text-slate-600">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((o) => (
            <details key={o._id} className="rounded border border-slate-200 p-3">
              <summary className="flex items-center justify-between cursor-pointer">
                <div className="text-sm">
                  <div className="font-semibold">#{String(o._id).slice(-6)}</div>
                  <div className="text-slate-600">{String(o.orderType || 'pickup').toUpperCase()} • {String(o.status || 'pending')}</div>
                </div>
                <div className="text-sm text-right">
                  <div className="font-semibold">₦{(o.total || 0).toLocaleString()}</div>
                  <div className="text-slate-600">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
              </summary>
              <div className="mt-2 text-sm text-slate-700">
                {(o.items||[]).length > 0 ? (
                  <ul className="list-disc ml-5">
                    {o.items.map((i, idx) => (
                      <li key={idx}>{i.menuItem?.name || i.item?.name} x{i.quantity} {i.sauce ? `(Sauce: ${i.sauce})` : ''}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No items</p>
                )}
              </div>
              <div className="mt-3">
                <button className="px-3 py-2 rounded-full bg-ration-dark text-ration-yellow text-sm" onClick={()=>reorder(o)}>Reorder</button>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}