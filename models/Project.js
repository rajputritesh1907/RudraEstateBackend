import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  phase: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Sold Out'], default: 'Active' },
  type: { type: String, enum: ['Residential', 'Commercial', 'Industrial'], required: true },
  description: { type: String, required: true },
  location: { type: String, default: 'Dholera SIR' },
  priceRange: { type: String, default: '' },
  sizeRange: { type: String, default: '' },
  amenities: [{ type: String }],
  highlights: [{ type: String }],
  image: { type: String, default: '' },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
