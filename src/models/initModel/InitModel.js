import Detail_Transaction from "../detail_transaction/Detail_Transaction";
import Transaction from "../transaction/Transaction";
import User from "../users/User";

export const initModels = () => {
  Transaction.belongsTo(User, { foreignKey: "user_id" });

  Transaction.hasOne(Detail_Transaction, {
    foreignKey: "transaction_id",
    sourceKey: "id",
  });

  Detail_Transaction.belongsTo(Transaction, {
    foreignKey: "transaction_id",
    targetKey: "id",
  });
};
