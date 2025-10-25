import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    type            : process.env.DB_TYPE,
    host            : process.env.DB_HOST,
    port            : process.env.DB_PORT,
    username        : process.env.DB_USERNAME,
    password        : process.env.DB_PASSWORD,
    database        : process.env.DB_NAME,
    autoloadEntities: true,
    synchronize     : true,
  };
});
export const MODE = registerAs('MODE', () => {
  return {
    mode: process.env.MODE,
  };
});
/**
LISTEN_PORT=3050
DB_TYPE=mysql
DB_HOST=localhost
DB_NAME=corp
DB_USERNAME=root
DB_PASSWORD=Qwe12345678qwE-===
}
 */
