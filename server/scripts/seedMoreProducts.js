require('dotenv').config();
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Product = require('../src/models/Product');

const seedMoreProducts = async () => {
  await connectDB();

  // Fetch existing sellers to assign as product owners
  const sellers = await User.find({ role: { $in: ['seller', 'admin'] } }).select('_id');
  if (sellers.length === 0) {
    console.error('No sellers found. Run the main seed.js first.');
    process.exit(1);
  }

  // Round-robin helper to distribute products across sellers
  const seller = (i) => sellers[i % sellers.length]._id;

  const products = [
    // ── Mugs ────────────────────────────────────────────────────────────────
    {
      name: 'Warli Art Coffee Mug',
      description: 'White ceramic mug featuring hand-drawn Warli tribal art. Microwave and dishwasher safe.',
      price: 379,
      imageUrl: 'https://picsum.photos/seed/mug2/400/400',
      category: 'Mugs',
      stock: 90,
      seller: seller(0),
      rating: { average: 4.3, count: 27 },
    },
    {
      name: 'Meenakari Enamel Mug',
      description: 'Vibrant enamel mug with Meenakari floral patterns inspired by Jaipur craftsmanship.',
      price: 429,
      imageUrl: 'https://picsum.photos/seed/mug3/400/400',
      category: 'Mugs',
      stock: 60,
      seller: seller(1),
      rating: { average: 4.6, count: 43 },
    },
    {
      name: 'Pattachitra Motif Mug',
      description: 'Odisha Pattachitra art printed on a sturdy bone-china mug. 350 ml capacity.',
      price: 399,
      imageUrl: 'https://picsum.photos/seed/mug4/400/400',
      category: 'Mugs',
      stock: 110,
      seller: seller(2),
      rating: { average: 4.1, count: 18 },
    },
    {
      name: 'Tie-Dye Shibori Mug',
      description: 'Handmade ceramic mug with shibori dye patterns in indigo and white. Each piece is unique.',
      price: 459,
      imageUrl: 'https://picsum.photos/seed/mug5/400/400',
      category: 'Mugs',
      stock: 45,
      seller: seller(0),
      rating: { average: 4.8, count: 61 },
    },
    // ── Bags ─────────────────────────────────────────────────────────────────
    {
      name: 'Ikat Weave Shoulder Bag',
      description: 'Handwoven Ikat fabric shoulder bag with a zip closure. Fits a 13" laptop.',
      price: 799,
      imageUrl: 'https://picsum.photos/seed/bag2/400/400',
      category: 'Bags',
      stock: 50,
      seller: seller(1),
      rating: { average: 4.4, count: 32 },
    },
    {
      name: 'Jute Shopper Bag',
      description: 'Large eco-friendly jute shopper with cotton lining and wooden button closure.',
      price: 449,
      imageUrl: 'https://picsum.photos/seed/bag3/400/400',
      category: 'Bags',
      stock: 130,
      seller: seller(2),
      rating: { average: 4.2, count: 19 },
    },
    {
      name: 'Suzani Embroidered Clutch',
      description: 'Silk clutch with intricate Suzani embroidery. Comes with a detachable chain strap.',
      price: 649,
      imageUrl: 'https://picsum.photos/seed/bag4/400/400',
      category: 'Bags',
      stock: 35,
      seller: seller(0),
      rating: { average: 4.7, count: 24 },
    },
    // ── Footwear ─────────────────────────────────────────────────────────────
    {
      name: 'Mojari Jutti – Gold Thread',
      description: 'Traditional Punjabi mojari with gold thread embroidery. Hand-stitched leather sole.',
      price: 1149,
      imageUrl: 'https://picsum.photos/seed/footwear2/400/400',
      category: 'Footwear',
      stock: 30,
      seller: seller(1),
      rating: { average: 4.5, count: 47 },
    },
    {
      name: 'Nagra Leather Shoes',
      description: 'Rajasthani Nagra shoes in vegetable-tanned leather with a pointed toe. Sizes 6-12.',
      price: 1399,
      imageUrl: 'https://picsum.photos/seed/footwear3/400/400',
      category: 'Footwear',
      stock: 25,
      seller: seller(2),
      rating: { average: 4.6, count: 38 },
    },
    {
      name: 'Handwoven Cane Slippers',
      description: 'Lightweight cane-weave slippers with anti-slip rubber soles. Perfect for summer.',
      price: 549,
      imageUrl: 'https://picsum.photos/seed/footwear4/400/400',
      category: 'Footwear',
      stock: 70,
      seller: seller(0),
      rating: { average: 4.0, count: 15 },
    },
    // ── Clothing ──────────────────────────────────────────────────────────────
    {
      name: 'Ajrakh Block Print Dupatta',
      description: 'Hand block-printed Ajrakh dupatta on pure cotton. Natural dyes only.',
      price: 749,
      imageUrl: 'https://picsum.photos/seed/clothing2/400/400',
      category: 'Clothing',
      stock: 80,
      seller: seller(1),
      rating: { average: 4.5, count: 33 },
    },
    {
      name: 'Kantha Stitch Jacket',
      description: 'Upcycled sari fabric jacket with Kantha running-stitch embroidery. One size fits most.',
      price: 1599,
      imageUrl: 'https://picsum.photos/seed/clothing3/400/400',
      category: 'Clothing',
      stock: 20,
      seller: seller(2),
      rating: { average: 4.9, count: 52 },
    },
    {
      name: 'Bandhani Tie-Dye Saree',
      description: 'Traditional Gujarati Bandhani saree in georgette fabric. Includes matching blouse piece.',
      price: 2499,
      imageUrl: 'https://picsum.photos/seed/clothing4/400/400',
      category: 'Clothing',
      stock: 15,
      seller: seller(0),
      rating: { average: 4.7, count: 29 },
    },
    {
      name: 'Phulkari Embroidered Dupatta',
      description: 'Vibrant Phulkari embroidery on chiffon dupatta. A Punjab heritage craft.',
      price: 899,
      imageUrl: 'https://picsum.photos/seed/clothing5/400/400',
      category: 'Clothing',
      stock: 55,
      seller: seller(1),
      rating: { average: 4.4, count: 21 },
    },
    {
      name: 'Sambalpuri Ikat Kurta',
      description: 'Premium Sambalpuri Ikat cotton kurta. Geometric patterns woven directly into the fabric.',
      price: 1199,
      imageUrl: 'https://picsum.photos/seed/clothing6/400/400',
      category: 'Clothing',
      stock: 40,
      seller: seller(2),
      rating: { average: 4.6, count: 37 },
    },
    // ── Home Decor ────────────────────────────────────────────────────────────
    {
      name: 'Blue Pottery Flower Vase',
      description: 'Jaipur blue pottery vase with floral motifs. Food-safe glaze. Width 12 cm, Height 20 cm.',
      price: 699,
      imageUrl: 'https://picsum.photos/seed/decor1/400/400',
      category: 'Home Decor',
      stock: 60,
      seller: seller(0),
      rating: { average: 4.5, count: 41 },
    },
    {
      name: 'Dhokra Brass Elephant Figurine',
      description: 'Lost-wax cast Dhokra figurine from Bastar, Chhattisgarh. Unique tribal art.',
      price: 849,
      imageUrl: 'https://picsum.photos/seed/decor2/400/400',
      category: 'Home Decor',
      stock: 35,
      seller: seller(1),
      rating: { average: 4.8, count: 56 },
    },
    {
      name: 'Kalamkari Wall Hanging',
      description: 'Hand-painted Kalamkari panel on cotton canvas (60x90 cm). Depicts the Dashavatara.',
      price: 1349,
      imageUrl: 'https://picsum.photos/seed/decor3/400/400',
      category: 'Home Decor',
      stock: 18,
      seller: seller(2),
      rating: { average: 4.7, count: 23 },
    },
    {
      name: 'Bamboo Wind Chime',
      description: 'Handcrafted bamboo wind chime from Assam. Natural finish, melodic tones.',
      price: 349,
      imageUrl: 'https://picsum.photos/seed/decor4/400/400',
      category: 'Home Decor',
      stock: 95,
      seller: seller(0),
      rating: { average: 4.2, count: 17 },
    },
    {
      name: 'Terracotta Diya Set (12 pcs)',
      description: 'Handmade terracotta diyas from Kumhartoli. Set of 12. Perfect for Diwali and puja.',
      price: 299,
      imageUrl: 'https://picsum.photos/seed/decor5/400/400',
      category: 'Home Decor',
      stock: 200,
      seller: seller(1),
      rating: { average: 4.3, count: 64 },
    },
    // ── Stationery ────────────────────────────────────────────────────────────
    {
      name: 'Handmade Lokta Paper Journal',
      description: 'Eco-friendly journal made with Lokta bark paper. 150 unlined pages. Lay-flat binding.',
      price: 389,
      imageUrl: 'https://picsum.photos/seed/stationery2/400/400',
      category: 'Stationery',
      stock: 110,
      seller: seller(2),
      rating: { average: 4.4, count: 28 },
    },
    {
      name: 'Warli Art Pen Holder Set',
      description: 'Set of 3 wooden pen holders with laser-etched Warli motifs. Great desk accessory.',
      price: 449,
      imageUrl: 'https://picsum.photos/seed/stationery3/400/400',
      category: 'Stationery',
      stock: 75,
      seller: seller(0),
      rating: { average: 4.1, count: 12 },
    },
    {
      name: 'Handmade Recycled Paper Cards (Set of 10)',
      description: 'Blank greeting cards made from recycled sari fabric. Each card is slightly different.',
      price: 199,
      imageUrl: 'https://picsum.photos/seed/stationery4/400/400',
      category: 'Stationery',
      stock: 250,
      seller: seller(1),
      rating: { average: 4.5, count: 39 },
    },
    // ── Jewellery ─────────────────────────────────────────────────────────────
    {
      name: 'Tribal Silver Jhumka Earrings',
      description: 'Sterling silver jhumka earrings with intricate filigree work from Cuttack, Odisha.',
      price: 1099,
      imageUrl: 'https://picsum.photos/seed/jewellery1/400/400',
      category: 'Jewellery',
      stock: 40,
      seller: seller(2),
      rating: { average: 4.8, count: 71 },
    },
    {
      name: 'Lac Bangle Set (Set of 6)',
      description: 'Vibrant lac bangles from Jaipur with mirror and stone inlay. Available in S/M/L.',
      price: 499,
      imageUrl: 'https://picsum.photos/seed/jewellery2/400/400',
      category: 'Jewellery',
      stock: 85,
      seller: seller(0),
      rating: { average: 4.3, count: 44 },
    },
    {
      name: 'Dokra Brass Necklace',
      description: 'Handcast Dokra necklace with geometric tribal pendant. Nickel-free brass.',
      price: 799,
      imageUrl: 'https://picsum.photos/seed/jewellery3/400/400',
      category: 'Jewellery',
      stock: 30,
      seller: seller(1),
      rating: { average: 4.6, count: 26 },
    },
    // ── Food & Wellness ───────────────────────────────────────────────────────
    {
      name: 'Organic Kashmiri Saffron (2g)',
      description: 'Pure Mongra grade saffron from Pampore, Kashmir. Lab-tested for authenticity.',
      price: 649,
      imageUrl: 'https://picsum.photos/seed/food1/400/400',
      category: 'Food & Wellness',
      stock: 150,
      seller: seller(2),
      rating: { average: 4.9, count: 88 },
    },
    {
      name: 'Cold-Pressed Coconut Oil (500ml)',
      description: 'Wood-pressed virgin coconut oil from Kerala. No chemicals, no heat processing.',
      price: 399,
      imageUrl: 'https://picsum.photos/seed/food2/400/400',
      category: 'Food & Wellness',
      stock: 180,
      seller: seller(0),
      rating: { average: 4.7, count: 53 },
    },
    {
      name: 'Assamese Masala Chai Blend (100g)',
      description: 'CTC Assam tea blended with home-ground cardamom, ginger, and cinnamon. Makes ~50 cups.',
      price: 249,
      imageUrl: 'https://picsum.photos/seed/food3/400/400',
      category: 'Food & Wellness',
      stock: 220,
      seller: seller(1),
      rating: { average: 4.5, count: 67 },
    },
    {
      name: 'Amla & Brahmi Hair Oil (200ml)',
      description: 'Ayurvedic hair oil with amla, brahmi, and bhringraj in a sesame base. Promotes hair growth.',
      price: 349,
      imageUrl: 'https://picsum.photos/seed/food4/400/400',
      category: 'Food & Wellness',
      stock: 160,
      seller: seller(2),
      rating: { average: 4.4, count: 49 },
    },
  ];

  const inserted = await Product.insertMany(products);
  console.log(`✅ Inserted ${inserted.length} new products into the database.`);
  process.exit(0);
};

seedMoreProducts().catch((err) => {
  console.error('Product seeding failed:', err);
  process.exit(1);
});
