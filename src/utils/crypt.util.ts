import bcrypt from 'bcrypt'
import { ICryptUtil } from '../types/crypt'

export default class CryptUtil implements ICryptUtil {
  hashValue = async function (valueToHash: string): Promise<string> {
    return await bcrypt.hash(valueToHash, 10)
  }
}
