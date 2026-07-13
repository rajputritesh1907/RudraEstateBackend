import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import preLaunchRoutes from './routes/preLaunchRoutes.js';

import Project from './models/Project.js';
import Blog from './models/Blog.js';
import Testimonial from './models/Testimonial.js';
import PreLaunch from './models/PreLaunch.js';

dotenv.config();

const app = express();

// Middlewares — allow requests from local dev and Vercel production
const allowedOrigins = [
  'http://localhost:3000',
  'https://rudra-group.vercel.app',
  // Allow any vercel preview URLs too
  /^https:\/\/rudra-group.*\.vercel\.app$/,
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, server-to-server)
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some((o) =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (isAllowed) return callback(null, true);
    return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/prelaunches', preLaunchRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Rudra Group Backend API is running successfully.');
});

const seedDatabase = async () => {
  try {
    console.log('Re-seeding initial projects into MongoDB Atlas...');
    await Project.deleteMany({});
    const seedProjects = [
      {
          title: "Orchid River View",
          phase: "Phase I",
          status: "Active",
          type: "Residential",
          description: "Premium river-facing residential plots in Dholera SIR with world-class amenities, close connectivity to the express highway, and a serene lifestyle environment.",
          location: "Dholera SIR",
          priceRange: "₹18 Lakh - ₹45 Lakh",
          sizeRange: "1,500 - 4,000 sq.ft.",
          amenities: ["Riverfront Walkway", "24/7 Security", "Clubhouse Area", "Underground Utilities", "Blacktop Roads"],
          highlights: ["High Return Investment", "Near Activation Area", "Clear Legal Titles"],
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
          featured: true
        },
        {
          title: "Orchid Villa Greens",
          phase: "Phase II",
          status: "Active",
          type: "Residential",
          description: "Eco-friendly premium villa townships designed for modern sustainable living, complete with solar lighting, community gardening, and premium landscapes.",
          location: "Dholera SIR",
          priceRange: "₹25 Lakh - ₹60 Lakh",
          sizeRange: "2,500 - 6,000 sq.ft.",
          amenities: ["Solar Energy Supply", "Organic Farm Area", "Swimming Pool", "Gymnasium", "Landscape Gardens"],
          highlights: ["Eco-friendly Development", "TPS 2 Location", "Fast Allotment Process"],
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          featured: true
        },
        {
          title: "Orchid Villa Luxuriya",
          phase: "Phase I",
          status: "Active",
          type: "Residential",
          description: "Ultra-luxury residential spaces for high-end villas. Gated community featuring high-tech security, smart homes, and exclusive access to the premium golf courses.",
          location: "Dholera SIR",
          priceRange: "₹35 Lakh - ₹90 Lakh",
          sizeRange: "3,000 - 7,000 sq.ft.",
          amenities: ["Smart Gated System", "Golf Course Access", "Mini Theater", "Premium Clubhouse", "Concierge Service"],
          highlights: ["Ultra-luxury Gated Community", "Immediate Possession Available", "Premium Corner Plots"],
          image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
          featured: true
        },
        {
          title: "Dholera Bhoomi",
          phase: "Phase III",
          status: "Sold Out",
          type: "Residential",
          description: "Rudra's landmark residential project in the heart of Dholera SIR, fully sold out with immediate possession and titles transferred.",
          location: "Dholera SIR",
          priceRange: "₹12 Lakh - ₹30 Lakh",
          sizeRange: "1,200 - 3,500 sq.ft.",
          amenities: ["Security Post", "Street Lights", "Water Storage Tank", "Children Park Area"],
          highlights: ["100% Sold Out", "Completed in 2024", "Satisfied Customers"],
          image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
          featured: false
        },
        {
          title: "Rudra Commercial Hub",
          phase: "Phase I",
          status: "Active",
          type: "Commercial",
          description: "Commercial plots positioned in Dholera's central business district (CBD). Perfect for offices, retail stores, and dining hubs.",
          location: "Dholera SIR",
          priceRange: "₹40 Lakh - ₹1.5 Crore",
          sizeRange: "2,000 - 8,000 sq.ft.",
          amenities: ["Heavy Power Connection", "CBD Main Road Access", "High-speed Fiber Internet", "Dedicated Parking Lots"],
          highlights: ["High ROI Potential", "Prime CBD Location", "TPS 1 Corner Plots"],
          image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
          featured: true
        },
        {
          title: "Rudra Industrial Park",
          phase: "Phase II",
          status: "Active",
          type: "Industrial",
          description: "Massive industrial plots equipped with heavy infrastructure, close proximity to the Ahmedabad-Dholera Expressway and the upcoming Dholera International Airport.",
          location: "Dholera SIR",
          priceRange: "₹80 Lakh - ₹4.5 Crore",
          sizeRange: "10,000 - 50,000 sq.ft.",
          amenities: ["220KV Power Supply", "Heavy Transport Access Roads", "Effluent Disposal Line", "Gas Pipelines Connection"],
          highlights: ["Ideal for Warehouses/Manufacturing", "Next to Multi-Modal Logistics Hub", "Easy Government Approvals"],
          image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
          featured: false
        }
      ];
      await Project.insertMany(seedProjects);
      console.log('Seeded projects successfully.');

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('Seeding initial blogs into MongoDB Atlas...');
      const seedBlogs = [
        {
          title: "Investing in Dholera SIR: A Beginner's Guide",
          category: "Investment",
          summary: "Discover why Dholera SIR is hailed as India's first smart-planned industrial city and learn the step-by-step land acquisition process.",
          content: "Dholera Special Investment Region (SIR) is a pioneer project of the Government of India under the Delhi-Mumbai Industrial Corridor (DMIC). Spread over 920 sq. km, Dholera is double the size of Ahmedabad. With massive developments in digital infrastructure, grid power, green energy, and industrial potential, early land investment in Dholera is poised to yield up to 10x returns over the next decade. To start your investment journey, you must verify the Town Planning Scheme (TPS) zones, obtain legal approvals, and secure clear titles.",
          date: "July 2, 2026",
          readTime: "4 min read",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Understanding the Dholera Town Planning (TP) Scheme",
          category: "Legal",
          summary: "An in-depth explanation of TP schemes, land zoning classifications, and how to verify if your plot falls within the residential or commercial zone.",
          content: "A Town Planning Scheme (TPS) is a land pooling model used in Gujarat. Instead of acquiring land outright, the government aggregates the land, designs state-of-the-art infrastructure (wide roads, parks, utility corridors, digital services), and redistributes optimized, high-value final plots back to the owners. This ensures extremely well-planned sectors. When purchasing, always check the TPS maps, the Draft/Sanctioned status, and the zone classification (Residential, Commercial, Industrial, or Public Purpose).",
          date: "June 25, 2026",
          readTime: "6 min read",
          image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80"
        },
        {
          title: "Tata Semiconductor Plant in Dholera: Impact on Real Estate",
          category: "Infrastructure",
          summary: "With Tata Electronics' upcoming $10.9B semiconductor fab in Dholera, we analyze how this massive project is driving real estate demand.",
          content: "Tata Electronics, in partnership with Taiwan's PSMC, is establishing a mega semiconductor fabrication plant in Dholera SIR with a total investment of ₹91,000 Crore ($10.9 Billion). This plant is expected to generate over 20,000 direct and indirect high-tech engineering jobs. The influx of engineers, executives, and auxiliary manufacturing units has caused an immediate surge in demand for residential layouts, premium villa societies, and commercial office complexes, cementing Dholera as Gujarat's premier investment hotspot.",
          date: "May 18, 2026",
          readTime: "5 min read",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
        }
      ];
      await Blog.insertMany(seedBlogs);
      console.log('Seeded blogs successfully.');
    }

    // Ensure 6 testimonials are seeded for the auto-scroll carousel
    console.log('Seeding initial testimonials into MongoDB Atlas...');
    await Testimonial.deleteMany({});
    const seedTestimonials = [
      {
        name: "Rakesh Sharma",
        designation: "Investor, Ahmedabad",
        message: "Rudra Group helped me acquire 3 residential plots in Dholera SIR. The transaction was extremely transparent, and the title deeds were transferred with zero hassle. Highly recommended for premium customer service!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      {
        name: "Amit Patel",
        designation: "Managing Director, TechMotive",
        message: "We purchased industrial land for our manufacturing unit through Rudra. Their team handled everything from local zoning verification to road access approvals. Exceptional professionalism.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      {
        name: "Sneha Reddy",
        designation: "NRI Investor, USA",
        message: "Being an NRI, trusting developers in India can be challenging. But Rudra provided me complete video logs, constant WhatsApp updates, and clear documentation. I'm very satisfied with my investment.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      {
        name: "Karan Johar",
        designation: "Business Owner, Delhi",
        message: "I invested in their commercial hub project. The location is prime and right next to the expressway. The appreciation is already showing. Rudra is the most trusted name in Dholera.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      {
        name: "Meera Deshmukh",
        designation: "Private Wealth Manager",
        message: "Multiple clients of mine have routed investments into Dholera through Rudra Group. Their legal clearances (RERA approval, clear titles) make them highly reliable for high-value portfolios.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      {
        name: "Sanjay Singhania",
        designation: "Industrialist, Mumbai",
        message: "Acquired a massive 50,000 sq.ft. industrial plot for our logistics division. Rudra's execution speed is top-notch, assisting with utility allocations and government permits.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    ];
    await Testimonial.insertMany(seedTestimonials);
    console.log('Seeded 6 testimonials successfully.');

    // Ensure PreLaunch items are seeded and rebranded
    console.log('Seeding initial pre-launch items into MongoDB Atlas...');
    await PreLaunch.deleteMany({});
    const seedPreLaunches = [
      {
        heading: 'Orchid Sky Residences — Phase III',
        description: 'The most anticipated villa township in Dholera SIR is coming — featuring sky-facing terraces, private swimming pools, ultra-smart home systems, and direct expressway access. Register your interest now to get early-bird pricing.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        launchDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Residential',
        location: 'TPS-2, Dholera SIR',
        priceRange: '₹45 Lakh – ₹1.2 Cr',
        isActive: true
      },
      {
        heading: 'Rudra Commerce Hub — CBD Block A',
        description: 'Prime commercial plots in the Central Business District of Dholera SIR, adjacent to the proposed metro station and expressway interchange. Designed for retail anchors, corporate headquarters, and hospitality ventures.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        launchDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Commercial',
        location: 'CBD Zone, Dholera SIR',
        priceRange: '₹80 Lakh – ₹3.5 Cr',
        isActive: true
      },
      {
        heading: 'Industrial Mega Park — Sector 6',
        description: 'Large-format industrial parcels built for heavy manufacturing, warehouse logistics, and tier-1 industrial supply chain operations. Located near the proposed freight corridor and Dholera International Airport. DMIC-eligible investment zones.',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        launchDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Industrial',
        location: 'Sector 6, Dholera SIR',
        priceRange: '₹1.5 Cr – ₹8 Cr',
        isActive: true
      }
    ];
    await PreLaunch.insertMany(seedPreLaunches);
    console.log('Seeded pre-launch items successfully.');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
  await seedDatabase();
});
