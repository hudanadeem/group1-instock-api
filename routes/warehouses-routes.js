import express from "express";
import * as warehouseController from "../controllers/warehouses-controller.js"

const warehousesRouter = express.Router();

warehousesRouter.route("/")
.get(warehouseController.getAllWarehouses)
.post(warehouseController.addWarehouse);

//   .put(warehouseController.editWarehouse)

warehousesRouter.route("/:id")
    .get(warehouseController.getWarehouse)  
    .delete(warehouseController.deleteWarehouse)
    .put(warehouseController.updateWarehouse);

export default warehousesRouter;
