import redisClient from './redis';
import dbClient from './db';

/**
 * User utilities module
 */
const userUtils = {
  /**
   * Retrieves a user ID and Redis key from the request
   * @param {object} request - The Express request object
   * @returns {object} An object containing the userId and
   * the Redis key for the token
   */
  async getUserIdAndKey(request) {
    const obj = { userId: null, key: null };

    const xToken = request.header('X-Token');

    if (!xToken) return obj;

    obj.key = `auth_${xToken}`;

    obj.userId = await redisClient.get(obj.key);

    return obj;
  },

  /**
   * Fetches a user from the database
   * @param {object} query - The query to find the user
   * @returns {object} The user document object
   */
  async getUser(query) {
    const user = await dbClient.usersCollection.findOne(query);
    return user;
  },
};

export default userUtils;
