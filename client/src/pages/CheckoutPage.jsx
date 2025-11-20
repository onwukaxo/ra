import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/api'
import { SITE, buildWhatsappOrderMessage } from '../config/site'
import { useNavigate, useLocation } from 'react-router-dom'

export default function CheckoutPage() {
  const { items, updateQuantity, removeFromCart, updateSauce, total, clearCart } = useCart()
  const { user, loading, updateMe } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: location } })
    }
  }, [loading, user, navigate, location])

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)

  const [orderType, setOrderType] = useState('pickup')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')

  const [pickupLocation, setPickupLocation] = useState('Main Kitchen')
  const [pickupTime, setPickupTime] = useState('')

  const [addressLine, setAddressLine] = useState('')
  const [area, setArea] = useState('')
  const [deliveryInstructions, setDeliveryInstructions] = useState('')

  const [deliveryInfo, setDeliveryInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine: user?.addressLine || user?.address || '',
    instructions: ''
  })
  const hasBasicInfo = Boolean(deliveryInfo.name && deliveryInfo.phone)
  const hasDeliveryInfo = Boolean(deliveryInfo.name && deliveryInfo.phone && deliveryInfo.addressLine)
  const [editingInfo, setEditingInfo] = useState(false)
  const [savingDelivery, setSavingDelivery] = useState(false)
  const [deliverySaveMessage, setDeliverySaveMessage] = useState('')
  const [errors, setErrors] = useState({ name: '', phone: '', addressLine: '' })
  const [infoSaved, setInfoSaved] = useState(false)

  useEffect(() => {
    setCustomerName(user?.name || '')
  }, [user])

  useEffect(() => {
    setDeliveryInfo(prev => ({
      ...prev,
      name: user?.name || '',
      phone: user?.phone || '',
      addressLine: user?.addressLine || user?.address || ''
    }))
    if (user?.name && user?.phone) {
      setInfoSaved(true)
    }
  }, [user])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me')
        const u = res.data?.data
        setDeliveryInfo(prev => ({
          ...prev,
          name: u?.name || '',
          phone: u?.phone || '',
          addressLine: u?.addressLine || u?.address || ''
        }))
        if (u?.name && u?.phone) {
          setInfoSaved(true)
        }
      } catch {}
    }
    if (!loading && user) {
      fetchUser()
    }
  }, [loading, user])

  

  const handleSaveDeliveryInfo = async () => {
    const name = deliveryInfo.name.trim()
    const phone = deliveryInfo.phone.trim()
    const addressLine = deliveryInfo.addressLine.trim()
    const phoneValid = /^\+234\d{10}$/.test(phone) || /^\d{11}$/.test(phone)
    const needsAddress = orderType === 'delivery'

    const newErrors = { name: '', phone: '', addressLine: '' }
    if (!name || name.length < 2) newErrors.name = 'Name is required'
    if (!phoneValid) newErrors.phone = 'Enter a valid phone number'
    if (needsAddress) {
      if (!addressLine) newErrors.addressLine = 'Address line is required'
    }

    if (newErrors.name || newErrors.phone || newErrors.addressLine) {
      setErrors(newErrors)
      setDeliverySaveMessage('Please fix the errors before continuing.')
      return
    }

    setSavingDelivery(true)
    setDeliverySaveMessage('')
    try {
      await updateMe({ name, phone, addressLine })
      setInfoSaved(true)
      setEditingInfo(false)
      setDeliverySaveMessage('Delivery information updated')
    } catch (e) {
      setDeliverySaveMessage('Could not update delivery details, please try again.')
    } finally {
      setSavingDelivery(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (editingInfo) {
      const name = deliveryInfo.name.trim()
      const phone = deliveryInfo.phone.trim()
      const addressLine = deliveryInfo.addressLine?.trim() || ''
      const phoneValid = /^\+234\d{10}$/.test(phone) || /^\d{11}$/.test(phone)
      const needsAddress = orderType === 'delivery'
      const newErrors = { name: '', phone: '', addressLine: '' }
      if (!name || name.length < 2) newErrors.name = 'Name is required'
      if (!phoneValid) newErrors.phone = 'Enter a valid phone number'
      if (needsAddress && !addressLine) newErrors.addressLine = 'Address line is required'
      setErrors(newErrors)
      setMessage('Please save your information before continuing.')
      setDeliverySaveMessage('Please save your information before continuing.')
      return
    }
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    setSubmitting(true)
    setMessage('')
    try {
      const payload = {
        items: items.map(i => ({ menuItem: i.menuItem._id, quantity: i.quantity, sauce: i.sauce })),
        orderType,
        customer: { name: deliveryInfo.name, phone: deliveryInfo.phone },
        pickup: orderType === 'pickup' ? { location: pickupLocation, time: pickupTime || null } : null,
        delivery: orderType === 'delivery' ? { addressLine: deliveryInfo.addressLine, deliveryInstructions: deliveryInfo.instructions } : null,
        notes,
        total: total,
        paymentMethod: 'bank_transfer',
        paymentStatus: 'pending',
      }
      const res = await api.post('/orders', payload)
      setShowPaymentInfo(true)
      clearCart()
      setMessage('Order placed successfully.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to place order.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleWhatsappCheckout = () => {
    if (editingInfo) {
      const name = deliveryInfo.name.trim()
      const phone = deliveryInfo.phone.trim()
      const addressLine = deliveryInfo.addressLine?.trim() || ''
      const phoneValid = /^\+234\d{10}$/.test(phone) || /^\d{11}$/.test(phone)
      const needsAddress = orderType === 'delivery'
      const newErrors = { name: '', phone: '', addressLine: '' }
      if (!name || name.length < 2) newErrors.name = 'Name is required'
      if (!phoneValid) newErrors.phone = 'Enter a valid phone number'
      if (needsAddress && !addressLine) newErrors.addressLine = 'Address line is required'
      setErrors(newErrors)
      setMessage('Please save your information before continuing.')
      setDeliverySaveMessage('Please save your information before continuing.')
      return
    }
    const name = deliveryInfo.name.trim()
    const phone = deliveryInfo.phone.trim()
    const addressLine = deliveryInfo.addressLine?.trim() || ''
    const phoneValid = /^\+234\d{10}$/.test(phone) || /^\d{11}$/.test(phone)
    const needsAddress = orderType === 'delivery'

    if (!infoSaved && !hasBasicInfo) {
      const newErrors = { name: '', phone: '', addressLine: '' }
      if (!name || name.length < 2) newErrors.name = 'Name is required'
      if (!phoneValid) newErrors.phone = 'Enter a valid phone number'
      if (needsAddress && !addressLine) newErrors.addressLine = 'Address line is required'
      setErrors(newErrors)
      setMessage('Please save your information before continuing.')
      setEditingInfo(true)
      return
    }

    const newErrors = { name: '', phone: '', addressLine: '' }
    if (!name || name.length < 2) newErrors.name = 'Name is required'
    if (!phoneValid) newErrors.phone = 'Enter a valid phone number'
    if (needsAddress) {
      if (!addressLine) newErrors.addressLine = 'Address line is required'
    }

    if (newErrors.name || newErrors.phone || newErrors.addressLine) {
      setErrors(newErrors)
      setMessage('Please fill in all required details.')
      setEditingInfo(true)
      return
    }

    const subtotal = total
    const grandTotal = subtotal
    let msg = buildWhatsappOrderMessage(items, { subtotal, total: grandTotal }, { orderType })
    const contactLines = [
      `Name: ${deliveryInfo.name}`,
      `Phone: ${deliveryInfo.phone}`,
    ]
    if (orderType === 'delivery') {
      contactLines.push(`Address: ${deliveryInfo.addressLine}`)
      if (deliveryInfo.instructions?.trim()) {
        contactLines.push(`Instructions: ${deliveryInfo.instructions.trim()}`)
      }
    }
    msg = `${msg}\n\n${contactLines.join('\n')}`
    const url = `${SITE.contacts.whatsapp}?text=${encodeURIComponent(msg)}`
    setMessage('Thank you! Your order details have been sent via WhatsApp.')
    window.open(url, '_blank')
  }

  const handleSelectMakePayment = async () => {
    if (editingInfo) {
      const name = deliveryInfo.name.trim()
      const phone = deliveryInfo.phone.trim()
      const addressLine = deliveryInfo.addressLine?.trim() || ''
      const phoneValid = /^\+234\d{10}$/.test(phone) || /^\d{11}$/.test(phone)
      const needsAddress = orderType === 'delivery'
      const newErrors = { name: '', phone: '', addressLine: '' }
      if (!name || name.length < 2) newErrors.name = 'Name is required'
      if (!phoneValid) newErrors.phone = 'Enter a valid phone number'
      if (needsAddress && !addressLine) newErrors.addressLine = 'Address line is required'
      setErrors(newErrors)
      setMessage('Please save your information before continuing.')
      setDeliverySaveMessage('Please save your information before continuing.')
      return
    }
    const name = deliveryInfo.name.trim()
    const phone = deliveryInfo.phone.trim()
    const addressLine = deliveryInfo.addressLine?.trim() || ''
    const phoneValid = /^\+234\d{10}$/.test(phone) || /^\d{11}$/.test(phone)
    const needsAddress = orderType === 'delivery'

    if (!infoSaved && !hasBasicInfo) {
      const newErrors = { name: '', phone: '', addressLine: '' }
      if (!name || name.length < 2) newErrors.name = 'Name is required'
      if (!phoneValid) newErrors.phone = 'Enter a valid phone number'
      if (needsAddress && !addressLine) newErrors.addressLine = 'Address line is required'
      setErrors(newErrors)
      setMessage('Please save your information before continuing.')
      setEditingInfo(true)
      return
    }

    const newErrors = { name: '', phone: '', addressLine: '' }
    if (!name || name.length < 2) newErrors.name = 'Name is required'
    if (!phoneValid) newErrors.phone = 'Enter a valid phone number'
    if (needsAddress) {
      if (!addressLine) newErrors.addressLine = 'Address line is required'
    }

    if (newErrors.name || newErrors.phone || newErrors.addressLine) {
      setErrors(newErrors)
      setMessage('Please fill in all required details.')
      setEditingInfo(true)
      return
    }

    try {
      await updateMe({ name, phone, addressLine })
    } catch {}

    navigate('/payment')
  }

  if (loading) return <p className="text-sm text-slate-600">Checking session...</p>
  if (!user) return null

  if (items.length === 0) {
    return <p className="text-sm text-slate-600">Your order is empty. Add items from the menu.</p>
  }

  const subtotal = total
  const grandTotal = subtotal
  const canPlace = orderType === 'pickup'
    ? (deliveryInfo.name.trim().length > 0 && deliveryInfo.phone.trim().length > 0 && pickupLocation.trim().length > 0)
    : (deliveryInfo.name.trim().length > 0 && deliveryInfo.phone.trim().length > 0 && deliveryInfo.addressLine.trim().length > 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Checkout</h1>

        <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
          { (errors.name || errors.phone || errors.addressLine) && (
            <div className="rounded-md border border-red-200 bg-red-50 text-red-700 text-xs p-2">Please fill in all required details.</div>
          ) }
          {deliverySaveMessage && (
            <div className="text-xs text-red-600">{deliverySaveMessage}</div>
          )}
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="orderType" value="pickup" checked={orderType==='pickup'} onChange={(e)=>{ setOrderType(e.target.value); setInfoSaved(false) }} /> Pickup
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="orderType" value="delivery" checked={orderType==='delivery'} onChange={(e)=>{ setOrderType(e.target.value); setInfoSaved(false) }} /> Delivery
            </label>
          </div>
          <div className="text-xs text-slate-600">Order type: {orderType === 'pickup' ? 'Pickup' : 'Delivery'}</div>

          {(!hasBasicInfo || editingInfo) ? (
            <>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Name *</label>
                <input
                  value={deliveryInfo.name}
                  onChange={(e)=>{ setDeliveryInfo(prev=>({ ...prev, name: e.target.value })); setErrors(prev=>({ ...prev, name: '' })); setInfoSaved(false) }}
                  className={`w-full rounded-lg px-3 py-2 text-sm border ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Phone *</label>
                  <input
                    value={deliveryInfo.phone}
                    onChange={(e)=>{ setDeliveryInfo(prev=>({ ...prev, phone: e.target.value })); setErrors(prev=>({ ...prev, phone: '' })); setInfoSaved(false) }}
                    className={`w-full rounded-lg px-3 py-2 text-sm border ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
                {orderType === 'pickup' && null}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-slate-200 p-3 text-sm">
              <div className="font-semibold mb-1">Contact Details</div>
              <div className="text-slate-700">{deliveryInfo.name}</div>
              <div className="text-slate-700">{deliveryInfo.phone}</div>
              <button type="button" onClick={()=>setEditingInfo(true)} className="mt-2 text-xs px-3 py-1 rounded-full border border-slate-300">Edit info</button>
            </div>
          )}
          {orderType === 'pickup' && (!hasBasicInfo || editingInfo) && (
            <div className="mt-2">
              <button type="button" onClick={handleSaveDeliveryInfo} className="text-xs px-3 py-1 rounded-full border border-slate-300">Save info</button>
            </div>
          )}

          {orderType === 'delivery' && (
            (!hasDeliveryInfo || editingInfo) ? (
              <>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Address Line *</label>
                  <input
                    value={deliveryInfo.addressLine}
                    onChange={(e)=>{ setDeliveryInfo(prev=>({ ...prev, addressLine: e.target.value })); setErrors(prev=>({ ...prev, addressLine: '' })); setInfoSaved(false) }}
                    className={`w-full rounded-lg px-3 py-2 text-sm border ${errors.addressLine ? 'border-red-500' : 'border-slate-300'}`}
                  />
                  {errors.addressLine && <p className="text-xs text-red-600 mt-1">{errors.addressLine}</p>}
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">Delivery Instructions (optional)</label>
                  <textarea
                    value={deliveryInfo.instructions}
                    onChange={(e)=>setDeliveryInfo(prev=>({ ...prev, instructions: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" onClick={handleSaveDeliveryInfo} className="text-xs px-3 py-1 rounded-full border border-slate-300">Save</button>
                  <button type="button" onClick={()=>setEditingInfo(false)} className="text-xs px-3 py-1 rounded-full border border-slate-300">Cancel</button>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-slate-200 p-3 text-sm">
                <div className="font-semibold mb-1">Delivery Details</div>
                <div className="text-slate-700">{deliveryInfo.name}</div>
                <div className="text-slate-700">{deliveryInfo.phone}</div>
                <div className="text-slate-700">{deliveryInfo.addressLine}</div>
                <button type="button" onClick={()=>setEditingInfo(true)} className="mt-2 text-xs px-3 py-1 rounded-full border border-slate-300">Edit delivery info</button>
              </div>
            )
          )}

          <div>
            <label className="block text-xs text-slate-600 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e)=>setNotes(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-sm font-semibold">
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          {orderType === 'delivery' && (
            <div className="mt-1 text-xs text-slate-600">Delivery fee is paid to the rider upon delivery.</div>
          )}
          <div className="mt-1 flex items-center justify-between text-sm font-semibold">
            <span>Total</span>
            <span>₦{grandTotal.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {location.state?.checkoutMethod === 'whatsapp' ? (
              <button
                className="w-full px-4 py-2 rounded-full bg-ration-green-hover text-white border border-slate-300 text-sm font-bold"
                onClick={handleWhatsappCheckout}
              >
                Checkout via WhatsApp
              </button>
            ) : location.state?.checkoutMethod === 'payment' ? (
              <button
                className="w-full px-4 py-2 rounded-full bg-ration-dark text-ration-yellow border border-slate-300 text-sm font-bold"
                onClick={handleSelectMakePayment}
              >
                Make payment
              </button>
            ) : (
              <>
                <button
                  className="w-full px-4 py-2 rounded-full bg-ration-green-hover text-white border border-slate-300 text-sm"
                  onClick={handleWhatsappCheckout}
                >
                  Checkout via WhatsApp
                </button>
                <button
                  className="w-full px-4 py-2 rounded-full bg-ration-dark text-ration-yellow border border-slate-300 text-sm"
                  onClick={handleSelectMakePayment}
                >
                  Make payment
                </button>
              </>
            )}
          </div>

          {message && <p className="text-xs text-slate-600">{message}</p>}
        </div>

        {showPaymentInfo && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 text-xs text-slate-700">
            Your order has been created. Continue to the payment page to complete bank transfer.
          </div>
        )}
      </div>

      <div className="space-y-4"></div>
    </div>
  )
}