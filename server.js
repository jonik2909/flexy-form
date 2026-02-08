const express = require("express");
const multer = require("multer");
const app = express();
const port = 3333;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API Documentation at root
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/api_docs.html");
});

// Serve Test Dashboard at /test
app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/index.html");
}); app.get("/get", (req, res) => {
  const queryData = req.query;
  const formattedData = Object.entries(queryData)
    .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
    .join("");

  res.send(`
    <h1>GET So'rov Qabul Qilindi</h1>
    <ul>${formattedData || "<li>Ma'lumot yuborilmadi</li>"}</ul>
    <a href="javascript:history.back()">Orqaga qaytish</a>
  `);
});

// Mock User Data
const users = [
  { id: 1, username: "admin", password: "password123", role: "admin" },
  { id: 2, username: "user", password: "user123", role: "user" }
];

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.send(`
      <script>
        alert('Login Muvaffaqiyatli! Xush kelibsiz, ${user.username}');
        window.location.href = '/';
      </script>
    `);
  } else {
    res.send(`
      <script>
        alert('Login Xatolik! Username yoki parol noto\\'g\\'ri.');
        window.history.back();
      </script>
    `);
  }
});

app.post("/post", (req, res) => {
  const bodyData = req.body;
  const formattedData = Object.entries(bodyData)
    .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
    .join("");

  res.send(`
    <h1>POST So'rov Qabul Qilindi</h1>
    <ul>${formattedData || "<li>Ma'lumot yuborilmadi</li>"}</ul>
    <a href="javascript:history.back()">Orqaga qaytish</a>
  `);
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.send(`
      <h1>Rasm Yuklandi</h1>
      <p>Yuklangan rasm nomi: <strong>${req.file.originalname}</strong></p>
      <p>Link: <a href="${fileUrl}">${fileUrl}</a></p>
      <img src="${fileUrl}" alt="Uploaded Image" style="max-width: 500px;" />
      <br><br>
      <a href="javascript:history.back()">Orqaga qaytish</a>
    `);
  } else {
    res.status(400).send(`
      <h1>Xatolik</h1>
      <p>Iltimos, rasm faylini yuklang.</p>
      <a href="javascript:history.back()">Orqaga qaytish</a>
    `);
  }
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port} da ishga tushdi.`);
});
