const { MongoClient } = require('mongodb');

// Connection URL
const url = '';
const client = new MongoClient(url);

// Database Name
const dbName = 'mydatabase';

async function main() {
  try {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);
    const collection = db.collection('mycollection');

    // Create documents to insert
    const docs = [
      { name: 'Alice Johnson', rank: 1, points: 820, dailyAverage: 8, avgThisMonth: 12 },
      { name: 'Robert Smith', rank: 2, points: 750 },
      { name: 'Emma Davis', rank: 3, points: 700 },
      { name: 'Michael Brown', rank: 4, points: 660 },
      { name: 'Olivia Wilson', rank: 5, points: 620 },
      { name: 'James Miller', rank: 6, points: 580 },
      { name: 'Isabella Taylor', rank: 7, points: 540 },
      { name: 'David Anderson', rank: 8, points: 510 },
      { name: 'Sophia Thomas', rank: 9, points: 480 },
      { name: 'Daniel Jackson', rank: 10, points: 450 },
      { name: 'Mia White', rank: 11, points: 420 },
      { name: 'Matthew Harris', rank: 12, points: 390 },
      { name: 'Ava Martin', rank: 13, points: 360 },
      { name: 'Andrew Lee', rank: 14, points: 330 },
      { name: 'Charlotte Perez', rank: 15, points: 300 },
      { name: 'Joseph Clark', rank: 16, points: 270 },
      { name: 'Amelia Lewis', rank: 17, points: 240 },
      { name: 'William Robinson', rank: 18, points: 210 },
      { name: 'Evelyn Walker', rank: 19, points: 180 },
      { name: 'Christopher Hall', rank: 20, points: 150 },
    ];

    const result = await collection.insertMany(docs);

    console.log(`${result.insertedCount} documents were inserted with the following ids:`);
    console.log(result.insertedIds);

    // Close the connection
    await client.close();
  } catch (error) {
    console.error(error);
  }
}

main().catch(console.error);
