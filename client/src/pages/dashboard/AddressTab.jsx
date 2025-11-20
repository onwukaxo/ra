import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function AddressTab({ me, onUpdated }) {
  const { updateMe } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ addressLine: '' })
  const [msg, setMsg] = useState('')
  const [errors, setErrors] = useState({ addressLine: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm({ addressLine: me?.addressLine || me?.address || '' })
  }, [me])

  const validate = () => {
    const e = { addressLine: '' }
    if (!form.addressLine || !form.addressLine.trim()) e.addressLine = 'Address Line is required'
    setErrors(e)
    return !(e.addressLine)
  }

  const save = async () => {
    if (!validate()) { setMsg('Please fix the errors before continuing.'); return }
    setSaving(true); setMsg('')
    try {
      await updateMe({ addressLine: form.addressLine.trim() })
      setEditing(false)
      setMsg('Address updated')
      onUpdated?.()
    } catch {
      setMsg('Could not update address, please try again.')
    } finally { setSaving(false) }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
      <h2 className="text-lg font-semibold">Address</h2>
      <div>
        <label className="block text-xs text-slate-600 mb-1">Address Line *</label>
        <input disabled={!editing} value={form.addressLine} onChange={(e)=>setForm(f=>({ ...f, addressLine: e.target.value }))} className={`w-full rounded-lg px-3 py-2 text-sm border ${errors.addressLine?'border-red-500':'border-slate-300'}`} />
        {errors.addressLine && <p className="text-xs text-red-600 mt-1">{errors.addressLine}</p>}
      </div>
      
      <div className="flex items-center gap-2">
        {!editing ? (
          <button className="px-3 py-2 rounded-full border border-slate-300 text-sm" onClick={()=>setEditing(true)}>Edit</button>
        ) : (
          <>
            <button className="px-3 py-2 rounded-full bg-ration-dark text-ration-yellow text-sm" onClick={save} disabled={saving}>{saving?'Saving...':'Save'}</button>
            <button className="px-3 py-2 rounded-full border border-slate-300 text-sm" onClick={()=>{ setEditing(false); setErrors({ addressLine:'' }) }}>Cancel</button>
          </>
        )}
      </div>
      {msg && <p className="text-xs text-slate-600">{msg}</p>}
    </div>
  )
}