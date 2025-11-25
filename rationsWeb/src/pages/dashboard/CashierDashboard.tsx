import { Link } from 'react-router-dom'

export default function CashierDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Cashier dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link to="/order" className="block bg-white border rounded-xl p-4">
          <div className="font-semibold">Create new order</div>
          <div className="text-sm text-slate-600">Go to checkout to place orders</div>
        </Link>
        <Link to="/orders" className="block bg-white border rounded-xl p-4">
          <div className="font-semibold">Recent transactions</div>
          <div className="text-sm text-slate-600">View your recent orders</div>
        </Link>
      </div>
    </div>
  )
}