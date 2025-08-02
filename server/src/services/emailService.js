const transporter = require('../config/email');

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

const sendTicketNotification = async (ticket, type, recipient) => {
  const templates = {
    created: {
      subject: `New Ticket Created: ${ticket.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">New Ticket Created</h2>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>Description:</strong> ${ticket.description}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
          <p><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
          <p>Your ticket has been successfully created and is being reviewed by our support team.</p>
        </div>
      `
    },
    updated: {
      subject: `Ticket Updated: ${ticket.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Ticket Status Updated</h2>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>New Status:</strong> ${ticket.status}</p>
          <p><strong>Updated:</strong> ${new Date(ticket.updatedAt).toLocaleString()}</p>
          <p>Your ticket status has been updated. Please check your dashboard for more details.</p>
        </div>
      `
    },
    assigned: {
      subject: `Ticket Assigned: ${ticket.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Ticket Assigned</h2>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>Assigned To:</strong> ${ticket.assignedTo?.name || 'Support Team'}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
          <p>Your ticket has been assigned to a support agent and is being worked on.</p>
        </div>
      `
    },
    commented: {
      subject: `New Comment on Ticket: ${ticket.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">New Comment Added</h2>
          <p><strong>Subject:</strong> ${ticket.subject}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
          <p>A new comment has been added to your ticket. Please check your dashboard for the latest updates.</p>
        </div>
      `
    }
  };

  const template = templates[type];
  if (!template) {
    throw new Error(`Unknown notification type: ${type}`);
  }

  return await sendEmail({
    to: recipient.email,
    subject: template.subject,
    html: template.html
  });
};

const sendUpgradeRequestNotification = async (user, admins) => {
  const subject = 'New Role Upgrade Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3B82F6;">Role Upgrade Request</h2>
      <p><strong>User:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Current Role:</strong> ${user.role}</p>
      <p><strong>Requested:</strong> ${new Date().toLocaleString()}</p>
      <p>A user has requested a role upgrade. Please review and approve/reject the request.</p>
    </div>
  `;

  const emailPromises = admins.map(admin => 
    sendEmail({
      to: admin.email,
      subject,
      html
    })
  );

  return Promise.all(emailPromises);
};

module.exports = {
  sendEmail,
  sendTicketNotification,
  sendUpgradeRequestNotification
}; 