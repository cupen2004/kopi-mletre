import { SHOP_CONFIG } from "./config";
import { CartItem } from "./cart-store";
import { formatPrice } from "./menu-data";

export function generateWhatsAppMessage(
  tableNumber: string,
  customerName: string,
  items: CartItem[],
  paymentMethod: string,
  orderNotes: string
): string {
  const itemLines = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.menuItem.name} x${item.quantity} = ${formatPrice(
          item.menuItem.price * item.quantity
        )}${item.notes ? ` (${item.notes})` : ""}`
    )
    .join("\n");

  const subtotal = items.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0
  );

  const paymentMethodName =
    paymentMethod === "qris" ? "QRIS" : "Bayar via WhatsApp";

  const message = `Halo ${SHOP_CONFIG.name}, saya ingin memesan.

Nomor Meja: ${tableNumber}
Nama Pemesan: ${customerName}

Pesanan:
${itemLines}

Subtotal: ${formatPrice(subtotal)}
Biaya tambahan: Rp0
Total Pesanan: ${formatPrice(subtotal)}

Metode Pembayaran: ${paymentMethodName}${orderNotes ? `\nCatatan: ${orderNotes}` : ""}

Mohon konfirmasi pesanan dan informasi pembayaran. Terima kasih.`;

  return message;
}

export function generateWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodedMessage}`;
}
