
import { createClient } from 'redis';

const redisClient = createClient({
  url: "rediss://default:AdDoAAIjcDFkNzk4MTFhMjc2ZDc0ZDAxODFlMzRlNmNlYmI2MGVlNHAxMA@above-boa-53480.upstash.io:6379",
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

await redisClient.connect(); 

console.log('Connected to Redis');

export default redisClient;
