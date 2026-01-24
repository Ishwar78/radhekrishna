import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductSection from '../models/ProductSection.js';
import Product from '../models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sharmaishwar970:ISHWAR123@cluster0.b73q6ph.mongodb.net/Vastra';

async function seedDiwaliSale() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all products
    const allProducts = await Product.find({ isActive: true }).limit(12);
    
    if (allProducts.length === 0) {
      console.log('⚠️  No active products found. Create some products first.');
      await mongoose.disconnect();
      return;
    }

    console.log(`📦 Found ${allProducts.length} products`);

    // Check if diwali-sale section already exists
    let section = await ProductSection.findOne({ name: 'diwali-sale' });

    if (section) {
      console.log('📝 Updating existing Diwali Sale section...');
      section.productIds = allProducts.map(p => p._id);
      section.heading = 'DIWALI SALE 🔥';
      section.subheading = 'Exclusive Collections at Amazing Prices';
      section.displayLayout = 'asymmetric';
      section.isActive = true;
      await section.save();
      console.log('✅ Diwali Sale section updated!');
    } else {
      console.log('📝 Creating new Diwali Sale section...');
      section = new ProductSection({
        name: 'diwali-sale',
        heading: 'DIWALI SALE 🔥',
        subheading: 'Exclusive Collections at Amazing Prices',
        productIds: allProducts.map(p => p._id),
        displayLayout: 'asymmetric',
        backgroundImage: null,
        isActive: true,
        displayOrder: 0
      });
      await section.save();
      console.log('✅ Diwali Sale section created!');
    }

    console.log('');
    console.log('📊 Diwali Sale Section Details:');
    console.log(`   Name: diwali-sale`);
    console.log(`   Heading: DIWALI SALE 🔥`);
    console.log(`   Products: ${allProducts.length}`);
    console.log(`   Layout: asymmetric (1 large + 6 small)`);
    console.log('');
    console.log('✨ The Diwali Sale section is now visible on the home page!');
    
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding Diwali Sale section:', error);
    process.exit(1);
  }
}

seedDiwaliSale();
