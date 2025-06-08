import express from "express";
import courseRoutes from "./routes/courseRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());


app.use("/courses", courseRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.listen(PORT, () => {
  console.log(`LMS server running at http://localhost:${PORT}`);
});
