import hashPassword from './hashPassword';

export default function validatePassword(password: string,hash:string) {
  return hashPassword(password) === hash;
}
