const Customer = require("../models/customer");
const { createObjectCsvStringifier } = require("csv-writer");

const fastcsv = require("fast-csv");

exports.downloadCustomersCSV = async (req, res) => {
  try {
    const filter = { createdBy: req.userId };
    const { startDate, endDate } = req.query;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=customers.csv");

    const cursor = Customer.find(filter).lean().cursor();
    const csvStream = require("fast-csv").format({ headers: true });
    csvStream.pipe(res);

    for await (const c of cursor) {
      csvStream.write({
        Name: c.name,
        Email: c.email,
        Phone: c.phone,
        Address:
          typeof c.address === "object"
            ? [c.address.street, c.address.city, c.address.state, c.address.postalCode, c.address.country]
                .filter(Boolean)
                .join(", ")
            : c.address || "",
        Notes: c.notes,
        Active: c.isActive ? "Yes" : "No",
      });
    }
    csvStream.end();
  } catch (error) {
    res.status(500).json({ message: "Failed to download CSV", error });
  }
};

// Get customers

// exports.downloadCustomersCSV = async (req, res) => {
//   try {
//     const filter = { createdBy: req.userId };
//     const { startDate, endDate } = req.query;

//     if (startDate || endDate) {
//       filter.createdAt = {};
//       if (startDate) filter.createdAt.$gte = new Date(startDate);
//       if (endDate) filter.createdAt.$lte = new Date(endDate);
//     }

//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader("Content-Disposition", "attachment; filename=customers.csv");

//     const cursor = Customer.find(filter).lean().cursor();
//     const csvStream = require("fast-csv").format({ headers: true });
//     csvStream.pipe(res);

//     for await (const c of cursor) {
//       csvStream.write({
//         Name: c.name || "",
//         Email: c.email || "",
//         Phone: c.phone || "",
//         Address:
//           typeof c.address === "object"
//             ? [
//                 c.address.street || "",
//                 c.address.city || "",
//                 c.address.state || "",
//                 c.address.postalCode || "",
//                 c.address.country || "",
//               ]
//                 .filter(Boolean)
//                 .join(", ")
//             : c.address || "",
//         Notes: c.notes || "",
//         Active: c.isActive ? "Yes" : "No",
//       });
//     }
//     csvStream.end();
//   } catch (error) {
//     res.status(500).json({ message: "Failed to download CSV", error });
//   }
// };

exports.getAllCustomerByPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { startDate, endDate } = req.query;

  try {
    const filter = { createdBy: req.userId };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const total = await Customer.countDocuments(filter);
    const customers = await Customer.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      customers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Save a new customer
exports.saveCustomer = async (req, res) => {
  const { name, email, phone, address, notes, isActive } = req.body;
  const newCustomer = new Customer({
    name,
    email,
    phone,
    address,
    notes,
    isActive,
    createdBy: req.userId,
  });

  try {
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
