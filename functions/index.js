const { onRequest } = require("firebase-functions/v2/https");

exports.test = onRequest((req, res) => {
  res.json({
    message: "functions 연결 성공",
  });
});