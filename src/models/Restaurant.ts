import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

export interface RestaurantAttributes {
  id: string;
  name: string;
  address: string;
  rating: number;
  cuisine: string;
  menuId: string;
  hours: string;
}

export interface RestaurantCreationAttributes
  extends Optional<RestaurantAttributes, 'id'> {}

export class Restaurant
  extends Model<RestaurantAttributes, RestaurantCreationAttributes>
  implements RestaurantAttributes
{
  public id!: string;
  public name!: string;
  public address!: string;
  public rating!: number;
  public cuisine!: string;
  public menuId!: string;
  public hours!: string;
}

export function initRestaurantModel(sequelize: Sequelize) {
  Restaurant.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      cuisine: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      menuId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hours: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'restaurants',
      modelName: 'Restaurant',
      timestamps: true,
    }
  );
  return Restaurant;
}
