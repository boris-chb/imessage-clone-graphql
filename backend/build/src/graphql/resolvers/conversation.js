"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationPopulated = exports.participantPopulated = void 0;
var graphql_1 = require("graphql");
var client_1 = require("@prisma/client");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var functions_1 = require("../../../src/util/functions");
var resolvers = {
    Query: {
        conversations: function (_, __, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, session, userId, conversations, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma = context.prisma, session = context.session;
                        if (!(session === null || session === void 0 ? void 0 : session.user))
                            throw new graphql_1.GraphQLError("Not authorized");
                        userId = session.user.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma.conversation.findMany({
                                where: {
                                    participants: {
                                        some: {
                                            userId: {
                                                equals: userId,
                                            },
                                        },
                                    },
                                },
                                include: exports.conversationPopulated,
                            })];
                    case 2:
                        conversations = _a.sent();
                        // let filteredConversations = conversations.filter(
                        //   (conversation) =>
                        //     !!conversation.participants.find((p) => p.userId === userId)
                        // );
                        console.log("[📁conversation.ts:40] conversations  === ", conversations);
                        return [2 /*return*/, conversations];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        throw new graphql_1.GraphQLError("Could not get conversations");
                    case 4: return [2 /*return*/];
                }
            });
        }); },
    },
    Mutation: {
        createConversation: function (_, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var session, prisma, pubsub, participantIds, userId, conversation, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        session = context.session, prisma = context.prisma, pubsub = context.pubsub;
                        participantIds = args.participantIds;
                        if (!(session === null || session === void 0 ? void 0 : session.user))
                            throw new graphql_1.GraphQLError("Not Authorized");
                        userId = session.user.id;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma.conversation.create({
                                data: {
                                    participants: {
                                        createMany: {
                                            data: participantIds.map(function (id) { return ({
                                                userId: id,
                                                seenLatestMessage: id === userId,
                                            }); }),
                                        },
                                    },
                                },
                                // data to get back after creating a conversation
                                include: exports.conversationPopulated,
                            })];
                    case 2:
                        conversation = _a.sent();
                        // emit a CONVERSATION_CREATED event using pubsub
                        pubsub.publish("CONVERSATION_CREATED", {
                            conversationCreated: conversation,
                        });
                        console.log("CONVERSATION_CREATED published", conversation);
                        return [2 /*return*/, {
                                conversationId: conversation.id,
                            }];
                    case 3:
                        error_2 = _a.sent();
                        console.error("createConversation error", error_2);
                        throw new graphql_1.GraphQLError("Error creating conversation");
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        deleteConversation: function (_, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, conversationId, deletedConversation, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma = context.prisma;
                        conversationId = args.conversationId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma.conversation.delete({
                                where: { id: conversationId },
                            })];
                    case 2:
                        deletedConversation = _a.sent();
                        if (!deletedConversation)
                            return [2 /*return*/, { success: false, error: "Error deleting conversation" }];
                        return [2 /*return*/, { success: true }];
                    case 3:
                        err_1 = _a.sent();
                        console.error("delete Conversation resolver error", err_1.message);
                        return [2 /*return*/, {
                                error: err_1 === null || err_1 === void 0 ? void 0 : err_1.message,
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        markAsRead: function (_, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            var prisma, session, conversationId, userId, seenLatestMessage, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prisma = context.prisma, session = context.session;
                        conversationId = args.conversationId, userId = args.userId;
                        if (!(session === null || session === void 0 ? void 0 : session.user))
                            throw new graphql_1.GraphQLError("Not authorized");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, prisma.conversationParticipant.update({
                                where: { conversationId: conversationId },
                                data: { seenLatestMessage: true },
                            })];
                    case 2:
                        seenLatestMessage = (_a.sent()).seenLatestMessage;
                        console.log(seenLatestMessage);
                        return [2 /*return*/, true];
                    case 3:
                        error_3 = _a.sent();
                        console.error(error_3);
                        throw new graphql_1.GraphQLError(error_3 === null || error_3 === void 0 ? void 0 : error_3.message);
                    case 4: return [2 /*return*/];
                }
            });
        }); },
    },
    Subscription: {
        conversationCreated: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(function (_, __, context) {
                // Access pubsub to emit event
                var pubsub = context.pubsub;
                return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
            }, function (payload, _, context) {
                // Filter which users to emit event to
                var session = context.session;
                if (!(session === null || session === void 0 ? void 0 : session.user))
                    throw new graphql_1.GraphQLError("Not Authorized");
                var participants = payload.conversationCreated.participants;
                var isConversationParticipant = (0, functions_1.userIsConversationParticipant)(participants, session === null || session === void 0 ? void 0 : session.user.id);
                return isConversationParticipant;
            }),
        },
        conversationUpdated: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(function (_, __, context) {
                var pubsub = context.pubsub;
                return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
            }, function (payload, _, context) {
                var session = context.session;
                if (!(session === null || session === void 0 ? void 0 : session.user))
                    throw new graphql_1.GraphQLError("Not Authorized");
                var currentUserId = session.user.id;
                console.log(payload);
                var participants = payload.conversationUpdated.conversation.participants;
                return (0, functions_1.userIsConversationParticipant)(participants, currentUserId);
            }),
        },
    },
};
// Generate TypeScript Types
exports.participantPopulated = client_1.Prisma.validator()({
    user: { select: { id: true, username: true } },
});
exports.conversationPopulated = client_1.Prisma.validator()({
    participants: {
        include: exports.participantPopulated,
    },
    latestMessage: {
        include: { sender: { select: { id: true, username: true } } },
    },
});
exports.default = resolvers;
