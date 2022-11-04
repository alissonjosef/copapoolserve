import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import ShortUniqueId from 'short-unique-id'
import { z } from "zod";

export async function poolRoutes(fastify: FastifyInstance){
    fastify.get("/pools/count", async () => {
        const count = await prisma.pool.count();
    
        return { count };
      });

      fastify.post("/pools", async (res, reply) => {
        const createPoolBody = z.object({
          title: z.string(),
        });
    
        try {
          const { title } = createPoolBody.parse(res.body);
    
          const generate = new ShortUniqueId({ length: 6})
          const code = String(generate()).toUpperCase();
    
          await prisma.pool.create({
            data: {
              title,
              code
            }
          })
    
          return reply.status(201).send({ code });
        } catch (error) {
          return reply.status(500).send({ msg: "Erro interno", error });
        }
      });
}

