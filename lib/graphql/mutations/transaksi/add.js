import axios from "axios";
import { GraphQLNonNull } from "graphql";

import redisClient from "../../../../lib/redis/index.js";
import TransaksiModel from "../../../../model/transaksi.js";
import { addTransaksiType, transaksiType } from "../../types/transaksi.js";

const storeTransactionToPostgres = async (transaction) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/transaksi",
      transaction
    );
    if (response.status === 200) {
      console.log("Data berhasil di simpan ke postgreSQL");
    }
  } catch (error) {
    console.log(
      "Terjadi kesalahan dalam menyimpan transaksi ke postgreSQL",
      error
    );
  }
};

const storeTransaction = {
  type: transaksiType,
  args: {
    data: {
      name: "data",
      type: new GraphQLNonNull(addTransaksiType),
    },
  },
  async resolve(root, params) {
    const transaksiModel = new TransaksiModel(params.data);
    const newTransaksi = await transaksiModel.save();

    if (!newTransaksi) {
      throw new Error("Terjadi kesalahan saat menyimpan transaksi");
    }

    console.log("data transaksi: ", newTransaksi);
    storeTransactionToPostgres(newTransaksi);
    redisClient.del("list-transaksi");
    return newTransaksi;
  },
};

export default storeTransaction;
