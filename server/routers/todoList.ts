import { TRPCError } from "@trpc/server";
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
      const list = await prisma.toDoList.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!list)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No Todolist found.",
        });
      return list;
    }),
});
