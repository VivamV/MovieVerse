import redisClient from "../config/redisClient.js";

export const getRedisData=async(req,res)=>{
    try {
    const keys = await redisClient.keys('*'); 

    const pipeline = redisClient.multi();
    keys.forEach(key => pipeline.get(key)); 

    const values = await pipeline.exec(); 

    const result = keys.reduce((acc, key, index) => {
      acc[key] = values[index];
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (err) {
    console.error('Redis fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch Redis keys and values.' });
  }
}

export const clearRedisData=async(req,res)=>{
  try {
    await redisClient.flushAll(); 
    res.status(200).json({ message: 'Redis cleared successfully.' });
  } catch (err) {
    console.error('Redis clear error:', err);
    res.status(500).json({ message: 'Failed to clear Redis.' });
  }
}