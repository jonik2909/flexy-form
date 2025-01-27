const express = require("express");
const multer = require("multer");
const app = express();
const port = 3000;

// Multer konfiguratsiyasi
const upload = multer({ dest: "uploads/" });

// Middleware - POST so'rovlar uchun JSON va URL-encoded ma'lumotlarni o'qish
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET orqali ma'lumotlarni olish
app.get("/get", (req, res) => {
  const queryData = req.query;
  const formattedData = Object.entries(queryData)
    .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
    .join("");

  res.send(`
    <h1>GET So'rov Qabul Qilindi</h1>
    <ul>${formattedData || "<li>Ma'lumot yuborilmadi</li>"}</ul>
   
  `);
});

// POST orqali ma'lumotlarni olish
app.post("/post", (req, res) => {
  const bodyData = req.body;
  const formattedData = Object.entries(bodyData)
    .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
    .join("");

  res.send(`
    <h1>POST So'rov Qabul Qilindi</h1>
    <ul>${formattedData || "<li>Ma'lumot yuborilmadi</li>"}</ul>
    
  `);
});

// Rasm yuklash uchun marshrut
app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.send(`
      <h1>Rasm Yuklandi</h1>
      <p>Yuklangan rasm nomi: <strong>${req.file.originalname}</strong></p>
    
    `);
  } else {
    res.status(400).send(`
      <h1>Xatolik</h1>
      <p>Iltimos, rasm faylini yuklang.</p>
    
    `);
  }
});

// Serverni ishga tushirish
app.listen(port, () => {
  console.log(`Server http://localhost:${port} da ishga tushdi.`);
});
