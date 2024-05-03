import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

import GraphQLDate from "graphql-date";

const transaksiType = new GraphQLObjectType({
  name: "Transaksi",
  description: "Transaksi Type",
  fields: () => ({
    _id: { type: GraphQLID },
    qrCode: { type: GraphQLString },
    rfid: { type: GraphQLString },
    hargaSatuan: { type: GraphQLInt },
    jumlah: { type: GraphQLInt },
    tanggal: { type: GraphQLDate },
  }),
});

const addTransaksiType = new GraphQLInputObjectType({
  name: "TransaksiInput",
  description: "Add Transaksi Type",
  fields: () => ({
    qrCode: { type: GraphQLString },
    rfid: { type: GraphQLString },
    hargaSatuan: { type: GraphQLInt },
    jumlah: { type: GraphQLInt },
  }),
});

export { addTransaksiType, transaksiType };
