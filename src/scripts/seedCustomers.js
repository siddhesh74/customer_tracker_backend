const mongoose = require("mongoose");
const Customer = require("../models/customer");
require("dotenv").config();

const MONGODB_URI =
  "mongodb+srv://moresiddhesh74:YFMMJzKUoSloVKMt@cluster0.0fcsnwu.mongodb.net/?retryWrites=true&w=majority";
const USER_ID = "68641cb6c7ece277e97c6188";

async function seedCustomers() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const customers = [];
  for (let i = 1; i <= 200000; i++) {
    customers.push({
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
      phone: `99999${i.toString().padStart(5, "0")}`,
      address: {
        street: `Street ${i}`,
        city: "City",
        state: "State",
        postalCode: "12345",
        country: "Country",
      },
      notes: `Note for customer ${i}`,
      isActive: true,
      createdBy: USER_ID,
    });
    // Insert in batches of 1000 for performance
    if (customers.length === 1000) {
      await Customer.insertMany(customers);
      customers.length = 0;
      console.log(`Inserted ${i} customers`);
    }
  }
  // Insert any remaining customers
  if (customers.length > 0) {
    await Customer.insertMany(customers);
    console.log(`Inserted last batch`);
  }

  console.log("Seeding complete!");
  mongoose.disconnect();
}

seedCustomers().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
