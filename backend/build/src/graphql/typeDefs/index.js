"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
var user_1 = __importDefault(require("./user"));
var conversation_1 = __importDefault(require("./conversation"));
var messages_1 = __importDefault(require("./messages"));
exports.typeDefs = [user_1.default, conversation_1.default, messages_1.default];
