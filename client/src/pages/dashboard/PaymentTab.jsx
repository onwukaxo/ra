import { SITE } from '../../config/site'
import { Link } from 'react-router-dom'

export default function PaymentTab({ orders = [] }) {
  const pending = orders.filter(o => String(o.status || '').toLowerCase() === 'pending')

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
      <h2 className="text-lg font-semibold">Payment</h2>
      <div className="rounded border border-slate-200 p-3 text-sm">
        <div className="font-semibold">Bank Transfer Details</div>
        <div className="mt-1">Bank: {SITE.bank.name}</div>
        <div>Account Name: {SITE.bank.accountName}</div>
        <div>Account Number: {SITE.bank.accountNumber}</div>
      </div>
      {pending.length > 0 && (
        <div className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm">
          Pending Payment — please complete transfer and confirm with team
        </div>
      )}
      <div>
        <Link to="/orders" className="text-sm underline">View full order status</Link>
      </div>
    </div>
  )
}