import { StringValue } from 'ms'

interface ConfigProps {
    loginSessionKeepAlive: StringValue
}

import { registerAs } from '@nestjs/config';

export default registerAs('customVars', (): ConfigProps => {
  return {
    loginSessionKeepAlive: '20m',
  };
});