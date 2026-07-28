import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { serveStudio } from "../src/studio-server.js";

test("serves the local studio with restrictive browser headers", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "epk-studio-"));
  await writeFile(
    path.join(temporaryRoot, "index.html"),
    "<!doctype html><title>Studio fixture</title><main>Profile Studio</main>",
  );
  const running = await serveStudio({
    port: 0,
    staticRoot: temporaryRoot,
  });

  try {
    const response = await fetch(running.url);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Profile Studio/u);
    assert.match(
      response.headers.get("content-security-policy") ?? "",
      /default-src 'self'/u,
    );
    assert.equal(response.headers.get("x-frame-options"), "DENY");
  } finally {
    await running.close();
  }
});

test("rejects non-read methods and missing static builds", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "epk-studio-"));
  await writeFile(path.join(temporaryRoot, "index.html"), "<main>Studio</main>");
  const running = await serveStudio({
    port: 0,
    staticRoot: temporaryRoot,
  });

  try {
    const response = await fetch(running.url, { method: "POST" });
    assert.equal(response.status, 405);
  } finally {
    await running.close();
  }

  await assert.rejects(
    serveStudio({
      port: 0,
      staticRoot: path.join(temporaryRoot, "missing"),
    }),
    /Profile Studio build is missing/u,
  );
});
