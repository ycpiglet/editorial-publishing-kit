import type { ProfileId } from "../../../src/contracts.js";
import type { InterviewResult } from "../../../src/interview.js";
import {
  CAPABILITY_LABELS,
  COMPARISON_CAPABILITIES,
  PROFILE_PRESENTATIONS,
} from "../profilePresentation.js";

interface ResultsViewProps {
  readonly result: InterviewResult;
  readonly selectedProfileId: ProfileId;
  readonly onSelect: (profileId: ProfileId) => void;
  readonly onTry: (profileId: ProfileId) => void;
  readonly onAdopt: (profileId: ProfileId) => void;
  readonly onEditAnswers: () => void;
}

const CONFIDENCE_COPY = {
  exploring: "몇 가지 답을 더 확인하면 추천이 선명해집니다.",
  directional: "방향은 분명하지만 대안 profile도 함께 검토할 가치가 있습니다.",
  strong: "답변 사이의 일관성이 높아 강한 추천을 만들었습니다.",
} as const;

export function ResultsView({
  result,
  selectedProfileId,
  onSelect,
  onTry,
  onAdopt,
  onEditAnswers,
}: ResultsViewProps) {
  const top = result.recommendations[0];
  if (top === undefined) {
    return null;
  }
  const topPresentation = PROFILE_PRESENTATIONS[top.profile.id];

  return (
    <main className="results page-shell" data-testid="recommendation-results">
      <section
        className="result-hero"
        style={
          {
            "--profile-accent": topPresentation.accent,
            "--profile-soft": topPresentation.soft,
          } as React.CSSProperties
        }
      >
        <div className="result-hero-copy">
          <span className="section-kicker">인터뷰 결과 · 1순위</span>
          <div className="result-title-row">
            <div className="result-monogram">{topPresentation.monogram}</div>
            <div>
              <p>{topPresentation.eyebrow}</p>
              <h1>{topPresentation.shortName}</h1>
            </div>
          </div>
          <p className="result-promise">{topPresentation.promise}</p>
          <div className="result-actions">
            <button
              className="button primary"
              type="button"
              onClick={() => onTry(top.profile.id)}
            >
              실제 UI 체험
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() => onAdopt(top.profile.id)}
            >
              이 profile 채택
            </button>
          </div>
        </div>
        <div className="result-score-card">
          <span>추천 적합도</span>
          <strong>{top.fitPercent}</strong>
          <em>%</em>
          <div className="fit-meter large">
            <span style={{ width: `${top.fitPercent}%` }} />
          </div>
          <p>{CONFIDENCE_COPY[result.confidence]}</p>
          <small>
            2순위와 {result.scoreMargin}점 차이 · {result.answeredQuestions}/
            {result.totalQuestions}개 답변
          </small>
        </div>
      </section>

      <section className="result-evidence">
        <article>
          <span className="section-kicker">왜 맞나요</span>
          <h2>답변에서 이어진 근거</h2>
          <ol>
            {top.reasons.map((reason, index) => (
              <li key={reason}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{reason}</p>
              </li>
            ))}
          </ol>
        </article>
        <article className="tradeoff-card">
          <span className="section-kicker">채택 전 확인</span>
          <h2>이 profile의 trade-off</h2>
          <ul>
            {top.tradeoffs.map((tradeoff) => (
              <li key={tradeoff}>{tradeoff}</li>
            ))}
          </ul>
          <button className="text-button" type="button" onClick={onEditAnswers}>
            답변을 다시 검토하기 →
          </button>
        </article>
      </section>

      <section className="ranked-profiles" aria-labelledby="ranked-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Fit ranking</span>
            <h2 id="ranked-title">대안을 버리지 않고 비교합니다.</h2>
          </div>
          <p>
            점수는 정답이 아니라 시작점입니다. 실제 화면을 체험하고 운영 경계를
            확인한 뒤 선택하세요.
          </p>
        </div>
        <div className="profile-rank-grid">
          {result.recommendations.map((recommendation, index) => {
            const presentation =
              PROFILE_PRESENTATIONS[recommendation.profile.id];
            const selected = selectedProfileId === recommendation.profile.id;
            return (
              <article
                className={`rank-card${selected ? " is-selected" : ""}`}
                key={recommendation.profile.id}
                style={
                  {
                    "--profile-accent": presentation.accent,
                    "--profile-soft": presentation.soft,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  className="rank-card-select"
                  onClick={() => onSelect(recommendation.profile.id)}
                  aria-pressed={selected}
                >
                  <span className="rank-number">{index + 1}</span>
                  <span className="rank-monogram">{presentation.monogram}</span>
                  <span className="rank-name">
                    <small>{presentation.eyebrow}</small>
                    <strong>{presentation.shortName}</strong>
                  </span>
                  <span className="rank-fit">{recommendation.fitPercent}%</span>
                </button>
                <div className="rank-bar">
                  <span style={{ width: `${recommendation.fitPercent}%` }} />
                </div>
                <p>{presentation.promise}</p>
                <div className="rank-tags">
                  {presentation.bestFor.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="rank-actions">
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => onTry(recommendation.profile.id)}
                  >
                    UI 체험
                  </button>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => onAdopt(recommendation.profile.id)}
                  >
                    채택
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="capability-compare" aria-labelledby="compare-title">
        <div className="section-heading compact">
          <div>
            <span className="section-kicker">Capability map</span>
            <h2 id="compare-title">같은 기능도 기본값은 다릅니다.</h2>
          </div>
        </div>
        <div className="comparison-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                {result.recommendations.map((item) => (
                  <th scope="col" key={item.profile.id}>
                    {PROFILE_PRESENTATIONS[item.profile.id].shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_CAPABILITIES.map((capability) => (
                <tr key={capability}>
                  <th scope="row">{CAPABILITY_LABELS[capability]}</th>
                  {result.recommendations.map((item) => (
                    <td key={item.profile.id}>
                      <span
                        className={
                          item.profile.capabilities.includes(capability)
                            ? "capability-yes"
                            : "capability-no"
                        }
                      >
                        {item.profile.capabilities.includes(capability)
                          ? "기본"
                          : "선택"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
