const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b7dcs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  await client.connect();
  const taskCollection = client.db('todoData').collection('todoList');

  try {
    /**
     * get all tasks
     * link: http://localhost:5000/tasks
     */
    app.get('/tasks', async (req, res) => {
      const query = { email: req.query.email };
      const data = await taskCollection.find(query).toArray();
      // console.log(query);
      res.send(data);
    });
    /**
     * post a single task
     * link: http://localhost:5000/task
     */
    app.post('/task', async (req, res) => {
      const data = req.body;
      const doc = data;

      const result = await taskCollection.insertOne(doc);
      res.send(result);
    });
    /**
     * deleting single data
     * link-local: http://localhost:5000/task/${id}
     * link-online:
     */
    app.delete('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
    /**
     * update task
     * link-local: http://localhost:5000/task/${id}
     */
    app.put('/task/:id', async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const newData = {
        $set: updatedData,
      };

      const result = await taskCollection.updateOne(filter, newData, options);

      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('TO DO SERVER RUNNING');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
