import Button from '../../../../platform/shared/ui/Button'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function MenuItemCard({ item }: any) {
  const { items, addToCart, updateQuantity, removeFromCart, updateSauce } = useCart()
  const isWings = String(item.category || '').toLowerCase() === 'wings'
  const [sauce, setSauce] = useState('Buffalo')

  // Find existing cart entry for this menu item
  const cartEntry = items.find(i => i.menuItem._id === item._id)
  const quantity = cartEntry?.quantity ?? 0

  // Current sauce for this wings item (fallback to local state)
  const currentSauce = isWings ? (cartEntry?.sauce || sauce) : undefined

  const handleAdd = () => {
    if (!cartEntry) {
      // First time adding – for wings, attach sauce, otherwise leave undefined
      addToCart(item, 1, isWings ? (sauce as any) : undefined)
    } else {
      // Increment quantity, keep existing sauce if any
      updateQuantity(item._id, quantity + 1, isWings ? (currentSauce as any) : undefined)
    }
  }

  const handleMinus = () => {
    if (!cartEntry) return
    const newQty = quantity - 1

    if (newQty <= 0) {
      // Remove from cart completely (including sauce)
      removeFromCart(item._id, isWings ? (currentSauce as any) : undefined)
    } else {
      // Decrement quantity, keep same sauce
      updateQuantity(item._id, newQty, isWings ? (currentSauce as any) : undefined)
    }
  }

  const handleSauceChange = (e) => {
    const newSauce = e.target.value
    setSauce(newSauce)

    // If item is already in cart, update its sauce without changing quantity
    if (isWings && cartEntry && quantity > 0) {
      updateQuantity(item._id, quantity, newSauce)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col animate-fade-in">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-40 w-full object-cover"
        />
      )}

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-semibold text-slate-800">{item.name}</h3>
            <p className="text-xs text-red-700">{item.category}</p>
          </div>
          <span className="text-sm font-semibold text-primary-600">
            ₦{item.price.toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>

        {/* Sauce selector: ONLY for wings, and ONLY after item is in cart */}
        {isWings && quantity > 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-slate-600">Sauce:</span>
          <select
              value={currentSauce}
              onChange={(e) => updateSauce(item._id, (e.target as HTMLSelectElement).value as any)}
              className="border rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-ration-yellow focus:outline-none"
            >
              <option value="Buffalo">Buffalo</option>
              <option value="Barbecue">Barbecue</option>
            </select>
          </div>
        )}

        <div className="mt-auto pt-2">
          {quantity === 0 ? (
            <Button
              disabled={!item.isAvailable}
              className="w-full bg-ration-dark text-white"
              onClick={handleAdd}
            >
              {item.isAvailable ? 'Add to order' : 'Unavailable'}
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMinus}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-bold"
                >
                  -
                </button>
                <span className="min-w-6 text-center font-bold">{quantity}</span>
                <button
                  onClick={handleAdd}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-bold"
                >
                  +
                </button>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                ₦{(item.price * quantity).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
