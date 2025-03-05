import express from "express";

import * as warehouseController from "../controllers/warehouses-controller.js"

const warehousesRouter = express.Router();

warehousesRouter.route("/")
.get(warehouseController.getAllWarehouses)


export default warehousesRouter;