import sequelize from '../config/database';
import { initUserModel } from './User';
import { initRestaurantModel } from './Restaurant';

export const User = initUserModel(sequelize);
export const Restaurant = initRestaurantModel(sequelize);

export default {
  User,
  Restaurant,
  sequelize,
};
