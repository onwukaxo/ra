import { SITE } from '../config/site'

export default function Contact() {
  const email = SITE.contacts.email
  const phone = SITE.contacts.phone
  const whatsapp = SITE.contacts.whatsapp
  const location = SITE.contacts.location

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
          <div className="text-sm text-slate-700">We’d Love to Hear from You</div>
          <div className="text-xs text-slate-600">Reach out by email, phone, WhatsApp, or visit our location. We’ll get back to you as soon as possible.</div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="font-semibold">Email</div>
              <a href={`mailto:${email}`} className="underline">{email}</a>
            </div>
            <div>
              <div className="font-semibold">Phone</div>
              <a href={`tel:${phone}`} className="underline">{phone}</a>
            </div>
            <div>
              <div className="font-semibold">WhatsApp</div>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="underline">Chat on WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-3">
          <div className="font-semibold text-sm">Location</div>
          <div className="text-sm text-slate-700">{location}</div>
        </div>
      </div>
    </div>
  )
}