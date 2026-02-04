const express = require("express");
const cors = require("cors");

const estoqueRoutes = require("./routes/estoqueRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 LOGIN / AUTH (CORRETO)
app.use("/api/auth", authRoutes);

// 🔒 ROTAS PROTEGIDAS
app.use("/api/estoque", estoqueRoutes);
app.use("/api/produtos", produtoRoutes);

// 👇 SEMPRE o último middleware
app.use(errorHandler);

module.exports = app;
