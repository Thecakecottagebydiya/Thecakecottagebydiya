export const WHATSAPP_NUMBER = "919041615117";
export const OWNER_PHONE = "+91 9041615117";
export const BUSINESS_NAME = "The Cake Cottage By Diya";
export const BUSINESS_ADDRESS =
  "Lighta wala chownk, near back side of Preet Dhaba, Mavi Colony, Morinda, Punjab 140101";

export function buildWhatsAppUrl(text) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function orderMessage(order) {
  const lines = [
    `Hello Diya! I'd like to place a cake order from *${BUSINESS_NAME}* website.`,
    ``,
    `*Name:* ${order.customer_name || "-"}`,
    `*Phone:* ${order.phone || "-"}`,
    order.cake_name ? `*Cake:* ${order.cake_name}` : null,
    order.flavor ? `*Flavor:* ${order.flavor}` : null,
    order.weight_kg ? `*Weight:* ${order.weight_kg} kg` : null,
    order.quantity ? `*Quantity:* ${order.quantity}` : null,
    order.delivery_date ? `*Delivery Date:* ${order.delivery_date}` : null,
    order.message_on_cake ? `*Message on cake:* ${order.message_on_cake}` : null,
    order.address ? `*Delivery Address:* ${order.address}` : null,
    order.notes ? `*Notes:* ${order.notes}` : null,
    ``,
    `_Sent from thecakecottagebydiya.com_`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function quickCakeMessage(cakeName) {
  return orderMessage({ cake_name: cakeName, customer_name: "", phone: "" });
}
