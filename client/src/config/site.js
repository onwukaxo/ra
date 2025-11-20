export const SITE = {
  contacts: {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'rations.ng@gmail.com',
    phone: import.meta.env.VITE_CONTACT_PHONE || '+2349122058888',
    whatsapp: `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '+2349122058888'}`,
    location: import.meta.env.VITE_CONTACT_LOCATION || 'Rations, Plot 123, Railway junction, Idu Industrial District, Abuja 900001, Federal Capital Territory',
  },
  socials: {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || '',
    tiktok: import.meta.env.VITE_SOCIAL_TIKTOK || '',
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK || '',
    youtube: import.meta.env.VITE_SOCIAL_YOUTUBE || '',
    x: import.meta.env.VITE_SOCIAL_X || '',
    whatsapp: undefined,
  },
  bank: {
    name: import.meta.env.VITE_BANK_NAME || 'Rations Bank',
    accountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'Rations Food Ltd',
    accountNumber: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || '1234567890',
  },
}

export const buildWhatsappOrderMessage = (items, totals, options = {}) => {
  const lines = items.map(i => {
    const lineTotal = i.menuItem.price * i.quantity
    const saucePart = i.sauce ? ` • Sauce: ${i.sauce}` : ''
    return `- ${i.menuItem.name} x${i.quantity} (₦${lineTotal.toLocaleString()})${saucePart}`
  })
  const header = options.orderType ? `Order Type: ${options.orderType}\n` : ''
  const body = lines.join('\n')
  const summary = `\nSubtotal: ₦${totals.subtotal.toLocaleString()}\nTotal: ₦${totals.total.toLocaleString()}`
  const greeting = 'Hi, I want to place an order'
  return `${greeting}\n\n${header}${body}${summary}`
}
