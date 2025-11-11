const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { firstName, lastName, email, phone, eventType, eventDate, message } = JSON.parse(event.body);

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !eventType || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Create transporter using Gmail (you can use other services)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email to your business
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'Timelessgatherings26@gmail.com', // Your business email
      subject: `New Event Inquiry: ${eventType} - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #d4a574; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
            New Event Inquiry
          </h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Contact Information</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Event Details</h3>
            <p><strong>Event Type:</strong> ${eventType}</p>
            <p><strong>Preferred Date:</strong> ${eventDate || 'Not specified'}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message</h3>
            <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d4a574; border-radius: 4px;">
              ${message}
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
            <p>This inquiry was submitted via the Timeless Gatherings contact form on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to customer
    const confirmationMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Your Inquiry - Timeless Gatherings',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d4a574;">Thank You, ${firstName}!</h2>
          <p>We've received your inquiry about your ${eventType} event and we're excited to help bring your vision to life.</p>
          <p>Our team will review your request and get back to you within 24 hours.</p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <h3 style="color: #333;">Your Inquiry Details:</h3>
            <p><strong>Event Type:</strong> ${eventType}</p>
            <p><strong>Preferred Date:</strong> ${eventDate || 'Not specified'}</p>
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
          </div>

          <p>In the meantime, feel free to reach out to us directly:</p>
          <p>📞 +91 636 001 1551</p>
          <p>📧 Timelessgatherings26@gmail.com</p>
          
          <p style="margin-top: 30px; color: #666; font-style: italic;">
            "Creating timeless memories, one celebration at a time."
          </p>
        </div>
      `
    };

    await transporter.sendMail(confirmationMail);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Email sent successfully' 
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};
