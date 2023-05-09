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

export const todoRouter = router({
  add: publicProcedure
    .input(
      z.object({
        targetId: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
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
  edit: publicProcedure
    .input(
      z.object({
        todoId: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { todoId, title, description } = input;
      const targetTodo = await prisma.toDo.update({
        where: {
          id: todoId,
        },
        data: {
          title,
          description,
        },
      });
      return targetTodo;
    }),
  delete: publicProcedure
    .input(z.object({ todoId: z.string() }))
    .mutation(async ({ input }) => {
      const { todoId } = input;

      const targetTodo = await prisma.toDo.findUnique({
        where: {
          id: todoId,
        },
      });
      if (!targetTodo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No Todo found.",
        });
      }
      await prisma.toDo.delete({
        where: {
          id: todoId,
        },
      });
    }),
});
