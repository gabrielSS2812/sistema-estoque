const express = require("express");
const controller = require("../controllers/produtoController");
const auth = require("../middlewares/auth");
const permissao = require("../middlewares/permissao");

const router = express.Router();

router.get("/", auth, controller.listar);
router.get("/:id", auth, controller.buscar);

router.post("/", auth, permissao(3), controller.criar);
router.put("/:id", auth, permissao(2), controller.atualizar);
router.delete("/:id", auth, permissao(3), controller.remover);

module.exports = router;
