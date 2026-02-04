module.exports = nivelMinimo => {
  return (req, res, next) => {
    if (req.usuario.nivel < nivelMinimo) {
      return res
        .status(403)
        .json({ message: "Sem permissão" });
    }
    next();
  };
};
