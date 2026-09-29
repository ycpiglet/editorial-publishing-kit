import type {
  ProfilePresentation,
  ProfileReference,
} from "../profilePresentation.js";

interface ProfileGuideProps {
  readonly presentation: ProfilePresentation;
}

function ReferenceCard({
  reference,
}: {
  readonly reference: ProfileReference;
}) {
  const badge =
    reference.type === "live"
      ? "LIVE DEPLOYMENT"
      : reference.type === "local"
        ? "LOCAL-ONLY IMPLEMENTATION"
        : "REFERENCE IMPLEMENTATION";

  return (
    <article className={`reference-card reference-${reference.type}`}>
      <div className="reference-status">
        <i aria-hidden="true" />
        <span>{badge}</span>
      </div>
      <h3>{reference.name}</h3>
      <p>{reference.description}</p>
      <div className="reference-actions">
        <a
          href={reference.primaryUrl}
          target="_blank"
          rel="noreferrer"
          className="reference-primary"
        >
          {reference.primaryLabel} <span aria-hidden="true">↗</span>
        </a>
        {reference.sourceUrl !== undefined ? (
          <a href={reference.sourceUrl} target="_blank" rel="noreferrer">
            {reference.sourceLabel ?? "소스 보기"}{" "}
            <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function ProfileGuide({ presentation }: ProfileGuideProps) {
  return (
    <section
      className="profile-guide"
      aria-labelledby="profile-guide-title"
      style={
        {
          "--profile-accent": presentation.accent,
          "--profile-soft": presentation.soft,
        } as React.CSSProperties
      }
    >
      <header className="guide-heading">
        <div>
          <span className="section-kicker">Decision guide</span>
          <h2 id="profile-guide-title">
            이 프로필을 언제, 왜, 누가 쓰나요?
          </h2>
        </div>
        <p>
          기능 목록보다 운영 상황을 먼저 비교하세요. 아래 조건이 실제 팀과
          맞을수록 이 profile을 안전하게 채택할 수 있습니다.
        </p>
      </header>

      <dl className="decision-lens">
        <div>
          <dt>WHEN · 언제</dt>
          <dd>{presentation.when}</dd>
        </div>
        <div>
          <dt>WHY · 왜</dt>
          <dd>{presentation.why}</dd>
        </div>
        <div>
          <dt>WHO · 누가</dt>
          <dd>{presentation.who}</dd>
        </div>
      </dl>

      <div className="guide-detail-grid">
        <article className="workflow-card">
          <span className="guide-label">기본 사용법</span>
          <ol>
            {presentation.workflow.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="pros-cons-card">
          <div>
            <span className="guide-label">장점</span>
            <ul className="positive-list">
              {presentation.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="guide-label">단점·주의점</span>
            <ul className="caution-list">
              {presentation.tradeoffs.map((tradeoff) => (
                <li key={tradeoff}>{tradeoff}</li>
              ))}
            </ul>
          </div>
        </article>

        <div className="guide-side">
          <article className="recommendation-card">
            <span className="guide-label">이럴 때 추천</span>
            <ul>
              {presentation.recommendationSignals.map((reason) => (
                <li key={reason}>
                  <span aria-hidden="true">✓</span>
                  {reason}
                </li>
              ))}
            </ul>
          </article>
          <ReferenceCard reference={presentation.reference} />
        </div>
      </div>
    </section>
  );
}

export function ExperienceMission({ presentation }: ProfileGuideProps) {
  return (
    <section
      className="experience-mission"
      style={
        {
          "--profile-accent": presentation.accent,
          "--profile-soft": presentation.soft,
        } as React.CSSProperties
      }
      aria-labelledby="experience-mission-title"
    >
      <div className="mission-copy">
        <span>HANDS-ON MISSION</span>
        <h2 id="experience-mission-title">이제 직접 작성해 보세요.</h2>
        <p>{presentation.mission}</p>
      </div>
      <ol>
        {presentation.missionSteps.map((step, index) => (
          <li key={step}>
            <span>{index + 1}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
