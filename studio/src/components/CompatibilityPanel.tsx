export function CompatibilityPanel() {
  return (
    <section className="compatibility-panel" aria-labelledby="compatibility-title">
      <header>
        <div>
          <span className="section-kicker">Cross-platform boundary</span>
          <h2 id="compatibility-title">
            OS 독립적이지만, “모든 환경 무조건 지원”은 아닙니다.
          </h2>
        </div>
        <p>
          Studio는 운영체제 전용 API 없이 정적 HTML·CSS·JavaScript와 Node.js
          loopback server만 사용합니다. 따라서 데스크톱 OS마다 별도 UI를
          만들 필요는 없지만, 아래 실행 조건은 지켜야 합니다.
        </p>
      </header>

      <div className="compatibility-grid">
        <article>
          <span>01 · 지원 경로</span>
          <strong>Windows · macOS · Linux</strong>
          <p>
            동일한 npm package와 <code>epk studio</code> 명령을 사용합니다.
            경로 처리는 Node.js API에 맡겨 OS별 separator 차이를 피합니다.
          </p>
        </article>
        <article>
          <span>02 · 로컬 경계</span>
          <strong>127.0.0.1 전용</strong>
          <p>
            입력은 browser storage에만 남고 server는 정적 파일만 제공합니다.
            같은 네트워크의 다른 장치에는 자동으로 공개되지 않습니다.
          </p>
        </article>
        <article>
          <span>03 · 검증 근거</span>
          <strong>3 OS CI + Chromium QA</strong>
          <p>
            build와 test는 Ubuntu, Windows, macOS에서 실행합니다. 실제 화면은
            Chromium의 데스크톱·모바일 viewport에서 상호작용을 확인합니다.
          </p>
        </article>
        <article className="compatibility-caveat">
          <span>04 · 필요한 조건</span>
          <strong>Node.js 20+ · 최신 브라우저</strong>
          <p>
            오래된 브라우저, 회사 정책으로 막힌 clipboard/download, 이미 사용
            중인 port는 예외입니다. 이 경우 port를 바꾸거나 복사 fallback을
            사용해야 합니다.
          </p>
        </article>
      </div>
    </section>
  );
}
