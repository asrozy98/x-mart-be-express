import { GraphQLObjectType, GraphQLSchema } from "graphql";

import mutations from "./mutations/index.js";
import queries from "./queries/index.js";

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: queries,
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: mutations,
  }),
});
