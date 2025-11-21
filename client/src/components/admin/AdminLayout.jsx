import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-[70vh] bg-slate-50 border rounded-xl overflow-hidden">
      <div className="flex relative">
        <div className={`hidden md:block`}>
          <AdminSidebar onLinkClick={() => setOpen(false)} />
        </div>
        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={()=>setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-white border-r z-50">
              <AdminSidebar onLinkClick={() => setOpen(false)} />
            </div>
          </div>
        )}
        <div className="flex-1">
          <AdminTopbar onToggleSidebar={() => setOpen(v=>!v)} />
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}