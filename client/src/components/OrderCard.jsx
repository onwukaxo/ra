export default function OrderCard({ order }) {
  const s = String(order.status || '').toUpperCase()
  const statusCls =
    s === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
    s === 'PREPARING' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
    s === 'READY' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
    s === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200' :
    s === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
  return (
    <div className="border border-slate-100 rounded-xl bg-white p-4 text-sm flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="font-semibold text-slate-800">Order #{order._id.slice(-6)}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${statusCls}`}>
          {s}
        </span>
      </div>
      <div className="text-xs text-slate-600">
        {new Date(order.createdAt).toLocaleString()}
      </div>
      <ul className="text-xs text-slate-700 list-disc list-inside">
        {order.items.map((i) => (
          <li key={i._id}>
            {i.quantity} x {i.menuItem?.name || 'Item'} – ₦{i.priceAtOrderTime}
            {i.sauce && <> • Sauce: {i.sauce}</>}
          </li>
        ))}
      </ul>
      <div className="mt-1 text-right text-sm font-semibold text-slate-800">
        Total: ₦{order.totalAmount}
      </div>
    </div>
  )
}