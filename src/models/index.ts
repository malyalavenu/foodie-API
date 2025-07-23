import sequelize from '../config/database';
import { initUserModel } from './User';

export const User = initUserModel(sequelize);

export default {
  User,
  sequelize,
};
