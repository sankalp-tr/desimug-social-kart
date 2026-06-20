require('dotenv').config();
const connectDB = require('./db/connection');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const WallPost = require('./models/WallPost');

const seed = async () => {
  await connectDB();

  // ── Clear existing data ──────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    WallPost.deleteMany({}),
  ]);
  console.log('Cleared existing data.');

  // ── 1. Users ─────────────────────────────────────────────────────────────
  const users = await User.create([
    {
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'admin',
    },
    {
      name: 'Priya Mehta',
      email: 'priya@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'seller',
    },
    {
      name: 'Rohan Verma',
      email: 'rohan@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'seller',
    },
    {
      name: 'Sneha Kapoor',
      email: 'sneha@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=4',
      role: 'buyer',
    },
    {
      name: 'Vikram Nair',
      email: 'vikram@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'buyer',
    },
  ]);
  console.log(`Inserted ${users.length} users.`);

  const [admin, seller1, seller2, buyer1, buyer2] = users;

  // ── 2. Products ───────────────────────────────────────────────────────────
  const products = await Product.create([
    {
      name: 'Desi Print Mug – Chai Time',
      description: 'A vibrant ceramic mug with a hand-painted chai motif. Perfect for your morning tea.',
      price: 349,
      imageUrl: 'https://picsum.photos/seed/mug1/400/400',
      category: 'Mugs',
      stock: 120,
      seller: seller1._id,
      rating: { average: 4.5, count: 38 },
    },
    {
      name: 'Rajasthani Block Print Tote',
      description: 'Eco-friendly cotton tote with traditional Rajasthani block print design.',
      price: 599,
      imageUrl: 'https://picsum.photos/seed/tote1/400/400',
      category: 'Bags',
      stock: 65,
      seller: seller1._id,
      rating: { average: 4.2, count: 21 },
    },
    {
      name: 'Kolhapuri Leather Sandals',
      description: 'Handcrafted genuine leather sandals from Kolhapur artisans. Available in sizes 6-11.',
      price: 1299,
      imageUrl: 'https://picsum.photos/seed/sandal1/400/400',
      category: 'Footwear',
      stock: 40,
      seller: seller2._id,
      rating: { average: 4.7, count: 55 },
    },
    {
      name: 'Madhubani Art Notebook',
      description: 'A5 hardcover notebook with Madhubani painting on the cover. 200 ruled pages.',
      price: 249,
      imageUrl: 'https://picsum.photos/seed/notebook1/400/400',
      category: 'Stationery',
      stock: 200,
      seller: seller2._id,
      rating: { average: 4.0, count: 14 },
    },
    {
      name: 'Handloom Khadi Kurta',
      description: 'Breathable khadi kurta woven by village artisans. Available in off-white and indigo.',
      price: 899,
      imageUrl: 'https://picsum.photos/seed/kurta1/400/400',
      category: 'Clothing',
      stock: 75,
      seller: seller1._id,
      rating: { average: 4.6, count: 29 },
    },
  ]);
  console.log(`Inserted ${products.length} products.`);

  const [p1, p2, p3, p4, p5] = products;

  // ── 3. Orders ─────────────────────────────────────────────────────────────
  const orders = await Order.create([
    {
      buyer: buyer1._id,
      items: [
        { product: p1._id, name: p1.name, quantity: 2, priceAtPurchase: p1.price },
        { product: p4._id, name: p4.name, quantity: 1, priceAtPurchase: p4.price },
      ],
      totalAmount: p1.price * 2 + p4.price,
      status: 'delivered',
      shippingAddress: {
        street: '12 MG Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
      },
      paymentStatus: 'paid',
    },
    {
      buyer: buyer2._id,
      items: [
        { product: p3._id, name: p3.name, quantity: 1, priceAtPurchase: p3.price },
      ],
      totalAmount: p3.price,
      status: 'shipped',
      shippingAddress: {
        street: '5 Park Street',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700016',
        country: 'India',
      },
      paymentStatus: 'paid',
    },
    {
      buyer: buyer1._id,
      items: [
        { product: p5._id, name: p5.name, quantity: 1, priceAtPurchase: p5.price },
        { product: p2._id, name: p2.name, quantity: 2, priceAtPurchase: p2.price },
      ],
      totalAmount: p5.price + p2.price * 2,
      status: 'confirmed',
      shippingAddress: {
        street: '7 Linking Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India',
      },
      paymentStatus: 'paid',
    },
    {
      buyer: buyer2._id,
      items: [
        { product: p1._id, name: p1.name, quantity: 3, priceAtPurchase: p1.price },
        { product: p4._id, name: p4.name, quantity: 2, priceAtPurchase: p4.price },
      ],
      totalAmount: p1.price * 3 + p4.price * 2,
      status: 'pending',
      shippingAddress: {
        street: '22 Civil Lines',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302006',
        country: 'India',
      },
      paymentStatus: 'unpaid',
    },
    {
      buyer: buyer1._id,
      items: [
        { product: p2._id, name: p2.name, quantity: 1, priceAtPurchase: p2.price },
      ],
      totalAmount: p2.price,
      status: 'cancelled',
      shippingAddress: {
        street: '9 Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: 'India',
      },
      paymentStatus: 'refunded',
    },
  ]);
  console.log(`Inserted ${orders.length} orders.`);

  // ── 4. WallPosts ──────────────────────────────────────────────────────────
  const wallPosts = await WallPost.create([
    {
      author: seller1._id,
      content: 'Just launched our new Chai Time mug collection! Each piece is hand-painted by artisans from Jaipur. Check the marketplace and grab yours before stock runs out! 🍵',
      imageUrl: 'https://picsum.photos/seed/post1/600/400',
      likes: [buyer1._id, buyer2._id, admin._id],
      comments: [
        { user: buyer1._id, text: 'Ordered two of these – absolutely love them!' },
        { user: admin._id, text: 'Great addition to the store, Priya!' },
      ],
      tags: ['mugs', 'handpainted', 'chai', 'newlaunch'],
    },
    {
      author: buyer1._id,
      content: 'My Kolhapuri sandals arrived today and they are stunning! The craftsmanship is incredible. Highly recommend Rohan\'s shop 👟',
      imageUrl: 'https://picsum.photos/seed/post2/600/400',
      likes: [seller2._id, buyer2._id],
      comments: [
        { user: seller2._id, text: 'Thank you so much, Sneha! Glad you love them 😊' },
      ],
      tags: ['kolhapuri', 'handcraft', 'review'],
    },
    {
      author: seller2._id,
      content: 'Behind-the-scenes look at how our Madhubani notebooks are made. Traditional art meets everyday utility. Available in the market now! 📒',
      imageUrl: 'https://picsum.photos/seed/post3/600/400',
      likes: [buyer1._id, seller1._id],
      comments: [
        { user: buyer2._id, text: 'Just placed an order. Can\'t wait to use it!' },
        { user: seller1._id, text: 'Love this collab of art and stationery.' },
      ],
      tags: ['madhubani', 'art', 'notebook', 'stationery'],
    },
    {
      author: admin._id,
      content: 'Welcome to DesiMug Social Kart – a marketplace celebrating India\'s artisan heritage. Explore handcrafted goods and support local creators! 🇮🇳',
      imageUrl: '',
      likes: [seller1._id, seller2._id, buyer1._id, buyer2._id],
      comments: [
        { user: seller1._id, text: 'So excited to be part of this platform!' },
        { user: buyer2._id, text: 'Finally, a place to find authentic Indian products.' },
        { user: seller2._id, text: 'Great initiative!' },
      ],
      tags: ['welcome', 'desimug', 'artisans', 'madeinindia'],
    },
    {
      author: buyer2._id,
      content: 'The khadi kurta from DesiMug just arrived. Incredibly soft fabric and the indigo color is gorgeous. Perfect for sustainable fashion lovers 🌿',
      imageUrl: 'https://picsum.photos/seed/post5/600/400',
      likes: [seller1._id, admin._id],
      comments: [
        { user: seller1._id, text: 'Thanks Vikram! The artisans will be thrilled to hear this.' },
      ],
      tags: ['khadi', 'sustainablefashion', 'kurta', 'review'],
    },
  ]);
  console.log(`Inserted ${wallPosts.length} wall posts.`);

  console.log('\n✅ Database seeded successfully!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
