import type { Context } from "hono";
import type { createAuth } from "./auth";

export type Auth = ReturnType<typeof createAuth>;

export type HonoContext = {
  Bindings: Env;
  Variables: {
    user: Auth["$Infer"]["Session"]["user"] | null;
    session: Auth["$Infer"]["Session"]["session"] | null;
  };
};

export type AppContext = Context<HonoContext>;
