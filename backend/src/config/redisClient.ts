import { createClient } from 'redis';

const redisClient = createClient({
  // Add your Redis connection details here
  // For local development, you might not need any options.
  // For production, you would use a URL like:
  // url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

export default redisClient;