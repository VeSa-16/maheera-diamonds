export const WHATSAPP_NUMBER = '919876543210';

export const openWhatsApp = (phone: string, text: string) => {
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${phone}?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const generateProductInquiryMsg = (
  productName: string,
  category: string,
  price: number,
  customerName: string,
  extraMessage?: string
) => {
  let msg = `Namaste! I'm interested in *${productName}* from Maheera Diamonds.
💎 Category: ${category}
💰 Price: ₹${price.toLocaleString('en-IN')}
📞 My name: ${customerName}`;
  
  if (extraMessage) {
    msg += `\n📝 Note: ${extraMessage}`;
  }
  
  msg += `\n\nPlease share more details and availability.`;
  return msg;
};

export const generateCustomizerMsg = (
  shape: string,
  metal: string,
  setting: string,
  clarity: string,
  color: string,
  carat: number,
  price: number,
  customerName: string,
  phone: string,
  extraMessage?: string
) => {
  let msg = `Namaste! I've configured a custom diamond from Maheera Diamonds:
💎 Shape: ${shape}
🪙 Metal: ${metal}
✨ Setting: ${setting}
🔬 Clarity: ${clarity} | Color: ${color}
⚖️ Carat: ${carat}ct
💰 Estimated: ₹${price.toLocaleString('en-IN')}
👤 Name: ${customerName} | 📞 ${phone}`;

  if (extraMessage) {
    msg += `\n📝 Note: ${extraMessage}`;
  }

  msg += `\n\nPlease get in touch to proceed.`;
  return msg;
};

export const generateConsultationMsg = (
  date: string,
  time: string,
  type: string,
  customerName: string,
  phone: string,
  extraMessage?: string
) => {
  let msg = `Namaste! I'd like to book a diamond consultation with Maheera:
📅 Date: ${date} at ${time}
📍 Type: ${type}
👤 ${customerName} | 📞 ${phone}`;

  if (extraMessage) {
    msg += `\n📝 Note: ${extraMessage}`;
  }

  msg += `\n\nPlease confirm my slot.`;
  return msg;
};
