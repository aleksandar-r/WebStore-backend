export interface ICryptoService {
  hashValue(valueToHash: string): Promise<string>
}
