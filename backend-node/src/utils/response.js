function success(res, data, message = "Operação realizada com sucesso") {
  return res.status(200).json({
    success: true,
    message,
    data
  });
}

function created(res, data, message = "Criado com sucesso") {
  return res.status(201).json({
    success: true,
    message,
    data
  });
}

function error(res, message, status = 400) {
  return res.status(status).json({
    success: false,
    message
  });
}

module.exports = {
  success,
  created,
  error
};
