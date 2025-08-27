import { describe, it, expect } from "vitest";
import app from "../src/index";
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
