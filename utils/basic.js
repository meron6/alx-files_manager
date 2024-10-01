import { ObjectId } from 'mongodb';

/**
 * Utility module for basic operations
 */
const basicUtils = {
  /**
   * Validates if an ID is acceptable for MongoDB
   * @param {string|number} id - The ID to be checked
   * @returns {boolean} - Returns true if the ID is valid, otherwise false
   */
  isValidId(id) {
    try {
      new ObjectId(id);
      return true;
    } catch (err) {
      return false;
    }
  },
};

export default basicUtils;
