// const path = require('path');
// const dotenv = require('dotenv');
// const { PrismaClient } = require('@prisma/client');

// const envFilePath = process.env.NODE_ENV === 'test' 
//   ? path.resolve(process.cwd(), '.env.test') 
//   : path.resolve(process.cwd(), '.env');

// dotenv.config({ path: envFilePath });

// const getDatabaseUrl = () => {
//   return process.env.DATABASE_URL;
// };

// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: getDatabaseUrl(),
//     },
//   },
// });

// module.exports = prisma;



// const fs = require('fs');
// const path = require('path');
// const dotenv = require('dotenv');
// const { PrismaClient } = require('@prisma/client');

// // Load correct .env file based on NODE_ENV
// const envFile =
//   process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

// dotenv.config({
//   path: path.resolve(process.cwd(), envFile),
// });
// console.log("choose, ", process.env.DATABASE_URL);
// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL,
//     },
//   },
// });

// module.exports = prisma;




const path = require('path');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
// let dburl;
// const envFilePath = process.env.NODE_ENV === 'test' 
//   ? path.resolve(process.cwd(), '.env') 
//   : path.resolve(process.cwd(), '.env');

// dotenv.config({ path: envFilePath });

// // const getDatabaseUrl = () => {
// //   return process.env.DATABASE_URL;
// // };
// dburl=(process.env.NODE_ENV=='test')?process.env.TEST_DATABASE_URL:process.env.DATABASE_URL
// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: dburl,
//     },
//   },
// });

// module.exports = prisma;




const databaseUrl = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL // Comes from your main .env file
  : process.env.DATABASE_URL;     // Comes from your main .env file

// A safety check to prevent disaster
if (!databaseUrl) {
  throw new Error("Database URL was not found in environment variables. Check your .env files.");
}

// The key part of your solution: explicitly providing the URL.
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

module.exports = prisma;