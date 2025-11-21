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

  useEffect(() => {
    api.get('/admin/settings').then(res => {
      setSettings(res.data.data)
    }).catch(() => setError('Failed to load settings')).finally(() => setLoading(false))
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
      setSettings(s)
      setEditingContacts(false)
      setEditingBank(false)
      setEditingSocials(false)
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

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold">Settings</h1>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
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