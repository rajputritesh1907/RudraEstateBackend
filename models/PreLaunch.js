import mongoose from 'mongoose';

const preLaunchSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  launchDate: { type: Date, required: true },
  category: { type: String, default: 'Residential' },
  location: { type: String, default: 'Dholera SIR' },
  priceRange: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

const PreLaunch = mongoose.model('PreLaunch', preLaunchSchema);
export default PreLaunch;
