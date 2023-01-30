import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import * as dotenv from "dotenv";
import express from "express";
import http from "http";
import { getSession } from "next-auth/react";
import resolvers from "./graphql/resolvers";
import { typeDefs } from "./graphql/typeDefs";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext, SubscriptionContext } from "./types";
import { Session } from "./types/";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";

async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);
  const prisma = new PrismaClient();
  const pubsub = new PubSub();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });

  const serverCleanup = useServer(
    {
      schema,
      // pass session to the server from the frontend via context.connectionParams
      context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        if (ctx.connectionParams?.session) {
          // return the session if there is one
          const { session } = ctx.connectionParams;
          return { session, prisma, pubsub };
        }

        return { session: null, prisma, pubsub };
      },
    },
    wsServer
  );

  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    context: async ({ req, res }): Promise<GraphQLContext> => {
      const session = (await getSession({ req })) as Session;

      // passing { session, prisma } as context to resolvers fn
      return {
        session,
        prisma,
        pubsub,
      };
    },
  });

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    // for NextAuth authorization headers
    // necessary to pass Session as Context for resolvers
    credentials: true,
  };

  await server.start();
  server.applyMiddleware({
    app,
    cors: corsOptions,
  });

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

main().catch((err) => console.error(err));
