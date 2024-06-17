const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// Setup CORS middleware
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection URL
const url = '';
const client = new MongoClient(url);
const dbName = 'mydatabase';

// Load OpenAPI specification
let openApiSpec;
try {
  openApiSpec = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));
  console.log('OpenAPI specification loaded successfully.');
} catch (err) {
  console.error('Error loading OpenAPI spec:', err);
  process.exit(1);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Connect to MongoDB once on startup
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB server');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

connectToMongoDB();

// Middleware to extract userId from headers
app.use((req, res, next) => {
  req.userId = req.headers['x-user-id'];
  next();
});

// Route to get tasks for a choice
app.get('/tasks', async (req, res) => {
  const { choiceId } = req.params;
  
  if (!ObjectId.isValid(choiceId)) {
  return res.status(400).send('Invalid choiceId format');
  }
  
  try {
  const db = client.db(dbName);
  const choicesCollection = db.collection('choices');
  const tasksCollection = db.collection('tasks');

  const choice = await choicesCollection.findOne({ _id: new ObjectId(choiceId) });
  if (!choice) {
    return res.status(404).send('Choice not found');
  }
  
  const tasks = await tasksCollection.find({ _id: { $in: choice.tasks } }).toArray();
  res.json(tasks);
  } catch (err) {
  console.error('Error fetching tasks from MongoDB:', err);
  res.status(500).send(err.message);
  }
  });

// Route to get all questions
app.get('/questions', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('questions');
    const questions = await collection.find({}).toArray();
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions from MongoDB:', err);
    res.status(500).send(err.message);
  }
});

// Route to save user response
app.post('/responses', async (req, res) => {
  const { userId, questionId, response } = req.body;
  if (!userId || !questionId || !response) {
    return res.status(400).send('Missing userId, questionId, or response');
  }

  try {
    const db = client.db(dbName);
    const responsesCollection = db.collection('responses');
    
    // Log the input
    console.log(`Received response: ${JSON.stringify(req.body)}`);
    
    const userResponse = {
      userId: new ObjectId(userId),
      questionId: new ObjectId(questionId),
      response,
      timestamp: new Date()
    };

    // Store the response
    const result = await responsesCollection.insertOne(userResponse);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error saving response to MongoDB:', err);
    res.status(500).send(err.message);
  }
});

// Route to get choices
app.get('/choices', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('choices');
    const choices = await collection.find({}).toArray();
    res.json(choices);
  } catch (err) {
    console.error('Error fetching choices from MongoDB:', err);
    res.status(500).send(err.message);
  }
});

// Route to save user choices
app.post('/userChoices', async (req, res) => {
  const { userId, choices } = req.body;
  if (!userId || !choices || !Array.isArray(choices)) {
    return res.status(400).send('Missing or invalid userId or choices');
  }

  try {
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    // Log the input
    console.log(`Received user choices: ${JSON.stringify(req.body)}`);

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).send('User not found');
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { selectedChoices: choices.map(choice => new ObjectId(choice)) } }
    );

    res.status(200).send('User choices saved successfully');
  } catch (err) {
    console.error('Error saving user choices to MongoDB:', err);
    res.status(500).send(err.message);
  }
});

// Route to get tasks for a choice
app.get('/tasks/:choiceId', async (req, res) => {
  const { choiceId } = req.params;

  if (!ObjectId.isValid(choiceId)) {
    return res.status(400).send('Invalid choiceId format');
  }

  try {
    const db = client.db(dbName);
    const choicesCollection = db.collection('choices');
    const tasksCollection = db.collection('tasks');

    const choice = await choicesCollection.findOne({ _id: new ObjectId(choiceId) });
    if (!choice) {
      return res.status(404).send('Choice not found');
    }

    const tasks = await tasksCollection.find({ _id: { $in: choice.tasks } }).toArray();
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks from MongoDB:', err);
    res.status(500).send(err.message);
  }
});

// Existing route to get data
app.get('/data', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('mycollection');
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error('Error fetching data from MongoDB:', err);
    res.status(500).send(err.message);
  }
});

app.get('/data/:name', async (req, res) => {
  const userName = req.params.name;
  
  try {
    const db = client.db(dbName);
    const collection = db.collection('mycollection');
    const users = await collection.find({ name: userName }).toArray();
    
    if (!users.length) {
      return res.status(404).send('User not found');
    }
    
    res.json(users);
  } catch (err) {
    console.error('Error fetching user data from MongoDB:', err);
    res.status(500).send(err.message);
  }
});
  

app.listen(port, (err) => {
  if (err) {
    return console.error('Error starting server:', err);
  }
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`API docs available at http://localhost:${port}/api-docs`);
});
