import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })

// On serverless platforms, avoid creating multiple PrismaClient instances across
// cold starts by caching the client on the global object.
const anyGlobal = global as any;
const prisma: PrismaClient = anyGlobal.__prisma ?? new PrismaClient({ adapter });
if (!anyGlobal.__prisma) anyGlobal.__prisma = prisma;

export { prisma }