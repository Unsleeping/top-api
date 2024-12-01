import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

const getMongoString = (configServise: ConfigService) => {
  return `mongodb://${configServise.get('MONGO_LOGIN')}:${configServise.get('MONGO_PASSWORD')}@${configServise.get('MONGO_HOST')}:${configServise.get('MONGO_PORT')}/${configServise.get('MONGO_AUTH_DATABASE')}`;
};

const getMongoOptions = () => {
  return {};
};

export const getMongoConfig = async (
  configServise: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
  return {
    uri: getMongoString(configServise),
    ...getMongoOptions(),
  };
};
