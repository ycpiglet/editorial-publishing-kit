import assert from "node:assert/strict";
import test from "node:test";
import { PROFILE_IDS } from "../src/contracts.js";
import {
  getProfile,
  listProfiles,
  recommendProfiles,
} from "../src/profiles.js";

test("registers every public profile exactly once", () => {
  assert.deepEqual(
    listProfiles()
      .map((profile) => profile.id)
      .sort(),
    [...PROFILE_IDS].sort(),
  );
});

test("recommends the manual portal for account-aware WYSIWYG work", () => {
  const [recommendation] = recommendProfiles(
    "계정과 권한이 있는 WYSIWYG 매뉴얼 포털",
  );
  assert.equal(recommendation?.profile.id, "manual-portal");
});

test("uses hybrid docs as the balanced fallback", () => {
  const [recommendation] = recommendProfiles("새로운 출판 프로젝트");
  assert.equal(recommendation?.profile.id, "hybrid-docs");
  assert.equal(getProfile("missing"), undefined);
});
