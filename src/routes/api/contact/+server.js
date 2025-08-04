import { json, error } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { GMAIL_USER, GMAIL_PASS } from '$env/static/private';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

// 1. Configure rate limiter: max 3 submissions per IP per hour
const limiter = new RateLimiter({
  rates: {
    IP: [3, 'h']
  }
});

export const POST = async (event) => {
  // 1a. Preflight for cookie-based limiter (if used)
  // await limiter.cookieLimiter?.preflight(event);

  // 1b. Check rate limit
  if (await limiter.isLimited(event)) {
    // Too many requests
    throw error(429, 'You have reached the submission limit. Please try again later.');
  }

  // Parse form JSON
  const { name, email, reason, description } = await event.request.json();

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS
    }
  });

  // 2. Send notification to yourself
  const adminMail = {
    from: `"Portfolio Contact" <${GMAIL_USER}>`,
    to: "Andrea.bertarione@gmail.com",
    subject: `New ${reason} from ${name || 'Anonymous'}`,
    html: `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Message:</strong><br/>${description}</p>
    `
  };

  // 3. Send confirmation email back to the user
  const userMail = {
    from: `"Andrea Bertarione Portfolio" <${GMAIL_USER}>`,
    to: email,
    subject: 'We received your message!',
    html: `
      <p>Hi ${name || 'there'},</p>
      <p>Thank you for your ${reason.toLowerCase()}. I’ll review your message and get back to you shortly.</p>
      <blockquote>${description}</blockquote>
      <p>Best regards,<br/>Andrea Bertarione</p>
    `
  };

  try {
    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(adminMail),
      transporter.sendMail(userMail)
    ]);

    return json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Email send error:', err);
    return json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
};
