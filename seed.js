import mongoose from "mongoose";
import User from "./backend/models/user.model.js";
import Product from "./backend/models/product.model.js";
import Transaction from "./backend/models/transaction.model.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

async function seed() {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({});
  await Product.deleteMany({});
  await Transaction.deleteMany({});

  // Create test buyer
  const buyer = await User.create({
    name: "Test Buyer",
    email: "buyer@test.com",
    password: "password123",
    role: "buyer",
    walletBalance: 5000,
    isVerified: true,
  });

  // Create test seller
  const seller = await User.create({
    name: "Test Seller",
    email: "seller@test.com",
    password: "password123",
    role: "seller",
    walletBalance: 2000,
    escrowBalance: 0,
    isVerified: true,
    virtualAccountNumber: "SELLER123456",
  });

  // Create test product
  const product = await Product.create({
    name: "Test Product",
    description: "A sample product for escrow testing.",
    price: 1000,
    image: "https://via.placeholder.com/150",
    category: "Test Category",
    status: "active",
    sellerId: seller._id,
  });

  // Create test transactions
  const tx1 = await Transaction.create({
    buyerId: buyer._id,
    sellerId: seller._id,
    productId: product._id,
    amount: 1000,
    status: "Holding",
  });
  const tx2 = await Transaction.create({
    buyerId: buyer._id,
    sellerId: seller._id,
    productId: product._id,
    amount: 1000,
    status: "Released",
  });

  console.log("Seeded test buyer, seller, product, and transactions.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
