import redisClient from "../config/redisClient.js";
export const getRedisVidepProcessingData = async () => {
  const all = await redisClient.lRange('video-processing-queue', 0, -1);
  return all.map(item => JSON.parse(item));
};

export const deleteRedisJob = async (fileName) => {
  const all = await getRedisVidepProcessingData();
  const target = all.find(item => item.fileName === fileName);
  if (target) {
    await redisClient.lRem('video-processing-queue', 1, JSON.stringify(target));    
  }
};
