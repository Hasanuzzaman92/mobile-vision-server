const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eli8ngd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCategoriesCollection = client.db("mobileVision").collection("productCategories");
    const bookingsCollection = client.db("mobileVision").collection("bookings");

    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await productCategoriesCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/bookings', async (req, res) =>{
      const query = {}
      const result = await bookingsCollection.find(query).toArray();
      res.send(result)
    })

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const query = {
       booking
      };

      const alreadyBooked = await bookingsCollection.find(query).toArray();

      if (alreadyBooked.length) {
        const message = `You already have a booking`;
        return res.send({ acknowledged: false, message });
      }

      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("mobile vision server is running.");
});

app.listen(port, () => {
  console.log(`mobile vision server running on: ${port}`);
});
