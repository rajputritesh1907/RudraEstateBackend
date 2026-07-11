import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: '' },
  date: { type: String, required: true },
  readTime: { type: String, default: '5 min read' },
  author: { type: String, default: 'Rudra Editorial' }
}, {
  timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
