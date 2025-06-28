// import { createClient } from 'redis';

// const redisClient = createClient({
//   url: process.env.REDIS_URL || rediss://default:********@above-boa-53480.upstash.io:6379
// });

// redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

// await redisClient.connect();

// console.log('✅ Connected to Upstash Redis');
// export default redisClient;
// Make sure this is in a file with ".js" extension and "type": "module" in package.json

import { createClient } from 'redis';

const redisClient = createClient({
  url: "rediss://default:AdDoAAIjcDFkNzk4MTFhMjc2ZDc0ZDAxODFlMzRlNmNlYmI2MGVlNHAxMA@above-boa-53480.upstash.io:6379",
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

await redisClient.connect(); // ✅ valid if top-level await is supported

console.log('✅ Connected to Redis');

export default redisClient;
