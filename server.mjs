import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ✅ STATIC CORRETO
app.use("/images", express.static(path.join(__dirname, "public/images")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ FUNÇÃO DE URL
const getImageUrl = (req, imageName) => {
  return `${req.protocol}://${req.get("host")}/images/${imageName}`;
};

// ✅ BANCO MOCK CORRIGIDO
const db = {
  products: [
    {
      id: 1,
      image: "gradient-tshirt-desktop.png",
      title: "Gradient Graphic T-shirt",
      starsReviewImage: "Stars3-5.png",
      review: 3.5,
      price: 145,
      style: "casual",
      colors: ["#FF5733", "#33FF57", "#5733FF"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
    },
    {
      id: 2,
      image: "polo-marrom-desktop.png",
      title: "Polo with Tipping Details",
      starsReviewImage: "Stars4-5.png",
      review: 4.5,
      price: 180,
      style: "casual",
      colors: ["#6F4E37", "#FFFFFF"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
    },
    {
      id: 3,
      image: "polo-branco-preto-desktop.png",
      title: "Black Striped T-shirt",
      starsReviewImage: "Stars5.png",
      review: 5.0,
      price: 180,
      discount: "-30%",
      oldPrice: 150,
      style: "casual",
      colors: ["#000000", "#FFFFFF"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
    },
    {
      id: 4,
      image: "calca-jeans2.png",
      title: "SKINNY FIT JEANS",
      starsReviewImage: "Stars3-5.png",
      review: 3.5,
      price: 240,
      discount: "-20%",
      oldPrice: 260,
      style: "casual",
      colors: ["#1C1C1C", "#2F4F4F"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
    },
    {
      id: 5,
      image: "camisa-xadrez.png",
      title: "CHECKERED SHIRT",
      starsReviewImage: "Stars4-5.png",
      review: 4.5,
      price: 180,
      style: "casual",
      colors: ["#8B0000", "#FFFFFF"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
    },
    {
      id: 6,
      image: "camisa-laranja-preta.png",
      title: "SLEEVE STRIPED T-SHIRT",
      starsReviewImage: "Stars4-5.png",
      review: 4.5,
      price: 130,
      discount: "-30%",
      oldPrice: 160,
      style: "casual",
      colors: ["#FFA500", "#000000"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
    },
    {
      id: 7,
      image: "camisa-verde.png",
      title: "VERTICAL STRIPED SHIRT",
      starsReviewImage: "Stars5.png",
      review: 5.0,
      price: 212,
      discount: "-20%",
      oldPrice: 232,
      style: "casual",
      colors: ["#32CD32", "#FFFFFF"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
    },
    {
      id: 8,
      image: "camisa-laranja2.png",
      title: "COURAGE GRAPHIC T-SHIRT",
      starsReviewImage: "Stars4.png",
      review: 4.0,
      price: 145,
      style: "casual",
      colors: ["#FFA500", "#FFFFFF"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
    },
    {
      id: 9,
      image: "short-jeans.png",
      title: "LOOSE FIT BERMUDA SHORTS",
      starsReviewImage: "Stars3-5.png",
      review: 3.0,
      price: 80,
      style: "casual",
      colors: ["#4682B4"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
    },
    {
      id: 10,
      image: "polo-azul-clara-desktop.png",
      title: "Polo with Contrast Trims",
      starsReviewImage: "Stars4.png",
      review: 4.0,
      price: 212,
      discount: "-20%",
      oldPrice: 242,
      style: "casual",
      colors: ["#ADD8E6", "#FFFFFF"],
      sizes: ["Small", "Medium", "Large", "X-Large"],
    },
  ],
};

// ================= PRODUCTS =================

app.get("/products", (req, res) => {
  const products = db.products.map((product) => ({
    ...product,
    image: getImageUrl(req, product.image),
    starsReviewImage: getImageUrl(req, product.starsReviewImage),
  }));

  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;

  const product = db.products.find((p) => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const formattedProduct = {
    ...product,
    image: getImageUrl(req, product.image),
    starsReviewImage: getImageUrl(req, product.starsReviewImage),
  };

  res.json(formattedProduct);
});

// ================= START =================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});