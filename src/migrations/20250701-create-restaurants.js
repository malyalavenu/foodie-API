module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('restaurants', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('restaurants');
  },
};
