export default function OrderCard({ order }) {
  return (
    <div className="border border-slate-100 rounded-xl bg-white p-4 text-sm flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="font-semibold text-slate-800">Order #{order._id.slice(-6)}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
          {order.status}
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