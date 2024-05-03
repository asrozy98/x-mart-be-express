import { GraphQLID, GraphQLNonNull } from "graphql";

import redisClient from "../../../lib/redis/index.js";
import TransaksiModel from "../../../model/transaksi.js";
import { transaksiType } from "../types/transaksi.js";

const DEFAULT_EXPIRATION = 3600;

const Transaksi = {
  type: transaksiType,
  args: {
    id: {
      name: "id",
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(root, params) {
    const cacheValue = await redisClient.get("transaksi-" + params.id);
    if (cacheValue) {
      const dataJSON = JSON.parse(cacheValue);
      dataJSON.tanggal = new Date(dataJSON.tanggal);
      return dataJSON;
    } else {
      const transaksi = await TransaksiModel.findById(params.id).lean();
      if (!transaksi) {
        throw new Error("Gagal mendapatkan transaksi dengan id: " + params.id);
      }
      redisClient.setEx(
        `transaksi-${params.id}`,
        DEFAULT_EXPIRATION,
        JSON.stringify(transaksi)
      );
      return transaksi;
    }
  },
};

export default Transaksi;
