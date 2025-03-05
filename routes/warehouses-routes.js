import express from "express";
import * as warehouseController from "../controllers/warehouses-controller.js"

const warehousesRouter = express.Router();

warehousesRouter.route("/")
.get(warehouseController.getAllWarehouses)
.post(warehouseController.addWarehouse);

//   .get(warehouseController.getWarehouse)
//   .put(warehouseController.editWarehouse)
//   .delete(warehouseController.deleteWarehouse);

warehousesRouter.route("/:id")
    // .get(warehouseController.getWarehouse)  
    .delete(warehouseController.deleteWarehouse);

export default warehousesRouter;
