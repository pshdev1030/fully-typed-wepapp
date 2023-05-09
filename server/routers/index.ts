import { router } from "../trpc";
import { todoRouter } from "./todo";
import { todoListRouter } from "./todoList";

export const appRouter = router({
  todolist: todoListRouter,
  todo: todoRouter,
});

export type AppRouter = typeof appRouter;
