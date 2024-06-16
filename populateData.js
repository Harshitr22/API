const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb+srv://w1915214:KpvTsFjHjYaTWVvv@cluster0.emuom40.mongodb.net/';
const client = new MongoClient(url);
const dbName = 'mydatabase';

async function populateData() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB server');

    const db = client.db(dbName);
    
    const tasksCollection = db.collection('tasks');
    const choicesCollection = db.collection('choices');

    const tasks = [
      { text: 'Walk to work' },
      { text: 'Bring reusable cup for coffee' },
      { text: 'Use public transportation' },
      { text: 'Use reusable bags' },
      { text: 'Choose locally sourced products' },
      { text: 'Avoid single-use plastics' },
      { text: 'Shower less than 5 minutes' },
      { text: 'Use eco-friendly shower products' },
      { text: 'Turn off water when not needed' },
      { text: 'Use natural light instead of artificial' },
      { text: 'Minimize paper usage' },
      { text: 'Unplug unused electronics' }
    ];

    const result = await tasksCollection.insertMany(tasks);
    const taskIds = Object.values(result.insertedIds); // Extract the task IDs

    const choices = [
      { text: 'Going to work', tasks: [taskIds[0], taskIds[1], taskIds[2]] },
      { text: 'Going for shopping', tasks: [taskIds[3], taskIds[4], taskIds[5]] },
      { text: 'Will take shower', tasks: [taskIds[6], taskIds[7], taskIds[8]] },
      { text: 'Working from home', tasks: [taskIds[9], taskIds[10], taskIds[11]] }
    ];

    await choicesCollection.insertMany(choices);

    console.log('Choices and tasks have been populated');
  } catch (err) {
    console.error('Error populating data:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

populateData().catch(console.error);
