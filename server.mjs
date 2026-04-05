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

// 🔥 STATIC CORRETO
app.use("/images", express.static(path.join(__dirname, "public/images")));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔥 FUNÇÃO PRA GERAR URL COMPLETA
const getImageUrl = (req, imageName) => {
  return `${req.protocol}://${req.get("host")}/images/${imageName}`;
};

// 🔥 BANCO MOCK CORRIGIDO
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
      sizes: ["Small", "Medium", "Large", "X-Large"]
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
      sizes: ["Small", "Medium", "Large", "X-Large"]
    }
  ],
  testimonials: []
};

// ================= AUTH =================

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

    if (existingUser.rows.length) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered", user: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = userResult.rows[0];

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= MIDDLEWARE =================

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ================= PROFILE =================

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT id, name, email FROM users WHERE id=$1",
      [req.user.id]
    );

    res.json(userResult.rows[0]);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= CART =================

app.post("/cart", authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, productId, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/cart", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cart WHERE user_id=$1",
      [req.user.id]
    );

    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= PRODUCTS =================

// 🔥 LISTAR PRODUTOS
app.get("/products", (req, res) => {
  const products = db.products.map((product) => ({
    ...product,
    image: getImageUrl(req, product.image),
    starsReviewImage: getImageUrl(req, product.starsReviewImage)
  }));

  res.json(products);
});

// 🔥 PRODUTO POR ID
app.get("/products/:id", (req, res) => {
  const { id } = req.params;

  const product = db.products.find((p) => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const formattedProduct = {
    ...product,
    image: getImageUrl(req, product.image),
    starsReviewImage: getImageUrl(req, product.starsReviewImage)
  };

  res.json(formattedProduct);
});

// 🔥 CRIAR PRODUTO
app.post("/products", (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  db.products.push(newProduct);
  res.status(201).json(newProduct);
});

// 🔥 ATUALIZAR PRODUTO
app.put("/products/:id", (req, res) => {
  const { id } = req.params;

  const index = db.products.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  db.products[index] = { ...db.products[index], ...req.body };

  res.json(db.products[index]);
});

// 🔥 DELETAR PRODUTO
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  const index = db.products.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  db.products.splice(index, 1);

  res.status(204).send();
});

// ================= START =================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});