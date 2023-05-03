import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
    }),
  ],
});

(async function () {
  const userList = await trpc.userList.query();
  console.log("userList", userList);

  const createdUser = await trpc.userCreate.mutate({ name: "박성현" });
  console.log("createdUser", createdUser);

  const user = await trpc.userById.query(String(userList.length + 1));
  console.log("user", user);

  const userListAfterCreateUser = await trpc.userList.query();
  console.log("userListAfterCreateUser", userListAfterCreateUser);
})();
