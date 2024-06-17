const { MongoClient, ObjectId } = require('mongodb');

const url = '';
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

    const cReduct = [
      { text: "By walking 1km, you can reduce 33gm CO2eq"},
      { text: "1 undisposable cup of coffee is equivalent to 1 metric cube of CO2 gas"},
      { text: "Using public transportation can reduce 1.5 metric cubes of CO2 gas"},
      { text: "Switch to reusable bags and cut down plastic waste, reducing your carbon footprint by up to 80%."},
      { text: "Choose locally sourced products and cut down transportation emissions by up to 5%, reducing your carbon footprint."},
      { text: "Avoid single-use plastics to decrease your carbon footprint and reduce waste by 50%."},
      { text: "Showering under 5 minutes reduce CO2 emissions by up to 20 lbs per month"},
      { text: "Using eco-friendly shower products reduces your carbon footprint by up to 25%."},
      { text: "Turning ooff water when not needed reduce CO2 emissions by up to 90 lbs per year."},
      { text: "Utilizing natural light cut your carbon footprint by up to 10%."},
      { text: "Minimizing paper use reduces CO2 emissions by 10 lbs per ream"},
      { text: "Unpluging unused electronics lowers your carbon footprint by 5-10%"},
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
