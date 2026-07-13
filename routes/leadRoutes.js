import express from 'express';
import nodemailer from 'nodemailer';
import dns from 'dns';
import Lead from '../models/Lead.js';

dns.setDefaultResultOrder('ipv4first');

const router = express.Router();

// Lazy transporter — created on first use so that dotenv is already loaded
// (ESM imports are hoisted, so top-level code runs before dotenv.config())
const getTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

// GET email status (Diagnostic)
router.get('/email-status', async (req, res) => {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    res.json({
      success: true,
      message: 'SMTP connection verified successfully',
      emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}...` : 'not set',
      emailOwner: process.env.EMAIL_OWNER ? `${process.env.EMAIL_OWNER.substring(0, 3)}...` : 'not set',
      emailPassSet: !!process.env.EMAIL_PASS,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'SMTP connection verification failed',
      error: err.message,
      emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}...` : 'not set',
      emailOwner: process.env.EMAIL_OWNER ? `${process.env.EMAIL_OWNER.substring(0, 3)}...` : 'not set',
      emailPassSet: !!process.env.EMAIL_PASS,
    });
  }
});

// GET all leads (Admin Dashboard)
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST submit a lead (Public form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, propertyOfInterest } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Name, email, phone, and message are required.' });
    }

    // Save lead to DB
    const lead = new Lead({ name, email, phone, message, propertyOfInterest });
    const savedLead = await lead.save();

    // Build emails
    const currentYear = new Date().getFullYear();
    const property = propertyOfInterest || 'General Inquiry';

    // 1. Owner notification email
    const ownerMailOptions = {
      from: `"Rudra Group Leads" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_OWNER,
      subject: `🔔 New Lead: ${name} — ${property}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff;">
          <h2 style="color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 10px; margin-top: 0;">
            New Inquiry — Rudra Group
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr><td style="padding: 10px 8px; font-weight: bold; width: 140px; border-bottom: 1px solid #f1f5f9; color: #475569;">Name</td><td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9;">${name}</td></tr>
            <tr><td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #475569;">Email</td><td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
            <tr><td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #475569;">Phone</td><td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9;">${phone}</td></tr>
            <tr><td style="padding: 10px 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #475569;">Property</td><td style="padding: 10px 8px; border-bottom: 1px solid #f1f5f9;">${property}</td></tr>
            <tr><td style="padding: 10px 8px; font-weight: bold; color: #475569; vertical-align: top;">Message</td><td style="padding: 10px 8px; white-space: pre-wrap;">${message}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">This lead was submitted via the Rudra Group website contact form.</p>
        </div>
      `,
    };

    // 2. User feedback/acknowledgment email
    const userMailOptions = {
      from: `"Rudra Group" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting Rudra Group!`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 10px; color: #334155; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #b45309; margin: 0; font-size: 22px;">Rudra Group</h2>
            <p style="font-size: 13px; color: #64748b; margin: 6px 0 0 0;">Premium Land &amp; Infrastructure in Dholera SIR</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
          <p style="margin: 0 0 12px 0;">Dear <strong>${name}</strong>,</p>
          <p style="margin: 0 0 12px 0;">
            Thank you for reaching out to Rudra Group. We have successfully received your inquiry regarding 
            <strong style="color: #b45309;">"${property}"</strong>.
          </p>
          <p style="margin: 0 0 16px 0;">
            One of our sales executives will contact you shortly on <strong>${phone}</strong> or via email 
            to share detailed brochures, layout plans, pricing, and answer any questions you may have.
          </p>
          <div style="background: #fefce8; border-left: 4px solid #d97706; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #92400e; font-size: 13px;">Your Inquiry:</p>
            <p style="margin: 8px 0 0 0; font-style: italic; color: #78350f; font-size: 14px;">"${message}"</p>
          </div>
          <p style="margin: 0 0 20px 0;">
            In the meantime, feel free to reply to this email or visit our website to explore our ongoing township developments.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            &copy; ${currentYear} Rudra Group. All rights reserved.<br />
            RERA Registered Developer in Dholera SIR Smart City, Gujarat, India.
          </p>
        </div>
      `,
    };

    // Send both emails — sequentially to prevent Gmail concurrent connection locks
    let ownerMailSent = false;
    let userMailSent = false;
    let mailErrors = [];

    try {
      const transporter = getTransporter();

      // 1. Send owner notification
      try {
        await transporter.sendMail(ownerMailOptions);
        ownerMailSent = true;
        console.log(`✅ Owner notification sent to: ${process.env.EMAIL_OWNER}`);
      } catch (err) {
        console.error('❌ Owner notification failed:', err.message);
        mailErrors.push(`Owner: ${err.message}`);
      }

      // 2. Send user thank you
      try {
        await transporter.sendMail(userMailOptions);
        userMailSent = true;
        console.log(`✅ User thank you email sent to: ${email}`);
      } catch (err) {
        console.error('❌ User thank you email failed:', err.message);
        mailErrors.push(`User: ${err.message}`);
      }

      // If both failed, we raise an error
      if (!ownerMailSent && !userMailSent) {
        throw new Error('Both emails failed to deliver: ' + mailErrors.join(' | '));
      }
    } catch (mailError) {
      console.error('❌ Email sending failed:', mailError.message);
      // Delete the saved lead so the user can try again
      await Lead.findByIdAndDelete(savedLead._id);
      return res.status(500).json({
        message: 'Form submitted but email delivery failed. Please try again or contact us directly.',
        detail: mailError.message,
      });
    }

    res.status(201).json(savedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update lead status (Admin Dashboard)
router.put('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    lead.status = req.body.status || lead.status;
    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a lead (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
