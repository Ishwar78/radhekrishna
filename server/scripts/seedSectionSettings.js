import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SectionSettings from '../models/SectionSettings.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sharmaishwar970:ISHWAR123@cluster0.b73q6ph.mongodb.net/Vastra';

async function seedSectionSettings() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🧹 Clearing existing section settings...');
    await SectionSettings.deleteMany({});

    console.log('📝 Creating default section settings...');
    const defaultSettings = [
      {
        sectionKey: 'diwali-sale',
        title: 'DIWALI SALE 🔥',
        subtitle: 'Exclusive Collections at Amazing Prices',
        description: 'Celebrate the festival of lights with our stunning collection',
        backgroundPattern: 'diwali',
        accentColor: '#d4a574',
        showDecorativeStrip: true,
        isActive: true
      },
      {
        sectionKey: 'holi-sale',
        title: 'HOLI SALE 🎨',
        subtitle: 'Festive Colors & Designs',
        description: 'Celebrate with vibrant colors and beautiful designs',
        backgroundPattern: 'holi',
        accentColor: '#d4a574',
        showDecorativeStrip: true,
        isActive: true
      },
      {
        sectionKey: 'trending-products',
        title: 'New Arrivals',
        subtitle: 'Discover the latest and most sought-after pieces',
        description: 'Fresh styles just in from our collection',
        backgroundPattern: 'elegant',
        accentColor: '#d4a574',
        showDecorativeStrip: true,
        isActive: true
      },
      {
        sectionKey: 'featured-products',
        title: 'Featured Products',
        subtitle: 'Handpicked styles that define elegance and tradition',
        description: 'Curated for you with love',
        backgroundPattern: 'elegant',
        accentColor: '#d4a574',
        showDecorativeStrip: true,
        isActive: true
      },
      {
        sectionKey: 'media-showcase',
        title: 'Trending Ethnic Wear',
        subtitle: 'Experience our stunning collection in motion',
        description: 'Live collection videos',
        backgroundPattern: 'festival',
        accentColor: '#d4a574',
        showDecorativeStrip: true,
        isActive: true
      },
      {
        sectionKey: 'collection-showcase',
        title: 'Shop by Collection',
        subtitle: 'Curated collections of handpicked ethnic wear',
        description: 'For every occasion',
        backgroundPattern: 'elegant',
        accentColor: '#d4a574',
        showDecorativeStrip: true,
        isActive: true
      },
      {
        sectionKey: 'collections',
        title: 'Collections',
        subtitle: 'Browse our featured collections',
        description: '',
        backgroundPattern: 'elegant',
        accentColor: '#d4a574',
        showDecorativeStrip: true,
        isActive: true
      },
      {
        sectionKey: 'reviews',
        title: 'What Our Customers Say',
        subtitle: 'Real photos from our valued customers',
        description: 'Testimonials and reviews',
        backgroundPattern: 'elegant',
        accentColor: '#d4a574',
        showDecorativeStrip: true,
        isActive: true
      }
    ];

    const createdSettings = await SectionSettings.insertMany(defaultSettings);
    console.log(`✅ Created ${createdSettings.length} section settings`);

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('✨ Section Settings seeding completed!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Available Sections:');
    createdSettings.forEach(setting => {
      console.log(`  ✓ ${setting.sectionKey} - "${setting.title}"`);
    });
    console.log('');
    console.log('Patterns available: diwali, holi, festival, gold, elegant, modern');
    console.log('');

    await mongoose.disconnect();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding section settings:', error);
    process.exit(1);
  }
}

seedSectionSettings();
