import express from "express";
import * as warehouseController from "../controllers/warehouses-controller.js"

const warehousesRouter = express.Router();

warehousesRouter.route("/")
.get(warehouseController.getAllWarehouses);

//   .put(warehouseController.editWarehouse)

warehousesRouter.route("/:id")
    .get(warehouseController.getWarehouse)  
    .delete(warehouseController.deleteWarehouse);

export default warehousesRouter;