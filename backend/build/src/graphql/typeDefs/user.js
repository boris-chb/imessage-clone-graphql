"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tag_1 = require("graphql-tag");
var typeDefs = (0, graphql_tag_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type User {\n    id: String\n    name: String\n    username: String\n    email: String\n    emailVerified: Boolean\n    image: String\n  }\n\n  type SearchedUser {\n    id: String\n    username: String\n  }\n\n  type Query {\n    searchUsers(username: String): [SearchedUser]\n  }\n\n  type Mutation {\n    createUsername(username: String): TransactionResult\n  }\n\n  type TransactionResult {\n    success: Boolean\n    error: String\n  }\n"], ["\n  type User {\n    id: String\n    name: String\n    username: String\n    email: String\n    emailVerified: Boolean\n    image: String\n  }\n\n  type SearchedUser {\n    id: String\n    username: String\n  }\n\n  type Query {\n    searchUsers(username: String): [SearchedUser]\n  }\n\n  type Mutation {\n    createUsername(username: String): TransactionResult\n  }\n\n  type TransactionResult {\n    success: Boolean\n    error: String\n  }\n"])));
exports.default = typeDefs;
var templateObject_1;
