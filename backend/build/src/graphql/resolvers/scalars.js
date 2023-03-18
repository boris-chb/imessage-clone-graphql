"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var dateScalar = new graphql_1.GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize: function (value) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
    },
    parseValue: function (value) {
        return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral: function (ast) {
        if (ast.kind === graphql_1.Kind.INT) {
            return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
        }
        return null; // Invalid hard-coded value (not an integer)
    },
});
var resolvers = {
    Date: dateScalar,
};
exports.default = resolvers;
