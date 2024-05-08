import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

// neonConfig.webSocketConstructor = ws;
const connectionString = env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 60 * 1000,
  connectionTimeoutMillis: 10 * 1000,
});

pool.on("error", (err) => {
  console.error("pg.Pool emitted an error:", err);
});

pool.on("connect", () => {
  console.log(
    `pg.Pool connected a new client. Total clients: ${pool.totalCount}`,
  );
});

pool.on("remove", () => {
  console.log(`pg.Pool removed a client. Total clients: ${pool.totalCount}`);
});

pool.on("acquire", () => {
  console.log("pg.Pool client was acquired");
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
(pool as any).on("release", (err: unknown) => {
  if (err) {
    console.error("pg.Pool client was released with error:", err);
  } else {
    console.log("pg.Pool client was released");
  }
});

const adapter = new PrismaNeon(pool);

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    adapter: adapter,
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
