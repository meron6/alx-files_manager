import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import userUtils from '../utils/user';

class AuthController {
  /**
   * Signs in the user by generating a new authentication token.
   *
   * Using the 'Authorization' header and Basic auth technique (Base64 of <email>:<password>),
   * locate the user associated with this email and password (note: the password is stored as SHA1).
   * If no user is found, return an 'Unauthorized' error with status code 401.
   * Otherwise:
   * - Generate a random string as a token using uuidv4.
   * - Create a key: auth_<token>.
   * - Store the user ID in Redis with the created key for 24 hours.
   * - Return the token: { "token": "155342df-2399-41da-9e8c-458b6ac52a0c" } with status code 200.
   */
  static async getConnect(request, response) {
    const Authorization = request.header('Authorization') || '';
    const credentials = Authorization.split(' ')[1];

    if (!credentials) {
      return response.status(401).send({ error: 'Unauthorized' });
    }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');

    if (!email || !password) {
      return response.status(401).send({ error: 'Unauthorized' });
    }

    const sha1Password = sha1(password);
    const user = await userUtils.getUser({ email, password: sha1Password });

    if (!user) {
      return response.status(401).send({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    const hoursForExpiration = 24;

    await redisClient.set(key, user._id.toString(), hoursForExpiration * 3600);

    return response.status(200).send({ token });
  }

  // The continuation of the sign-out method is missing.
}
