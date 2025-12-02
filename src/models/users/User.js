import { DataTypes } from 'sequelize';
import connectDB from "@/lib/db";

const User = connectDB.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(13),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    role_id: {
      type: DataTypes.BIGINT,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
    image: {
      type: DataTypes.STRING
    },
  },
  {
    sequelize: connectDB,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,  // Menambahkan createdAt & updatedAt
    underscored: true
    // paranoid: true,   // Mengaktifkan soft delete dengan deletedAt
  }
);

export default User;
