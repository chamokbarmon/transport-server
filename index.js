const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xsvxy9i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// console.log(process.env.DB_USERNAME, process.env.DB_PASSWORD);

// const verifyJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: "unauthorized access" });
//   }
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//     if (err) {
//       return res.status(403).send({ message: "Forbidden access" });
//     }
//     req.decoded = decoded;

//     next();
//   });
// };

async function run() {
  try {
    const database = client.db("easy-transport");
    const database1 = client.db("easy-transport-two");

    const transportsCollection = database.collection("transports");
    // const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");
    const servicesCollection = database.collection("servicesProduct");  
    const bookingCollection = database.collection("riderBooking");  
  

    
    app.post("/signup", async (req, res) => {
      console.log("result");
      const query = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        checked: req.body.checked,
        userIdFirebase: req.body.userIdFirebase,
      };
      const result = await usersCollection.insertOne(query);
      console.log(result);
      res.send(result);
    });

    app.get('/services',async (req,res)=>{
      const query = {};
      const options = await servicesCollection.find(query).toArray();
      res.send(options);
    })

    app.get('/services/:id',async(req,res)=>{
      const id = req.params.id;
      const query= { _id:ObjectId(id)};
      const carService = await servicesCollection.findOne(query)
      res.send(carService);
    })

    app.post('/services', async(req,res)=>{
      const ridebooking = req.body;
      console.log(ridebooking);
      const result = await bookingCollection.insertOne(ridebooking)
      res.send(result)
    })

    app.get("/ridebooking/:email", async (req, res) => {
      const query = { email: req.params.email };
      const cursor = bookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // app.get('/ridebooking',async (req,res)=>{
    //   const email = req.query.email;
    //   console.log(email)
    //   const query = {email: email };
    //   const bookings = await bookingCollection.find(query).toArray();
    //   res.send(bookings)
    // })



    // app.post("/jwt", (req, res) => {
    //   const user = req.body;
    //   console.log(user);
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "1h",
    //   });
    //   res.send({ token });
    // });

    // read all transports
    // app.get("/transports", async (req, res) => {
    //   const query = {};
    //   const cursor = transportsCollection.find(query);
    //   const transports = await cursor.toArray();
    //   res.send(transports);
    // });

    // read single transports
    // app.get("/transports/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const transport = await transportsCollection.findOne(query);
    //   res.send(transport);
    // });

    // // load 3 services for home page
    // app.get("/services-limit", async (req, res) => {
    //   const query = {};
    //   const cursor = servicesCollection.find(query).limit(3);
    //   const services = await cursor.toArray();
    //   res.send(services);
    // });

    // // create service
    // app.post("/add-service", async (req, res) => {
    //   const service = req.body;
    //   const result = await servicesCollection.insertOne(service);
    //   res.json(result);
    // });

    // app.get("/services/:_id", async (req, res) => {
    //   const id = req.params._id;
    //   const query = { _id: ObjectId(id) };
    //   const service = await servicesCollection.findOne(query);
    //   res.send(service);
    // });

    // // create review
    // app.post("/add-review", async (req, res) => {
    //   const review = req.body;
    //   const result = await reviewsCollection.insertOne(review);
    //   res.json(result);
    // });

    // // read all reviews for this service
    // app.get("/reviews/:_id", async (req, res) => {
    //   const id = req.params._id;
    //   const query = { serviceId: id };
    //   const cursor = reviewsCollection.find(query).sort({ date: -1 });
    //   const reviews = await cursor.toArray();
    //   res.send(reviews);
    // });

    // read single review by id
    // app.get("/reviews/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const cursor = reviewsCollection.find(query)

    //   const review = await cursor.toArray();
    //   res.send(review);
    // });

    // read logged in user all reviews by email
    // app.get("/my-reviews", verifyJWT, async (req, res) => {
    //   // console.log(req.headers.authorization);
    //   const decoded = req.decoded;
    //   // console.log(decoded);
    //   let query = {};
    //   if (req.query.email) {
    //     query = { email: req.query.email };
    //   }
    //   if (decoded.email !== req.query.email) {
    //     res.status(401).send({ message: "unauthorized access" });
    //   }

    //   // finding the service name by serviceId

    //   const cursor = reviewsCollection.find(query);
    //   const review = await cursor.toArray();

    //   res.send(review);
    // });

    // app.get("/get-review/:id", async (req, res) => {
    //   let query = {};
    //   if (req.params.id) {
    //     query = { _id: req.params.id };
    //   }
    //   const cursor = reviewsCollection.find(query);
    //   const review = await cursor.toArray();
    //   res.send(review);
    // });

    // // update service
    // app.put("/get-review/:id", async (req, res) => {
    //   // const id = req.query.id;
    //   const id = req.params.id;

    //   const updatedService = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       review: updatedService.review,
    //     },
    //   };
    //   const result = await reviewsCollection.updateOne(
    //     filter,
    //     updateDoc,
    //     options
    //   );
    //   res.json(result);
    // });

    // app.get("/reviews", async (req, res) => {
    //   const query = {};
    //   const cursor = reviewsCollection.find(query);
    //   const reviews = await cursor.toArray();
    //   res.send(reviews);
    // });

    // app.delete("/reviews/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await reviewsCollection.deleteOne(query);
    //   res.json(result);
    // });

    // app.get("*", function (req, res) {
    //   res.status(404).send("route not found");
    // });

    // // read single service
    // app.get("/services/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const service = await servicesCollection.findOne(query);
    //   res.json(service);
    // });

    // // delete service
    // app.delete("/services/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await servicesCollection.deleteOne(query);
    //   res.json(result);
    // });
  } finally {
    // await client.close();
  }
}

run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("easy-transport-server is running");
});

app.listen(port, () => {
  console.log(`easy-transport-server listening on port ${port}`);
});
