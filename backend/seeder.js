import mongoose from 'mongoose';
import dotenv from 'dotenv';
//users data
import users from './data/users.js';
//products data
import products from './data/products.js';
//model to interact with collection db
import User from './models/userModel.js';
import Product from './models/productModel.js';
//we import order here, so if we delete user and product, we also delete the order
import Order from './models/orderModel.js';
import connectDB from './config/db.js';
import colors from 'colors';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    //pick admin user to be used in the Product
    const adminUser = createdUsers[0]._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });
    await Product.insertMany(sampleProducts);
    console.log(`data imported!`.green.inverse);
    //do i really need this?
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
