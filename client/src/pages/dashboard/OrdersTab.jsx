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
                  <div className="text-slate-600 flex items-center gap-2">
                    <span>{String(o.orderType || 'pickup').toUpperCase()}</span>
                    {(() => {
                      const s = String(o.status || '').toUpperCase()
                      const cls =
                        s === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                        s === 'PREPARING' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        s === 'READY' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        s === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200' :
                        s === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      return <span className={`text-xs px-2 py-1 rounded-full ${cls}`}>{s || 'PENDING'}</span>
                    })()}
                  </div>
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