import bcrypt from 'bcrypt'
import { ICryptoService } from '../types/crypt'

export default class CryptService implements ICryptoService {
  hashValue = async function (valueToHash: string): Promise<string> {
    return await bcrypt.hash(valueToHash, 10)
  }
}
