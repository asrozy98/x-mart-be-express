import { GraphQLList } from "graphql";

import TransaksiModel from "../../../model/transaksi.js";
import redisClient from "../../redis/index.js";
import { transaksiType } from "../types/transaksi.js";

const DEFAULT_EXPIRATION = 3600;

const ListTransaksi = {
  type: new GraphQLList(transaksiType),
  async resolve(root, params) {
    const cacheValue = await redisClient.get("list-transaksi");
    if (cacheValue) {
      const dataJSON = JSON.parse(cacheValue);
      dataJSON.map((data) => {
        data.tanggal = new Date(data.tanggal);
      });
      return dataJSON;
    } else {
      const transaksi = await TransaksiModel.find().lean();
      if (!transaksi) {
        throw new Error("Gagal mendapatkan transaksi");
      }
      redisClient.setEx(
        "list-transaksi",
        DEFAULT_EXPIRATION,
        JSON.stringify(transaksi)
      );
      return transaksi;
    }
  },
};

export default ListTransaksi;
