interface WelcomeProps {
  readonly projectName: string;
  readonly purpose: string;
  readonly hasProgress: boolean;
  readonly onProjectNameChange: (value: string) => void;
  readonly onPurposeChange: (value: string) => void;
  readonly onStart: () => void;
  readonly onBrowse: () => void;
}

export function Welcome({
  projectName,
  purpose,
  hasProgress,
  onProjectNameChange,
  onPurposeChange,
  onStart,
  onBrowse,
}: WelcomeProps) {
  return (
    <main className="welcome page-shell" data-testid="welcome">
      <section className="welcome-copy">
        <span className="section-kicker">Editorial Publishing Kit · Profile Studio</span>
        <h1>
          무엇을 만들지보다,
          <br />
          <em>어떻게 살아갈지</em> 먼저 묻습니다.
        </h1>
        <p>
          여덟 가지 운영 질문에 답하면 정본·편집·검토·계정·자산·게시
          경계를 함께 보고 가장 가까운 profile을 추천합니다. 모든 답은 이
          브라우저에만 남습니다.
        </p>
        <div className="welcome-facts" aria-label="Studio 특징">
          <div>
            <strong>08</strong>
            <span>운영 질문</span>
          </div>
          <div>
            <strong>05</strong>
            <span>체험 profile</span>
          </div>
          <div>
            <strong>00</strong>
            <span>원격 전송</span>
          </div>
        </div>
      </section>

      <section className="brief-card" aria-labelledby="brief-title">
        <div className="brief-card-head">
          <span>시작 메모</span>
          <small>2분 인터뷰</small>
        </div>
        <h2 id="brief-title">프로젝트를 한 문장으로 알려주세요.</h2>
        <label>
          <span>프로젝트 이름</span>
          <input
            value={projectName}
            onChange={(event) => onProjectNameChange(event.target.value)}
            placeholder="예: Robot Field Manual"
          />
        </label>
        <label>
          <span>만들고 싶은 것과 사용자는 누구인가요?</span>
          <textarea
            value={purpose}
            onChange={(event) => onPurposeChange(event.target.value)}
            placeholder="예: 현장 엔지니어가 계정으로 로그인해 장비 매뉴얼을 보고, 관리자는 WYSIWYG으로 고치고 파일을 배포합니다."
            rows={5}
          />
        </label>
        <button
          className="button primary wide"
          type="button"
          onClick={onStart}
          data-testid="start-interview"
        >
          {hasProgress ? "이어서 인터뷰하기" : "Profile grill 시작"}
        </button>
        <button className="text-button" type="button" onClick={onBrowse}>
          질문 전에 다섯 profile 먼저 둘러보기 →
        </button>
        <p className="local-note">
          <span aria-hidden="true">●</span>
          로그인 없음 · 분석 도구 없음 · 서버 저장 없음
        </p>
      </section>
    </main>
  );
}
