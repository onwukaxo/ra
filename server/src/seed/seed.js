import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import connectDB from '../config/db.js'
import User from '../models/User.js'
import MenuItem from '../models/MenuItem.js'
import CommunityPost from '../models/CommunityPost.js'

async function run() {
  await connectDB()

  console.log('Clearing existing data...')
  await Promise.all([
    User.deleteMany({}),
    MenuItem.deleteMany({}),
    CommunityPost.deleteMany({}),
  ])

  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
  const adminEmail = process.env.ADMIN_EMAIL || 'hello@rationsfood.com'

  console.log('Seeding users...')
  const admin = await User.create({
    name: 'Admin',
    email: adminEmail,
    phone: '+2349010000000',
    phoneVerified: true,
    emailVerified: true,
    isVerified: true,
    password: await bcrypt.hash(adminPassword, 10),
    role: 'ADMIN',
  })

  const user = await User.create({
    name: 'Test User',
    email: 'user@rations.com',
    phone: '08012345678',
    phoneVerified: true,
    emailVerified: true,
    isVerified: true,
    password: await bcrypt.hash('User123!', 10),
    role: 'USER',
  })

  await User.updateOne({ _id: admin._id }, { $set: { addressLine: '1 HQ Road', area: 'Central Area' } }, { strict: false })
  await User.updateOne({ _id: user._id }, { $set: { addressLine: '123 Food Street', area: 'Wuse 2' } }, { strict: false })

  console.log('Seeding menu items...' )
  await MenuItem.insertMany([
  {
    name: "Birdzilla burger & french fries",
    description: "Loaded Birdzilla chicken burger served with crispy french fries.",
    price: 10500,
    category: "Burger",
    isAvailable: true,
  },
  {
    name: "Oga burger & french fries",
    description: "Signature Oga burger with a generous side of golden french fries.",
    price: 13900,
    category: "Burger",
    isAvailable: true,
  },
  {
    name: "Cheesy affair burger & french fries",
    description: "Cheesy stacked burger paired with hot, crispy french fries.",
    price: 11600,
    category: "Burger",
    isAvailable: true,
  },
  {
    name: "Standard shawarma",
    description: "Classic Nigerian-style shawarma with juicy meat and creamy sauce.",
    price: 7200,
    category: "Wraps",
    isAvailable: true,
  },
  {
    name: "Cheese beef shawarma",
    description: "Beef shawarma loaded with melted cheese and rich fillings.",
    price: 9400,
    category: "Wraps",
    isAvailable: true,
  },
  {
    name: "Suya wrapped with cheese",
    description: "Spicy suya beef wrapped in a tortilla with gooey cheese.",
    price: 9000,
    category: "Wraps",
    isAvailable: true,
  },
  {
    name: "Beef wrapped with cheese",
    description: "Tender beef and melted cheese wrapped for a hearty bite.",
    price: 10000,
    category: "Wraps",
    isAvailable: true,
  },
  {
    name: "Birdzilla suya sandwiches",
    description: "Grilled Birdzilla suya packed into soft sandwiches with veggies.",
    price: 8900,
    category: "Sandwich",
    isAvailable: true,
  },
  {
    name: "Egg plantain sandwich",
    description: "Toasted sandwich stuffed with egg, fried plantain and sauce.",
    price: 7200,
    category: "Sandwich",
    isAvailable: true,
  },
  {
    name: "Prawn pasta",
    description: "Flavourful pasta tossed with juicy prawns.",
    price: 11600,
    category: "Pasta",
    isAvailable: true,
  },
  {
    name: "Pasta in tomato sauce with birdzilla",
    description: "Tomato-based pasta topped with Birdzilla chicken pieces.",
    price: 8300,
    category: "Pasta",
    isAvailable: true,
  },
  {
    name: "Stir fry pasta with birdzilla",
    description: "Stir-fried pasta with veggies and Birdzilla chicken.",
    price: 7200,
    category: "Pasta",
    isAvailable: true,
  },
  {
    name: "Stir fry pasta with beef",
    description: "Stir-fried pasta tossed with tender beef strips and vegetables.",
    price: 8300,
    category: "Pasta",
    isAvailable: true,
  },
  {
    name: "Asun rice",
    description: "Smoky rice loaded with spicy asun-style goat meat.",
    price: 9200,
    category: "Rice",
    isAvailable: true,
  },
  {
    name: "Malay rice",
    description: "Fried rice inspired by Asian flavours with veggies and spices.",
    price: 7200,
    category: "Rice",
    isAvailable: true,
  },
  {
    name: "Jollof rice",
    description: "Smoky Nigerian jollof rice cooked in rich tomato pepper sauce.",
    price: 3900,
    category: "Rice",
    isAvailable: true,
  },
  {
    name: "Loaded fries (Small)",
    description: "Small portion of fries topped with sauces and tasty toppings.",
    price: 3900,
    category: "Fries",
    isAvailable: true,
  },
  {
    name: "Loaded fries (Large)",
    description: "Large serving of fully loaded fries with toppings and sauces.",
    price: 7800,
    category: "Fries",
    isAvailable: true,
  },
  {
    name: "Plantain",
    description: "Sweet fried plantain slices, golden and caramelised.",
    price: 2300,
    category: "Fries",
    isAvailable: true,
  },
  {
    name: "French fries",
    description: "Crispy french fries, perfect as a side or snack.",
    price: 2800,
    category: "Fries",
    isAvailable: true,
  },
  {
    name: "Sweet potato fries",
    description: "Crispy sweet potato fries with a soft, sweet centre.",
    price: 2800,
    category: "Fries",
    isAvailable: true,
  },
  {
    name: "Slaw",
    description: "Creamy coleslaw made with fresh, crunchy vegetables.",
    price: 2800,
    category: "Salad",
    isAvailable: true,
  },
  {
    name: "Grilled chicken salad",
    description: "Fresh salad bowl topped with juicy grilled chicken.",
    price: 4500,
    category: "Salad",
    isAvailable: true,
  },
  {
    name: "Wings 8 pieces",
    description: "Portion of 8 seasoned and sauced chicken wings.",
    price: 6700,
    category: "Wings",
    isAvailable: true,
  },
  {
    name: "Wings 12 pieces",
    description: "Portion of 12 flavour-packed chicken wings.",
    price: 8900,
    category: "Wings",
    isAvailable: true,
  },
  {
    name: "Wings 16 pieces",
    description: "Family-sized portion of 16 juicy chicken wings.",
    price: 11000,
    category: "Wings",
    isAvailable: true,
  },
]
)

  console.log('Seeding community posts...')
  await CommunityPost.insertMany([
    {
      title: 'Food truck live this Friday',
      content: 'We are live at Wuse 2 this Friday from 4pm. Pull up with your squad!',
      tag: 'Event',
      publishedAt: new Date(),
      createdBy: admin._id,
    },
    {
      title: 'New spicy wings flavour',
      content: 'Meet our new extra spicy flavour made just for heat lovers.',
      tag: 'Promo',
      publishedAt: new Date(),
      createdBy: admin._id,
    },
  ])

  console.log('Done.')
  await mongoose.connection.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})