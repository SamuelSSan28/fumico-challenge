import * as crypto from 'crypto';

export default function hashPassword(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}
