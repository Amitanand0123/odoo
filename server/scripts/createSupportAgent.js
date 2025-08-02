const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

const createSupportAgent = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if support agent already exists
    const existingAgent = await User.findOne({ email: 'support@quickdesk.com' });
    if (existingAgent) {
      console.log('Support agent already exists');
      return;
    }

    // Create support agent user
    const supportAgent = await User.create({
      name: 'Support Agent',
      email: 'support@quickdesk.com',
      password: 'support123',
      role: 'support_agent',
      isActive: true
    });

    console.log('Support agent created successfully:', {
      id: supportAgent._id,
      name: supportAgent.name,
      email: supportAgent.email,
      role: supportAgent.role
    });

  } catch (error) {
    console.error('Error creating support agent:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createSupportAgent(); 