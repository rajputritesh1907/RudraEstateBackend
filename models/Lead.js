import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  propertyOfInterest: { type: String, default: 'General Inquiry' },
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' }
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
