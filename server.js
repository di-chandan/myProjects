import express from "express";
// WT0W37ZUXhexCmeC

import UserRoutes from "./Routes/User.js";


const app = express();
app.use('/api/users', UserRoutes);
const PORT = 5000;

app.get("/", (req, res) => {
  res.json("Welcome to the MERN API");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
