import { router } from "../trpc";
import { todoListRouter } from "./todoList";

export const appRouter = router({
  todolist: todoListRouter,
});

export type AppRouter = typeof appRouter;
