import connectDB from "@/lib/db";
import { DataTypes, UUIDV4 } from "sequelize";
import User from "../users/User";

const GenieacsCredential = connectDB.define(
  "GenieacsCredential",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => UUIDV4(),
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    host: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    port: {
      type: DataTypes.INTEGER,
      defaultValue: 7557,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_connected: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    last_test: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "genieacs_credentials",
    timestamps: false, 
  }
);

GenieacsCredential.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

export default GenieacsCredential;
