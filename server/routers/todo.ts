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
        todoListId: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { todoListId, title, description } = input;
      const targetTodoList = await prisma.toDoList.findUnique({
        select: defaultTodoListSelect,
        where: { id: todoListId },
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
        id: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, title, description } = input;
      const targetTodo = await prisma.toDo.update({
        where: {
          id: id,
        },
        data: {
          title,
          description,
        },
      });
      return targetTodo;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { id } = input;

      const targetTodo = await prisma.toDo.findUnique({
        where: {
          id: id,
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
          id: id,
        },
      });
    }),
  deleteAll: publicProcedure
    .input(z.object({ todoListId: z.string() }))
    .mutation(async ({ input }) => {
      const { todoListId } = input;

      const targetTodoList = await prisma.toDoList.findUnique({
        where: {
          id: todoListId,
        },
      });

      if (!targetTodoList) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No Todolist found.",
        });
      }

      await prisma.toDo.deleteMany({
        where: {
          toDoListId: todoListId,
        },
      });
    }),
});
