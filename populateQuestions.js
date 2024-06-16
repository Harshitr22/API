const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://w1915214:KpvTsFjHjYaTWVvv@cluster0.emuom40.mongodb.net/';
const client = new MongoClient(url);
const dbName = 'mydatabase';

const questionsList = [
  "Are you going to walk today instead of using the bus?",
  "Will your shower last less than 10 minutes today?",
  "Are you using a reusable cup for your drinks today?",
  "Will you turn off lights when leaving a room?",
  "Are you recycling your waste today?",
  "Will you use a reusable bag for shopping today?",
  "Are you opting for vegetarian meals today?",
  "Will you use public transportation instead of driving?",
  "Are you reducing water usage today?",
  "Will you unplug electronics when not in use?",
];

async function populateQuestions() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB server');

    const db = client.db(dbName);
    const collection = db.collection('questions');

    await collection.deleteMany({});
    await collection.insertMany(
      questionsList.map((question) => ({
        text: question,
        choices: [
          { option: 'yes', text: 'Yes' },
          { option: 'no', text: 'No' }
        ]
      }))
    );

    console.log('Questions have been populated');
  } catch (err) {
    console.error('Error populating questions:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

populateQuestions().catch(console.error);
