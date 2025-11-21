import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { SITE } from '../../config/site'
import api from '../../api/api'
import Button from '../../components/Button'

export default function AdminSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingContacts, setEditingContacts] = useState(false)
  const [editingBank, setEditingBank] = useState(false)
  const [editingSocials, setEditingSocials] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [loadingAlerts, setLoadingAlerts] = useState(true)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    api.get('/admin/settings').then(res => {
      setSettings(res.data.data)
    }).catch(() => setError('Failed to load settings')).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const loadAlerts = async () => {
      setLoadingAlerts(true)
      try {
        const res = await api.get('/admin/community')
        const list = Array.isArray(res.data?.data) ? res.data.data : []
        const isTagMatch = (t) => {
          const x = String(t || '').toLowerCase()
          return x === 'promo' || x === 'promos' || x === 'event' || x === 'events' || x === 'announcement' || x === 'anouncement'
        }
        const enabled = list.filter(p => Boolean(p.alertEnabled) && isTagMatch(p.tag))
        setAlerts(enabled)
      } catch {
        setAlerts([])
      } finally {
        setLoadingAlerts(false)
      }
    }
    loadAlerts()
  }, [])

  const updateField = (path, value) => {
    setSettings(prev => {
      const next = { ...(prev || {}) }
      const [group, key] = path.split('.')
      next[group] = { ...(next[group] || {}) , [key]: value }
      return next
    })
  }

  const updateSocial = (idx, value) => {
    setSettings(prev => {
      const next = { ...(prev || {}), socials: [...(prev?.socials || [])] }
      next.socials[idx] = { ...(next.socials[idx] || {}), url: value }
      return next
    })
  }

  const save = async () => {
    setError('')
    try {
      const res = await api.put('/admin/settings', settings)
      const s = res.data.data
      // Merge into SITE for immediate UI reflection
      if (s.contacts) SITE.contacts = { ...SITE.contacts, ...s.contacts }
      if (s.bank) SITE.bank = { ...SITE.bank, ...s.bank }
      if (Array.isArray(s.socials)) {
        const map = new Map(s.socials.map((x) => [x.name, x.url]))
        SITE.socials = (SITE.socials || []).map((entry) => ({ ...entry, url: map.get(entry.name) ?? entry.url }))
      }
      SITE.promoMessage = s.promoMessage || ''
      SITE.promoStart = s.promoStart || null
      SITE.promoEnd = s.promoEnd || null
      SITE.eventMessage = s.eventMessage || ''
      SITE.eventDate = s.eventDate || null
      SITE.eventStart = s.eventStart || null
      SITE.eventEnd = s.eventEnd || null
      SITE.visitorAlertEnabled = Boolean(s.visitorAlertEnabled)
      setSettings(s)
      setEditingContacts(false)
      setEditingBank(false)
      setEditingSocials(false)
      setEditingPromo(false)
    } catch (e) {
      setError('Failed to save settings')
    }
  }

  const reload = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/admin/settings')
      setSettings(res.data.data)
    } catch {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const updateAlertField = (idx, field, value) => {
    setAlerts(prev => {
      const next = [...prev]
      next[idx] = { ...(next[idx] || {}), [field]: value }
      return next
    })
  }

  const saveAlert = async (idx) => {
    const a = alerts[idx]
    if (!a) return
    const payload = {
      alertEnabled: Boolean(a.alertEnabled),
      alertStart: a.alertStart ? new Date(a.alertStart).toISOString() : '',
      alertEnd: a.alertEnd ? new Date(a.alertEnd).toISOString() : '',
    }
    try {
      await api.put(`/admin/community/${a._id}`, payload)
      const res = await api.get('/admin/community')
      const list = Array.isArray(res.data?.data) ? res.data.data : []
      const isTagMatch = (t) => {
        const x = String(t || '').toLowerCase()
        return x === 'promo' || x === 'promos' || x === 'event' || x === 'events' || x === 'announcement' || x === 'anouncement'
      }
      const enabled = list.filter(p => Boolean(p.alertEnabled) && isTagMatch(p.tag))
      setAlerts(enabled)
      setNotice('Alert updated')
    } catch {
      setNotice('Failed to update alert')
    }
  }

  const hideAlert = async (idx) => {
    const a = alerts[idx]
    if (!a) return
    try {
      await api.put(`/admin/community/${a._id}`, { alertEnabled: false })
      setAlerts(prev => prev.filter(x => x._id !== a._id))
      setNotice('Alert removed from website')
    } catch {
      setNotice('Failed to remove alert')
    }
  }

  const deleteAlert = async (idx) => {
    const a = alerts[idx]
    if (!a) return
    try {
      await api.delete(`/admin/community/${a._id}`)
      setAlerts(prev => prev.filter(x => x._id !== a._id))
      setNotice('Alert deleted permanently')
    } catch {
      setNotice('Failed to delete alert')
    }
  }

  if (loading) return (
    <AdminLayout>
      <p className="text-sm text-slate-500">Loading...</p>
    </AdminLayout>
  )

  if (!settings) return (
    <AdminLayout>
      <p className="text-sm text-red-500">{error || 'Unable to load settings'}</p>
    </AdminLayout>
  )

  const socials = settings.socials || []
  const contacts = settings.contacts || {}
  const bank = settings.bank || {}
  const visitorAlertEnabled = Boolean(settings?.visitorAlertEnabled)

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold">Settings</h1>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {notice && <p className="text-xs text-green-600 mt-1">{notice}</p>}
      <div className="grid md:grid-cols-2 gap-4 mt-3">
        <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Contacts</div>
            {!editingContacts && (
              <button className="text-xs px-3 py-1 rounded-full border" onClick={()=>setEditingContacts(true)}>Edit</button>
            )}
          </div>
          {editingContacts ? (
            <div className="space-y-2">
              <label className="block">
                <span className="text-xs">Email</span>
                <input value={contacts.email || ''} onChange={(e)=>updateField('contacts.email', e.target.value)} className="w-full border rounded px-2 py-1" />
              </label>
              <label className="block">
                <span className="text-xs">Phone</span>
                <input value={contacts.phone || ''} onChange={(e)=>updateField('contacts.phone', e.target.value)} className="w-full border rounded px-2 py-1" />
              </label>
              <label className="block">
                <span className="text-xs">WhatsApp</span>
                <input value={contacts.whatsapp || ''} onChange={(e)=>updateField('contacts.whatsapp', e.target.value)} className="w-full border rounded px-2 py-1" />
              </label>
              <label className="block">
                <span className="text-xs">Location</span>
                <input value={contacts.location || ''} onChange={(e)=>updateField('contacts.location', e.target.value)} className="w-full border rounded px-2 py-1" />
              </label>
              <div className="flex gap-2 mt-2">
                <Button onClick={save}>Save</Button>
                <Button onClick={()=>{ setEditingContacts(false); reload() }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div>Email: {contacts.email || '—'}</div>
              <div>Phone: {contacts.phone || '—'}</div>
              <div>WhatsApp: {contacts.whatsapp || '—'}</div>
              <div>Location: {contacts.location || '—'}</div>
            </div>
          )}
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Bank</div>
            {!editingBank && (
              <button className="text-xs px-3 py-1 rounded-full border" onClick={()=>setEditingBank(true)}>Edit</button>
            )}
          </div>
          {editingBank ? (
            <div className="space-y-2">
              <label className="block">
                <span className="text-xs">Name</span>
                <input value={bank.name || ''} onChange={(e)=>updateField('bank.name', e.target.value)} className="w-full border rounded px-2 py-1" />
              </label>
              <label className="block">
                <span className="text-xs">Account Name</span>
                <input value={bank.accountName || ''} onChange={(e)=>updateField('bank.accountName', e.target.value)} className="w-full border rounded px-2 py-1" />
              </label>
              <label className="block">
                <span className="text-xs">Account Number</span>
                <input value={bank.accountNumber || ''} onChange={(e)=>updateField('bank.accountNumber', e.target.value)} className="w-full border rounded px-2 py-1" />
              </label>
              <div className="flex gap-2 mt-2">
                <Button onClick={save}>Save</Button>
                <Button onClick={()=>{ setEditingBank(false); reload() }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div>Name: {bank.name || '—'}</div>
              <div>Account Name: {bank.accountName || '—'}</div>
              <div>Account Number: {bank.accountNumber || '—'}</div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Promos & Events</div>
        </div>
        <div className="mt-2">
          <div className="font-semibold mb-2">Enabled alerts</div>
          {loadingAlerts ? (
            <div className="text-sm text-slate-500">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="text-sm text-slate-500">No enabled alerts</div>
          ) : (
            <div className="space-y-2">
              {alerts.map((a, idx) => (
                <div key={a._id} className="border rounded-lg p-3">
                  <div className="text-xs uppercase text-slate-500">{a.tag}</div>
                  <div className="font-medium">{a.title}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 items-end">
                    <label className="text-sm">
                      <span className="block mb-1">Enabled</span>
                      <input type="checkbox" checked={Boolean(a.alertEnabled)} onChange={(e)=>updateAlertField(idx, 'alertEnabled', e.target.checked)} />
                    </label>
                    <label className="text-sm">
                      <span className="block mb-1">Start</span>
                      <input type="datetime-local" value={a.alertStart ? new Date(a.alertStart).toISOString().slice(0,16) : ''} onChange={(e)=>updateAlertField(idx, 'alertStart', e.target.value ? new Date(e.target.value).toISOString() : '')} className="w-full border rounded px-2 py-1" />
                    </label>
                    <label className="text-sm">
                      <span className="block mb-1">End</span>
                      <input type="datetime-local" value={a.alertEnd ? new Date(a.alertEnd).toISOString().slice(0,16) : ''} onChange={(e)=>updateAlertField(idx, 'alertEnd', e.target.value ? new Date(e.target.value).toISOString() : '')} className="w-full border rounded px-2 py-1" />
                    </label>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button onClick={()=>saveAlert(idx)}>Update</Button>
                    <Button onClick={()=>hideAlert(idx)} className="border">Remove from Website</Button>
                    <Button onClick={()=>deleteAlert(idx)} className="border text-red-600">Delete Permanently</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="bg-white border border-slate-100 rounded-xl p-4 text-sm mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Socials</div>
          {!editingSocials && (
            <button className="text-xs px-3 py-1 rounded-full border" onClick={()=>setEditingSocials(true)}>Edit</button>
          )}
        </div>
        {editingSocials ? (
          <div className="space-y-2">
            {socials.map((s, idx) => (
              <label key={s.name} className="block">
                <span className="text-xs">{s.name}</span>
                <input value={s.url || ''} onChange={(e)=>updateSocial(idx, e.target.value)} className="w-full border rounded px-2 py-1" />
              </label>
            ))}
            <div className="flex gap-2 mt-2">
              <Button onClick={save}>Save</Button>
              <Button onClick={()=>{ setEditingSocials(false); reload() }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-1">
            {socials.map(s => (
              <li key={s.name}>
                {s.name}: <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">{s.url}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  )
}