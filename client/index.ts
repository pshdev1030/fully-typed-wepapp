import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server/routers";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
    }),
  ],
});

(async function () {
  try {
    const list = trpc.todolist.list.query({ id: "3" });
  } catch (error) {
    console.log(error);
  }
})();
