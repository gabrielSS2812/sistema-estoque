const express = require("express");
const controller = require("../controllers/estoqueController");
const auth = require("../middlewares/auth");
const permissao = require("../middlewares/permissao");

const router = express.Router();

router.post("/entrada", auth, permissao(2), controller.entrada);
router.post("/saida", auth, permissao(2), controller.saida);
router.get("/alertas", auth, controller.alertas);

module.exports = router;
