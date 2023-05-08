import { z } from "zod";
import { prisma } from "../prisma";
import { publicProcedure, router } from "../trpc";

export const todoListRouter = router({
  list: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const list = await prisma.toDoList.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
    }),
});
