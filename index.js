import "dotenv/config";
import express from "express";
import cors from "cors"; 
import inventoryRoutes from "./routes/inventories-routes.js";
import warehousesRoutes from "./routes/warehouses-routes.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("InStock API is Running");
});

app.use("/warehouses", warehousesRoutes);
app.use("/inventory", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
