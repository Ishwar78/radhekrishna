import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Video from '../models/Video.js';
import Coupon from '../models/Coupon.js';
import ProductSection from '../models/ProductSection.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sharmaishwar970:ISHWAR123@cluster0.b73q6ph.mongodb.net/Vastra';

async function seedData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Video.deleteMany({});
    await ProductSection.deleteMany({});
    await Coupon.deleteMany({});

    // Create categories
    console.log('📁 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Ethnic Wear',
        slug: 'ethnic-wear',
        description: 'Traditional ethnic wear for all occasions',
        image: 'https://images.unsplash.com/photo-1590762035304-6b7b9b8b0b0b?w=300&q=80',
        isActive: true,
      },
      {
        name: 'Lehengas',
        slug: 'lehengas',
        description: 'Beautiful lehengas for festive occasions',
        image: 'https://images.unsplash.com/photo-1610706406159-b21bd25c5e9c?w=300&q=80',
        isActive: true,
      },
      {
        name: 'Sarees',
        slug: 'sarees',
        description: 'Elegant sarees in various styles',
        image: 'https://images.unsplash.com/photo-1540496362485-55d5db6b5949?w=300&q=80',
        isActive: true,
      },
      {
        name: 'Western Wear',
        slug: 'western-wear',
        description: 'Modern western wear collection',
        image: 'https://images.unsplash.com/photo-1584622246621-d0c7b67e7c35?w=300&q=80',
        isActive: true,
      },
      {
        name: 'Tops & Tees',
        slug: 'tops',
        description: 'Casual and formal tops',
        image: 'https://images.unsplash.com/photo-1552667466-07d71e725e34?w=300&q=80',
        isActive: true,
      },
      {
        name: 'Coord Sets',
        slug: 'coord-sets',
        description: 'Matching coord sets',
        image: 'https://images.unsplash.com/photo-1612886457395-ed8a7c5f0bf6?w=300&q=80',
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create products
    console.log('🛍️ Creating products...');
    const products = await Product.insertMany([
      {
        name: 'Embroidered Saree',
        slug: 'embroidered-saree-1',
        description: 'Beautiful hand-embroidered silk saree with traditional patterns',
        price: 8999,
        originalPrice: 12999,
        category: 'ethnic_wear',
        image: 'https://images.unsplash.com/photo-1540496362485-55d5db6b5949?w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1540496362485-55d5db6b5949?w=500&q=80',
          'https://images.unsplash.com/photo-1539008588435-666cafdc0d5f?w=500&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'Blue', 'Green'],
        stock: 15,
        isActive: true,
        isBestseller: true,
      },
      {
        name: 'Designer Lehenga',
        slug: 'designer-lehenga-1',
        description: 'Stunning designer lehenga with intricate embroidery',
        price: 14999,
        originalPrice: 21999,
        category: 'ethnic_wear',
        image: 'https://images.unsplash.com/photo-1610706406159-b21bd25c5e9c?w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1610706406159-b21bd25c5e9c?w=500&q=80',
          'https://images.unsplash.com/photo-1609929212258-72051b15c8f3?w=500&q=80',
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Gold', 'Maroon', 'Purple'],
        stock: 8,
        isActive: true,
        isNewProduct: true,
      },
      {
        name: 'Ethnic Kurta Set',
        slug: 'ethnic-kurta-set-1',
        description: 'Comfortable ethnic kurta set perfect for daily wear',
        price: 3999,
        originalPrice: 5999,
        category: 'ethnic_wear',
        image: 'https://images.unsplash.com/photo-1617274784969-5381981a8a6c?w=500&q=80',
        images: [
          'https://images.unsplash.com/photo-1617274784969-5381981a8a6c?w=500&q=80',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Cream', 'Teal', 'Pink'],
        stock: 20,
        isActive: true,
      },
      {
        name: 'Silk Lehenga',
        slug: 'silk-lehenga-1',
        description: 'Premium silk lehenga for special occasions',
        price: 5499,
        originalPrice: 7999,
        category: 'ethnic_wear',
        image: 'https://images.unsplash.com/photo-1609929212258-72051b15c8f3?w=500&q=80',
        sizes: ['S', 'M', 'L'],
        colors: ['Yellow', 'Green', 'Blue'],
        stock: 12,
        isActive: true,
        isNewProduct: true,
      },
      {
        name: 'Western Dress',
        slug: 'western-dress-1',
        description: 'Modern western dress with ethnic touch',
        price: 4499,
        originalPrice: 6499,
        category: 'western_wear',
        image: 'https://images.unsplash.com/photo-1584622246621-d0c7b67e7c35?w=500&q=80',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Beige'],
        stock: 25,
        isActive: true,
      },
      {
        name: 'Cotton Top',
        slug: 'cotton-top-1',
        description: 'Comfortable cotton top for casual wear',
        price: 1499,
        originalPrice: 2499,
        category: 'summer',
        image: 'https://images.unsplash.com/photo-1552667466-07d71e725e34?w=500&q=80',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Navy'],
        stock: 50,
        isActive: true,
        isSummer: true,
      },
      {
        name: 'Coord Set',
        slug: 'coord-set-1',
        description: 'Matching coord set for perfect style',
        price: 2999,
        originalPrice: 4499,
        category: 'ethnic_wear',
        image: 'https://images.unsplash.com/photo-1612886457395-ed8a7c5f0bf6?w=500&q=80',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Purple', 'Orange', 'Pink'],
        stock: 18,
        isActive: true,
      },
      {
        name: 'Bridal Lehenga',
        slug: 'bridal-lehenga-1',
        description: 'Exquisite bridal lehenga for your special day',
        price: 24999,
        originalPrice: 35999,
        category: 'ethnic_wear',
        image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd8d2c17?w=500&q=80',
        sizes: ['S', 'M', 'L'],
        colors: ['Red', 'Maroon'],
        stock: 3,
        isActive: true,
        isBestseller: true,
      },
      {
        name: 'Casual Saree',
        slug: 'casual-saree-1',
        description: 'Casual cotton saree for daily wear',
        price: 2999,
        originalPrice: 4499,
        category: 'ethnic_wear',
        image: 'https://images.unsplash.com/photo-1539008588435-666cafdc0d5f?w=500&q=80',
        sizes: ['S', 'M', 'L'],
        colors: ['Multi-color'],
        stock: 16,
        isActive: true,
      },
      {
        name: 'Printed Kurti',
        slug: 'printed-kurti-1',
        description: 'Colorful printed kurti with modern design',
        price: 1999,
        originalPrice: 3499,
        category: 'ethnic_wear',
        image: 'https://images.unsplash.com/photo-1617274784969-5381981a8a6c?w=500&q=80',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Red', 'Blue', 'Green', 'Yellow'],
        stock: 30,
        isActive: true,
        isNewProduct: true,
      },
      {
        name: 'Silk Dupatta',
        slug: 'silk-dupatta-1',
        description: 'Premium silk dupatta with embroidery',
        price: 999,
        originalPrice: 1999,
        category: 'ethnic_wear',
        image: 'https://images.unsplash.com/photo-1568449014236-8b3a33b944bc?w=500&q=80',
        sizes: ['S', 'M', 'L'],
        colors: ['Gold', 'Silver', 'Maroon'],
        stock: 40,
        isActive: true,
      },
      {
        name: 'Chiffon Saree',
        slug: 'chiffon-saree-1',
        description: 'Light and airy chiffon saree perfect for summers',
        price: 3499,
        originalPrice: 5999,
        category: 'summer',
        image: 'https://images.unsplash.com/photo-1539008588435-666cafdc0d5f?w=500&q=80',
        sizes: ['S', 'M', 'L'],
        colors: ['Sky Blue', 'Peach', 'Lavender'],
        stock: 22,
        isActive: true,
        isSummer: true,
      },
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Create videos
    console.log('🎥 Creating videos...');
    const videos = await Video.insertMany([
      {
        title: 'Festive Lehenga Collection',
        description: 'Stunning festive lehengas perfect for celebrations',
        url: 'https://cdn.pixabay.com/video/2020/05/25/39755-425025485_large.mp4',
        category: 'ETHNIC WEAR',
        price: 7499,
        originalPrice: 10999,
        badge: null,
        productId: products[0]._id.toString(),
        isActive: true,
        order: 1,
      },
      {
        title: 'Silk Saree Collection',
        description: 'Elegant silk sarees for traditional occasions',
        url: 'https://cdn.pixabay.com/video/2019/09/14/27153-361227498_large.mp4',
        category: 'ETHNIC WEAR',
        price: 8999,
        originalPrice: 11999,
        badge: 'NEW',
        productId: products[2]._id.toString(),
        isActive: true,
        order: 2,
      },
      {
        title: 'Bridal Lehenga Showcase',
        description: 'Exquisite bridal lehengas for your special day',
        url: 'https://cdn.pixabay.com/video/2019/06/07/24195-341553322_large.mp4',
        category: 'ETHNIC WEAR',
        price: 24999,
        originalPrice: 35999,
        badge: 'BESTSELLER',
        productId: products[7]._id.toString(),
        isActive: true,
        order: 3,
      },
      {
        title: 'Summer Kurti Collection',
        description: 'Light and colorful kurtis for summer',
        url: 'https://cdn.pixabay.com/video/2024/02/05/199394-909947976_large.mp4',
        category: 'ETHNIC WEAR',
        price: 1999,
        originalPrice: 3499,
        badge: null,
        productId: products[9]._id.toString(),
        isActive: true,
        order: 4,
      },
    ]);
    console.log(`✅ Created ${videos.length} videos`);

    // Create product sections
    console.log('📦 Creating product sections...');
    const sections = await ProductSection.insertMany([
      {
        name: 'diwali-sale',
        heading: 'Diwali Sale Collection',
        subheading: 'Celebrate with special festive discounts',
        productIds: products.slice(0, 6).map(p => p._id),
        displayLayout: 'grid',
        isActive: true,
        displayOrder: 0,
      },
      {
        name: 'holi-sale',
        heading: 'Holi Festival Collection',
        subheading: 'Colorful ethnic wear for the festival of colors',
        productIds: products.slice(3, 9).map(p => p._id),
        displayLayout: 'grid',
        isActive: true,
        displayOrder: 1,
      },
      {
        name: 'featured-collection',
        heading: 'Featured Collection',
        subheading: 'Hand-picked pieces for you',
        productIds: products.slice(0, 4).map(p => p._id),
        displayLayout: 'grid',
        isActive: true,
        displayOrder: 2,
      },
      {
        name: 'bestsellers',
        heading: 'Bestsellers',
        subheading: 'Most loved by our customers',
        productIds: products.filter(p => p.isBestseller).map(p => p._id),
        displayLayout: 'asymmetric',
        isActive: true,
        displayOrder: 3,
      },
      {
        name: 'new-arrivals',
        heading: 'New Arrivals',
        subheading: 'Fresh styles just in',
        productIds: products.filter(p => p.isNewProduct).map(p => p._id),
        displayLayout: 'carousel',
        isActive: true,
        displayOrder: 4,
      },
    ]);
    console.log(`✅ Created ${sections.length} product sections`);

    // Create coupons
    console.log('🎟️ Creating coupons...');
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const coupons = await Coupon.insertMany([
      {
        code: 'SAVE20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 2000,
        maxDiscount: 1000,
        usageLimit: 100,
        usedCount: 0,
        isActive: true,
        startDate: now,
        endDate: nextMonth,
      },
      {
        code: 'FLAT500',
        discountType: 'fixed',
        discountValue: 500,
        minOrderAmount: 3000,
        usageLimit: 50,
        usedCount: 0,
        isActive: true,
        startDate: now,
        endDate: nextMonth,
      },
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 1000,
        maxDiscount: 500,
        usageLimit: 200,
        usedCount: 5,
        isActive: true,
        startDate: now,
        endDate: nextMonth,
      },
      {
        code: 'FESTIVAL30',
        discountType: 'percentage',
        discountValue: 30,
        minOrderAmount: 5000,
        maxDiscount: 2000,
        usageLimit: 30,
        usedCount: 0,
        isActive: true,
        startDate: now,
        endDate: nextMonth,
      },
    ]);
    console.log(`✅ Created ${coupons.length} coupons`);

    console.log('');
    console.log('════════════════════════════════════════');
    console.log('✨ Database seeding completed successfully!');
    console.log('════════════════════════════════════════');
    console.log(`📊 Statistics:`);
    console.log(`   ✅ Categories: ${categories.length}`);
    console.log(`   ✅ Products: ${products.length}`);
    console.log(`   ✅ Videos: ${videos.length}`);
    console.log(`   ✅ Product Sections: ${sections.length}`);
    console.log(`   ✅ Coupons: ${coupons.length}`);
    console.log('');
    console.log('Available Coupon Codes:');
    coupons.forEach(coupon => {
      const discount = coupon.discountType === 'percentage' 
        ? `${coupon.discountValue}%` 
        : `₹${coupon.discountValue}`;
      console.log(`   • ${coupon.code} - ${discount} off`);
    });
    console.log('');

    await mongoose.disconnect();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedData();
