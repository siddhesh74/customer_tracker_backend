const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/customer", authMiddleware, customerController.getAllCustomerByPagination);
router.get("/customer/download", authMiddleware, customerController.downloadCustomersCSV);
router.post("/customer", authMiddleware, customerController.saveCustomer);

module.exports = router;
