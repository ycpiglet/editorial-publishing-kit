import assert from "node:assert/strict";
import test from "node:test";
import {
  INTERVIEW_QUESTIONS,
  isInterviewComplete,
  recommendFromInterview,
  type InterviewAnswers,
} from "../src/interview.js";

const complete = (overrides: InterviewAnswers): InterviewAnswers => ({
  "project-shape": ["mixed-documentation"],
  "canonical-source": ["undecided"],
  "editing-experience": ["both"],
  "contribution-model": ["direct-and-proposal"],
  "identity-model": ["oauth-membership"],
  "asset-workflow": ["private-staging"],
  "publication-outputs": ["web-reader", "structured-export"],
  "privacy-boundary": ["mixed-visibility"],
  ...overrides,
});

test("defines eight answerable interview dimensions", () => {
  assert.equal(INTERVIEW_QUESTIONS.length, 8);
  assert.ok(
    INTERVIEW_QUESTIONS.every(
      (question) => question.options.length >= 3 && question.prompt.length > 0,
    ),
  );
});

test("recommends the manual portal for account-managed WYSIWYG operations", () => {
  const result = recommendFromInterview({
    purpose: "현장 장비 WYSIWYG 매뉴얼과 계정 권한",
    answers: complete({
      "project-shape": ["operations-manual"],
      "canonical-source": ["revision-database"],
      "editing-experience": ["wysiwyg"],
      "contribution-model": ["direct-and-proposal"],
      "identity-model": ["application-accounts"],
      "asset-workflow": ["private-staging"],
      "publication-outputs": ["web-reader", "structured-export"],
      "privacy-boundary": ["project-isolation"],
    }),
  });

  assert.equal(result.recommendations[0]?.profile.id, "manual-portal");
  assert.equal(result.confidence, "strong");
  assert.ok((result.recommendations[0]?.reasons.length ?? 0) >= 4);
  assert.equal(result.completionPercent, 100);
});

test("recommends the technical atlas for Git, proposals, and book outputs", () => {
  const result = recommendFromInterview({
    purpose: "Quarto 수학 책을 PDF EPUB과 웹으로 교정 출판",
    answers: complete({
      "project-shape": ["technical-publication"],
      "canonical-source": ["git"],
      "editing-experience": ["source"],
      "contribution-model": ["proposal"],
      "identity-model": ["git-identity"],
      "asset-workflow": ["git-assets"],
      "publication-outputs": ["web-reader", "pdf-epub"],
      "privacy-boundary": ["public-content"],
    }),
  });

  assert.equal(result.recommendations[0]?.profile.id, "technical-atlas");
  assert.ok((result.recommendations[0]?.fitPercent ?? 0) >= 70);
});

test("recommends local tutorial when data cannot leave the device", () => {
  const result = recommendFromInterview({
    purpose: "로컬 시뮬레이션 실습과 report artifact",
    answers: complete({
      "project-shape": ["local-learning"],
      "canonical-source": ["filesystem"],
      "editing-experience": ["source"],
      "contribution-model": ["direct"],
      "identity-model": ["local-no-account"],
      "asset-workflow": ["local-managed-assets"],
      "publication-outputs": ["local-artifact"],
      "privacy-boundary": ["local-only"],
    }),
  });

  assert.equal(result.recommendations[0]?.profile.id, "local-tutorial");
  assert.equal(result.confidence, "strong");
});

test("uses hybrid docs for a complete mixed workflow", () => {
  const answers = complete({});
  const result = recommendFromInterview({
    purpose: "개발자 문서와 운영 문서를 함께 제공",
    answers,
  });

  assert.equal(isInterviewComplete(answers), true);
  assert.equal(result.recommendations[0]?.profile.id, "hybrid-docs");
});

test("keeps incomplete interviews directional instead of overstating confidence", () => {
  const answers = {
    "project-shape": ["living-knowledge"],
  } satisfies InterviewAnswers;
  const result = recommendFromInterview({ answers });

  assert.equal(isInterviewComplete(answers), false);
  assert.equal(result.confidence, "exploring");
  assert.equal(result.answeredQuestions, 1);
});

test("discounts fit when only the free-text purpose is known", () => {
  const result = recommendFromInterview({
    purpose: "WYSIWYG 매뉴얼 계정 포털",
    answers: {},
  });

  assert.equal(result.recommendations[0]?.profile.id, "manual-portal");
  assert.ok((result.recommendations[0]?.fitPercent ?? 100) <= 35);
  assert.equal(result.confidence, "exploring");
});
