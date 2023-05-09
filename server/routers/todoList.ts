import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../prisma";
import { publicProcedure, router } from "../trpc";

const defaultTodoListSelect = Prisma.validator<Prisma.ToDoListSelect>()({
  id: true,
  title: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  toDos: true,
});

export const todoListRouter = router({
  getListById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const list = await prisma.toDoList.findUnique({
        select: defaultTodoListSelect,
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
  postTodo: publicProcedure
    .input(
      z.object({
        targetId: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { targetId, title, description } = input;
      const targetTodoList = await prisma.toDoList.findUnique({
        select: defaultTodoListSelect,
        where: { id: targetId },
      });

      if (!targetTodoList) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No Todolist found.",
        });
      }

      const newTodo = await prisma.toDo.create({
        data: {
          toDoList: { connect: { id: targetTodoList.id } },
          title,
          description,
        },
      });

      await prisma.toDoList.update({
        where: { id: targetTodoList.id },
        data: { toDos: { connect: { id: newTodo.id } } },
      });

      return newTodo;
    }),
});
