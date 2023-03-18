"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tag_1 = require("graphql-tag");
var typeDefs = (0, graphql_tag_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Message {\n    id: String\n    sender: User\n    body: String\n    createdAt: Date\n  }\n\n  type Query {\n    messages(conversationId: String): [Message]\n  }\n\n  type Mutation {\n    sendMessage(\n      id: String\n      conversationId: String\n      senderId: String\n      body: String\n    ): Boolean\n  }\n\n  type Subscription {\n    messageSent(conversationId: String): Message\n  }\n"], ["\n  type Message {\n    id: String\n    sender: User\n    body: String\n    createdAt: Date\n  }\n\n  type Query {\n    messages(conversationId: String): [Message]\n  }\n\n  type Mutation {\n    sendMessage(\n      id: String\n      conversationId: String\n      senderId: String\n      body: String\n    ): Boolean\n  }\n\n  type Subscription {\n    messageSent(conversationId: String): Message\n  }\n"])));
exports.default = typeDefs;
var templateObject_1;
