import { Resend } from 'resend';
import { formatPrice } from './formatPrice';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (order: any) => {
  if (!process.env.RESEND_API_KEY) {
    console.log('Resend API key not found, skipping email sending');
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Hi ${order.customerName},</p>
        <p>We have received your order #${order.orderNumber}.</p>
        
        <h2>Order Details:</h2>
        <ul>
          ${order.items.map((item: any) => `
            <li>
              ${item.productName} x ${item.quantity} - ₦${formatPrice(item.price)}
            </li>
          `).join('')}
        </ul>
        
        <p><strong>Total: ₦${formatPrice(order.total)}</strong></p>
        
        <p>We will notify you when your order is shipped.</p>
      `,
    });
    console.log('Order confirmation email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
