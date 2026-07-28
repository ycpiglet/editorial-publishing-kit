import type {
  InterviewAnswers,
  InterviewQuestion,
  InterviewResult,
} from "../../../src/interview.js";
import { INTERVIEW_QUESTIONS } from "../../../src/interview.js";
import { PROFILE_PRESENTATIONS } from "../profilePresentation.js";

interface InterviewFlowProps {
  readonly answers: InterviewAnswers;
  readonly currentQuestion: number;
  readonly result: InterviewResult;
  readonly onAnswer: (question: InterviewQuestion, optionId: string) => void;
  readonly onBack: () => void;
  readonly onNext: () => void;
  readonly onJump: (index: number) => void;
}

const CONFIDENCE_LABELS = {
  exploring: "탐색 중",
  directional: "방향이 보임",
  strong: "강한 추천",
} as const;

export function InterviewFlow({
  answers,
  currentQuestion,
  result,
  onAnswer,
  onBack,
  onNext,
  onJump,
}: InterviewFlowProps) {
  const question = INTERVIEW_QUESTIONS[currentQuestion];
  if (question === undefined) {
    return null;
  }
  const selected = answers[question.id] ?? [];
  const top = result.recommendations[0];
  const presentation =
    top === undefined ? undefined : PROFILE_PRESENTATIONS[top.profile.id];
  const isLast = currentQuestion === INTERVIEW_QUESTIONS.length - 1;

  return (
    <main className="interview-layout page-shell" data-testid="interview-flow">
      <aside className="interview-rail" aria-label="인터뷰 진행">
        <div className="rail-heading">
          <span>Profile grill</span>
          <strong>{result.completionPercent}%</strong>
        </div>
        <div
          className="progress-track"
          aria-label={`인터뷰 ${result.completionPercent}% 완료`}
        >
          <span style={{ width: `${result.completionPercent}%` }} />
        </div>
        <ol className="step-list">
          {INTERVIEW_QUESTIONS.map((item, index) => {
            const answered = (answers[item.id]?.length ?? 0) > 0;
            const reachable = index <= currentQuestion || answered;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={[
                    "step-button",
                    index === currentQuestion ? "is-current" : "",
                    answered ? "is-answered" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={index === currentQuestion ? "step" : undefined}
                  disabled={!reachable}
                  onClick={() => onJump(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <em>{item.title}</em>
                </button>
              </li>
            );
          })}
        </ol>
        <p className="rail-footnote">
          정답은 없습니다. 실제 운영 경계를 가장 잘 설명하는 답을 고르세요.
        </p>
      </aside>

      <section className="question-stage" aria-labelledby="question-title">
        <div className="question-meta">
          <span>{question.step}</span>
          <span>
            {question.multiple ? "복수 선택" : "하나 선택"} ·{" "}
            {currentQuestion + 1}/{INTERVIEW_QUESTIONS.length}
          </span>
        </div>
        <h1 id="question-title">{question.title}</h1>
        <p className="question-prompt">{question.prompt}</p>

        <fieldset className="answer-grid">
          <legend className="visually-hidden">{question.title}</legend>
          {question.options.map((option) => {
            const checked = selected.includes(option.id);
            return (
              <label
                className={`answer-card${checked ? " is-selected" : ""}`}
                key={option.id}
              >
                <input
                  type={question.multiple ? "checkbox" : "radio"}
                  name={question.id}
                  value={option.id}
                  checked={checked}
                  onChange={() => onAnswer(question, option.id)}
                />
                <span className="answer-marker" aria-hidden="true">
                  {checked ? "✓" : ""}
                </span>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </label>
            );
          })}
        </fieldset>

        <div className="question-actions">
          <button type="button" className="button ghost" onClick={onBack}>
            이전
          </button>
          <button
            type="button"
            className="button primary"
            disabled={selected.length === 0}
            onClick={onNext}
            data-testid="interview-next"
          >
            {isLast ? "추천 결과 보기" : "다음 질문"}
          </button>
        </div>
      </section>

      <aside className="live-fit" aria-live="polite">
        <span className="section-kicker">지금까지의 신호</span>
        {top === undefined || presentation === undefined ? (
          <p>첫 답을 고르면 profile 적합도가 여기에 나타납니다.</p>
        ) : (
          <>
            <div
              className="live-fit-monogram"
              style={{
                background: presentation.soft,
                color: presentation.accent,
              }}
            >
              {presentation.monogram}
            </div>
            <p className="live-fit-label">
              {CONFIDENCE_LABELS[result.confidence]}
            </p>
            <h2>{presentation.shortName}</h2>
            <div className="fit-meter">
              <span style={{ width: `${top.fitPercent}%` }} />
            </div>
            <div className="fit-score">
              <strong>{top.fitPercent}%</strong>
              <span>현재 적합도</span>
            </div>
            <p>{top.reasons[0] ?? presentation.promise}</p>
            {top.tradeoffs[0] === undefined ? null : (
              <div className="live-caution">
                <span>검토 포인트</span>
                <p>{top.tradeoffs[0]}</p>
              </div>
            )}
          </>
        )}
      </aside>
    </main>
  );
}
