import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/database.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

dotenv.config();

const usersSeed = [
  {
    name: 'Admin User',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Normal User',
    firstName: 'Normal',
    lastName: 'User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
  },
];

const categoriesSeed = [
  { name: "Dairy" },
  { name: "Grocery" },
  { name: "Stationary & Staples" },
  { name: "Snacks & Beverages" },
  { name: "Bakery" },
  { name: "Household" },
  { name: "Electronics" },
  { name: "Fruits" },
  { name: "Vegetables" },
  { name: "Personal Care" },
];

const productsSeed = [
  {
    name: "Amul Taaza Milk",
    price: 65,
    description: "Fresh Amul Taaza milk, rich in nutrients.",
    categoryName: "Dairy",
    image: "https://www.amul.com/files/products/Amul-Tetrapack-Pack1L.jpg",
    stock: 50,
    expiry: "2026-04-10",
  },
  {
    name: "Amul Butter",
    price: 55,
    description: "Creamy Amul butter for your breakfast.",
    categoryName: "Dairy",
    image:
      "https://th.bing.com/th/id/OIP.P1Js20cLpu9n6Q1__HwznQHaES?w=326&h=189&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    stock: 40,
    expiry: "2026-05-15",
  },
  {
    name: "Aashirvaad Atta",
    price: 320,
    description: "Premium quality wheat flour.",
    categoryName: "Grocery",
    image:
      "https://th.bing.com/th/id/OIP.l92OT1XcVi-seJvscC5rPQHaHa?w=200&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    stock: 60,
    expiry: "2026-08-01",
  },
  {
    name: "Tata Salt",
    price: 25,
    description: "Iodized salt for healthy living.",
    categoryName: "Grocery",
    image:
      "https://th.bing.com/th/id/OIP.YYEKzP_40dw-9PKjeN0mYwHaHa?w=181&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    stock: 100,
    expiry: "2027-01-01",
  },
  {
    name: "Coca Cola",
    price: 40,
    description: "Chilled soft drink.",
    categoryName: "Snacks & Beverages",
    image: "https://tse1.mm.bing.net/th/id/OIP.9c5J7UFg82QEhxUc3RFIoAHaF7?rs=1&pid=ImgDetMain&o=7&rm=3",
    stock: 80,
    expiry: "2026-12-31",
  },
  {
    name: "Surf Excel Detergent",
    price: 210,
    description: "Powerful cleaning for clothes.",
    categoryName: "Household",
    image:
      "https://th.bing.com/th/id/OIP.J5Jl6GeGntlHkFtm7Cea_AHaHa?w=189&h=189&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    stock: 45,
    expiry: "2028-01-01",
  },
  {
    name: "Apple iPhone Charger",
    price: 1200,
    description: "Original Apple charger.",
    categoryName: "Electronics",
    image:
      "https://th.bing.com/th/id/OIP.92hkggy-7vkFDEHbzsNE2QHaGU?w=211&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    stock: 20,
    expiry: "2029-01-01",
  },
  {
    name: "Fresh Apples",
    price: 180,
    description: "Crisp and juicy apples.",
    categoryName: "Fruits",
    image:
      "https://th.bing.com/th/id/OIP.5Lz8vOw9kZMcx4Qm7M-YBwHaEK?w=318&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    stock: 70,
    expiry: "2026-10-10",
  },
  {
    name: "Tomatoes",
    price: 60,
    description: "Fresh red tomatoes.",
    categoryName: "Vegetables",
    image:
      "https://images.lifestyleasia.com/wp-content/uploads/sites/2/2021/08/13205152/yves-deploige-03k0dF5ouRw-unsplash-min-800x530.jpg",
    stock: 90,
    expiry: "2026-09-15",
  },
  {
    name: "Dove Soap",
    price: 45,
    description: "Gentle moisturizing soap.",
    categoryName: "Personal Care",
    image:
      "https://th.bing.com/th/id/OIP.mjTszxO1MpGkOFA4BHffhQHaHa?w=192&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    stock: 60,
    expiry: "2027-06-01",
  },
  {
    name: "Calculator",
    price: 650,
    description: "Scientific calculator.Calculate money easily.",
    categoryName: "Stationary & Staples",
    image:
      "https://th.bing.com/th/id/OIP.CiaYgfctXVrAW4CNtlbqkAHaHa?w=180&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    stock: 2,
    expiry: "2027-01-01",
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    const insertedCategories = await Category.create(categoriesSeed);
    const categoryIdByName = insertedCategories.reduce((acc, category) => {
      acc[category.name] = category._id;
      return acc;
    }, {});

    const normalizedProducts = productsSeed.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: categoryIdByName[product.categoryName],
      image: product.image,
      stock: product.stock,
      expiry: product.expiry,
    }));

    await Product.create(normalizedProducts);
    await User.create(usersSeed);

    console.log('Seed completed successfully.');
    console.log(`Categories seeded: ${categoriesSeed.length}`);
    console.log(`Products seeded: ${productsSeed.length}`);
    console.log(`Users seeded: ${usersSeed.length}`);
    console.log("Orders cleared: all previous sales data removed");
    console.log('Admin login: admin@example.com / admin123');
    console.log('Regular login: user@example.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

importData();
