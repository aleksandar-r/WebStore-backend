export interface ICryptUtil {
  hashValue(valueToHash: string): Promise<string>
}
