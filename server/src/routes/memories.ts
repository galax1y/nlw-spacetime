import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async (request: FastifyRequest) => {
    await request.jwtVerify()

    console.log(request.user)

    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  app.get(
    '/memories/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(request.params)

      if (!id) {
        reply.status(400).send()
      }

      const memory = await prisma.memory.findUniqueOrThrow({
        where: {
          id,
        },
      })

      return memory
    },
  )

  app.post('/memories', async (request: FastifyRequest) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        userId: 'aee8a801-ddbe-4a89-bbf1-d1e1d56077dd',
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  })

  app.put('/memories/:id', async (request: FastifyRequest) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  })

  app.delete('/memories/:id', async (request: FastifyRequest) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const deleted = await prisma.memory.delete({
      where: {
        id,
      },
    })

    return deleted
  })
}
