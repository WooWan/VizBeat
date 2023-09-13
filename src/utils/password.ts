import crypto from 'crypto';

export const generateUserId = (ip: string = process.env.IP_ADDRESS_DEFAULT!) => {
  const salt = process.env.IP_ADDRESS_SALT;
  return crypto
    .createHash('md5')
    .update(ip + salt, 'utf-8')
    .digest('hex');
};
