import { useState } from "react";
import {
  PROFILE_IDS,
  type ProfileDefinition,
  type ProfileId,
} from "../../../src/contracts.js";
import { getProfile } from "../../../src/profiles.js";
import {
  CAPABILITY_LABELS,
  PROFILE_PRESENTATIONS,
} from "../profilePresentation.js";

interface ProfileGalleryProps {
  readonly selectedProfileId: ProfileId;
  readonly onSelect: (profileId: ProfileId) => void;
  readonly onAdopt: (profileId: ProfileId) => void;
  readonly onBack: () => void;
}

interface DemoFrameProps {
  readonly profile: ProfileDefinition;
  readonly children: React.ReactNode;
}

function DemoFrame({ profile, children }: DemoFrameProps) {
  const presentation = PROFILE_PRESENTATIONS[profile.id];
  return (
    <div
      className="demo-frame"
      style={
        {
          "--profile-accent": presentation.accent,
          "--profile-soft": presentation.soft,
        } as React.CSSProperties
      }
    >
      <div className="demo-browser-bar">
        <div className="browser-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="browser-address">
          <span>local</span> / {profile.id} / preview
        </div>
        <div className="browser-live">interactive</div>
      </div>
      {children}
    </div>
  );
}
function WikiDemo({ profile }: { readonly profile: ProfileDefinition }) {
  const [mode, setMode] = useState<"read" | "edit" | "propose">("read");
  const [notice, setNotice] = useState("Revision 42 · 8분 전 게시");

  return (
    <DemoFrame profile={profile}>
      <div className="wiki-demo demo-surface" data-testid="demo-wiki-web">
        <header className="wiki-topbar">
          <div>
            <strong>BEAN / FIELD NOTES</strong>
            <span>추출 변수 위키</span>
          </div>
          <nav aria-label="Wiki demo 작업">
            <button
              type="button"
              className={mode === "read" ? "is-active" : ""}
              onClick={() => setMode("read")}
            >
              읽기
            </button>
            <button
              type="button"
              className={mode === "edit" ? "is-active" : ""}
              onClick={() => setMode("edit")}
            >
              직접 수정
            </button>
            <button
              type="button"
              className={mode === "propose" ? "is-active" : ""}
              onClick={() => setMode("propose")}
            >
              제안
            </button>
          </nav>
        </header>
        <div className="wiki-grid">
          <aside className="wiki-tree">
            <small>CONTENTS</small>
            <button type="button">01 · 물과 온도</button>
            <button type="button" className="is-active">
              02 · 분쇄도
            </button>
            <button type="button">03 · 추출 시간</button>
            <button type="button">04 · 기록법</button>
          </aside>
          <article className="wiki-article">
            <div className="article-breadcrumb">추출 / 변수 / 분쇄도</div>
            <h2>분쇄도는 흐름의 언어입니다.</h2>
            <p className="article-lead">
              같은 원두라도 입자 분포가 달라지면 물이 지나가는 경로와 접촉
              시간이 함께 바뀝니다.
            </p>
            {mode === "edit" ? (
              <div className="rich-editor">
                <div className="mini-toolbar" aria-label="Rich editor 도구막대">
                  <button type="button">H2</button>
                  <button type="button">
                    <strong>B</strong>
                  </button>
                  <button type="button">
                    <em>I</em>
                  </button>
                  <button type="button">Link</button>
                  <span />
                  <small>자동 저장: 로컬 초안</small>
                </div>
                <div
                  className="editable-copy"
                  contentEditable
                  role="textbox"
                  aria-label="Wiki 본문 편집 예시"
                  aria-multiline="true"
                  suppressContentEditableWarning
                >
                  미세한 분쇄는 표면적을 늘려 용출 속도를 높입니다. 다만 흐름이
                  막히면 채널링이 생길 수 있으므로, 맛과 유량을 함께 기록하세요.
                </div>
                <button
                  type="button"
                  className="demo-action"
                  onClick={() => {
                    setNotice("새 revision preview 준비됨 · 게시 전 diff 필요");
                    setMode("read");
                  }}
                >
                  Revision 저장
                </button>
              </div>
            ) : (
              <p className={mode === "propose" ? "proposal-selection" : ""}>
                미세한 분쇄는 표면적을 늘려 용출 속도를 높입니다. 다만 흐름이
                막히면 채널링이 생길 수 있으므로, 맛과 유량을 함께 기록하세요.
              </p>
            )}
            {mode === "propose" ? (
              <div className="inline-proposal">
                <span>선택 위치 · block b_019fa7</span>
                <textarea
                  aria-label="Wiki 수정 제안"
                  defaultValue="‘채널링’의 관찰 기준을 한 문장 추가하면 좋겠습니다."
                  rows={3}
                />
                <button
                  type="button"
                  onClick={() => {
                    setNotice("제안 #18 등록됨 · reviewer 확인 대기");
                    setMode("read");
                  }}
                >
                  제안 등록
                </button>
              </div>
            ) : null}
          </article>
          <aside className="wiki-history">
            <small>HISTORY</small>
            <strong>{notice}</strong>
            <ol>
              <li>
                <span>42</span>
                <p>문장 흐름 정리</p>
              </li>
              <li>
                <span>41</span>
                <p>분쇄 사진 교체</p>
              </li>
              <li>
                <span>40</span>
                <p>초안 공개</p>
              </li>
            </ol>
          </aside>
        </div>
      </div>
    </DemoFrame>
  );
}

function ManualDemo({ profile }: { readonly profile: ProfileDefinition }) {
  const [role, setRole] = useState("staff");
  const [assetState, setAssetState] = useState<"empty" | "staged" | "ready">(
    "empty",
  );

  const advanceAsset = () => {
    setAssetState((current) =>
      current === "empty" ? "staged" : current === "staged" ? "ready" : "empty",
    );
  };

  return (
    <DemoFrame profile={profile}>
      <div className="manual-demo demo-surface" data-testid="demo-manual-portal">
        <aside className="manual-nav">
          <div className="manual-brand">
            <span>OP</span>
            <strong>OPS MANUAL</strong>
          </div>
          <nav aria-label="Manual demo 메뉴">
            <button type="button" className="is-active">
              매뉴얼
            </button>
            <button type="button">장비</button>
            <button type="button">리소스</button>
            <button type="button">사용자</button>
          </nav>
          <div className="manual-user">
            <span>JY</span>
            <div>
              <strong>정윤</strong>
              <small>{role}</small>
            </div>
          </div>
        </aside>
        <section className="manual-workspace">
          <header>
            <div>
              <small>ROBOT / MAINTENANCE</small>
              <h2>감속기 점검 절차</h2>
            </div>
            <div className="manual-status">
              <span>초안</span>
              <button type="button">미리보기</button>
              <button type="button">게시 계획</button>
            </div>
          </header>
          <div className="manual-toolbar" aria-label="WYSIWYG 도구막대">
            <button type="button">제목</button>
            <button type="button">
              <strong>B</strong>
            </button>
            <button type="button">목록</button>
            <button type="button">표</button>
            <button type="button">Callout</button>
            <button type="button">이미지</button>
          </div>
          <div className="manual-canvas">
            <div className="manual-block">
              <span className="block-handle">⋮⋮</span>
              <small>안전 · 작업 전 확인</small>
              <p>전원을 차단하고 잔류 에너지가 없는지 확인합니다.</p>
            </div>
            <div
              className="manual-editable"
              contentEditable
              role="textbox"
              aria-label="Manual 본문 편집 예시"
              aria-multiline="true"
              suppressContentEditableWarning
            >
              <h3>1. 외관 상태 기록</h3>
              <p>
                누유, 진동, 비정상 소음을 확인하고 점검표에 현재 상태를
                기록합니다.
              </p>
            </div>
            <button type="button" className="add-block">
              + Block 추가
            </button>
          </div>
        </section>
        <aside className="manual-inspector">
          <div className="inspector-section">
            <small>DEMO ROLE</small>
            <label>
              <span className="visually-hidden">역할 선택</span>
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="viewer">viewer · 읽기</option>
                <option value="staff">staff · 작성</option>
                <option value="admin">admin · 계정 관리</option>
              </select>
            </label>
            <p>
              {role === "admin"
                ? "사용자 초대와 역할 변경까지 가능합니다."
                : role === "staff"
                  ? "본문 수정과 asset attach가 가능합니다."
                  : "게시된 manual만 읽을 수 있습니다."}
            </p>
          </div>
          <div className="inspector-section">
            <small>ASSET PIPELINE</small>
            <div className={`asset-drop asset-${assetState}`}>
              <strong>
                {assetState === "empty"
                  ? "점검 사진 추가"
                  : assetState === "staged"
                    ? "Private staging"
                    : "검사 완료 · attach 가능"}
              </strong>
              <span>
                {assetState === "empty"
                  ? "PNG · JPG · PDF"
                  : assetState === "staged"
                    ? "signature · size · metadata"
                    : "checksum 8c4f…a21d"}
              </span>
            </div>
            <button type="button" className="demo-action" onClick={advanceAsset}>
              {assetState === "ready" ? "Demo 초기화" : "다음 단계"}
            </button>
          </div>
        </aside>
      </div>
    </DemoFrame>
  );
}

function AtlasDemo({ profile }: { readonly profile: ProfileDefinition }) {
  const [selected, setSelected] = useState(false);
  const [proposalState, setProposalState] = useState<"draft" | "submitted">(
    "draft",
  );

  return (
    <DemoFrame profile={profile}>
      <div className="atlas-demo demo-surface" data-testid="demo-technical-atlas">
        <header className="atlas-header">
          <div>
            <small>ROBOTICS MATH ATLAS</small>
            <strong>SE(3) / Adjoint map</strong>
          </div>
          <div className="atlas-downloads">
            <button type="button">PDF ↓</button>
            <button type="button">EPUB ↓</button>
            <button type="button">Source ↗</button>
          </div>
        </header>
        <div className="atlas-grid">
          <aside className="atlas-toc">
            <small>CHAPTER 04</small>
            <ol>
              <li>Lie group 복습</li>
              <li className="is-active">Adjoint 표현</li>
              <li>Twist 변환</li>
              <li>수치 예제</li>
            </ol>
            <div className="build-proof">
              <span>BUILD PROOF</span>
              <strong>web · pdf · epub</strong>
              <small>revision 48dae1a</small>
            </div>
          </aside>
          <article className="atlas-reader">
            <span className="chapter-mark">4.2</span>
            <h2>Adjoint map은 좌표계 사이의 twist를 옮깁니다.</h2>
            <p>
              강체 변환 <code>T ∈ SE(3)</code>가 주어지면 adjoint 표현은
              body와 spatial 좌표 사이의 선형 변환을 제공합니다.
            </p>
            <div className="math-block">
              Ad<sub>T</sub> =
              <span className="matrix">[ R&nbsp;&nbsp; 0 ; p̂R&nbsp;&nbsp; R ]</span>
            </div>
            <button
              type="button"
              className={`selectable-paragraph${selected ? " is-selected" : ""}`}
              onClick={() => {
                setSelected((current) => !current);
                setProposalState("draft");
              }}
              aria-pressed={selected}
            >
              여기서 p̂는 위치 벡터 p의 skew-symmetric matrix이며, 선택한 좌표계
              convention에 따라 block 순서를 확인해야 합니다.
            </button>
            <small className="selection-help">
              문단을 눌러 정확한 위치 제안 흐름을 체험하세요.
            </small>
          </article>
          <aside className={`atlas-review${selected ? " is-open" : ""}`}>
            {selected ? (
              <>
                <small>INLINE PROPOSAL</small>
                <strong>block b_01J4 · revision 48dae1a</strong>
                <blockquote>
                  “선택한 좌표계 convention에 따라 block 순서를…”
                </blockquote>
                <label>
                  <span>수정 제안</span>
                  <textarea
                    rows={5}
                    defaultValue="body convention과 spatial convention의 block 순서를 표로 비교해주세요."
                  />
                </label>
                <div className="anchor-proof">
                  <span>exact ✓</span>
                  <span>prefix ✓</span>
                  <span>suffix ✓</span>
                </div>
                <button
                  type="button"
                  className="demo-action"
                  onClick={() => setProposalState("submitted")}
                >
                  {proposalState === "submitted"
                    ? "제안 #27 제출됨"
                    : "제안 검토 요청"}
                </button>
              </>
            ) : (
              <div className="review-empty">
                <span>⌁</span>
                <strong>교정할 문단을 선택하세요.</strong>
                <p>선택 위치와 source revision이 함께 고정됩니다.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </DemoFrame>
  );
}

function LocalDemo({ profile }: { readonly profile: ProfileDefinition }) {
  const [runState, setRunState] = useState<"ready" | "published">("ready");

  return (
    <DemoFrame profile={profile}>
      <div className="local-demo demo-surface" data-testid="demo-local-tutorial">
        <aside className="local-sidebar">
          <div className="local-brand">
            <span>MC</span>
            <div>
              <strong>MANIPULATOR LAB</strong>
              <small>local workspace</small>
            </div>
          </div>
          <nav aria-label="Local tutorial 단계">
            <button type="button">01 · 설치 확인</button>
            <button type="button" className="is-active">
              02 · Joint control
            </button>
            <button type="button">03 · Trajectory</button>
            <button type="button">04 · 분석</button>
          </nav>
          <div className="privacy-seal">
            <span>LOCAL ONLY</span>
            <p>원격 전송 adapter 꺼짐</p>
          </div>
        </aside>
        <section className="local-workspace">
          <header>
            <div>
              <small>LESSON 02</small>
              <h2>Joint-space PD control</h2>
            </div>
            <span className="runtime-chip">MuJoCo · pinned</span>
          </header>
          <div className="local-instructions">
            <p>
              목표 관절각을 설정하고 응답을 실행하세요. 결과는 새로운 immutable
              run directory에 기록됩니다.
            </p>
            <div className="parameter-row">
              <label>
                <span>Kp</span>
                <input type="number" defaultValue="80" />
              </label>
              <label>
                <span>Kd</span>
                <input type="number" defaultValue="12" />
              </label>
              <label>
                <span>duration</span>
                <input type="text" defaultValue="6.0 s" />
              </label>
            </div>
            <button
              type="button"
              className="local-run"
              onClick={() =>
                setRunState((current) =>
                  current === "ready" ? "published" : "ready",
                )
              }
            >
              {runState === "ready" ? "로컬 실습 실행" : "새 run 준비"}
            </button>
          </div>
          <div className="local-chart" aria-label="제어 응답 예시 그래프">
            <div className="chart-grid" />
            <div className="chart-line target" />
            <div className="chart-line response" />
            <div className="chart-legend">
              <span>— target</span>
              <span>— q1 response</span>
            </div>
          </div>
        </section>
        <aside className="artifact-panel">
          <small>ARTIFACT BUNDLE</small>
          {runState === "ready" ? (
            <div className="artifact-empty">
              <strong>아직 게시된 run이 없습니다.</strong>
              <p>실행하면 atomic staging 후 terminal bundle이 생성됩니다.</p>
            </div>
          ) : (
            <>
              <div className="artifact-success">
                <span>✓</span>
                <div>
                  <strong>run_20260728_1708</strong>
                  <small>manifest verified</small>
                </div>
              </div>
              <ul className="artifact-files">
                <li>
                  <span>HTML</span> report.html
                </li>
                <li>
                  <span>CSV</span> joint_state.csv
                </li>
                <li>
                  <span>PNG</span> response.png
                </li>
                <li>
                  <span>JSON</span> manifest.json
                </li>
              </ul>
              <div className="checksum">sha256 · d02a…7f19</div>
            </>
          )}
        </aside>
      </div>
    </DemoFrame>
  );
}

function HybridDemo({ profile }: { readonly profile: ProfileDefinition }) {
  const [editor, setEditor] = useState<"rich" | "source">("rich");
  const [outputs, setOutputs] = useState(["web", "git"]);

  const toggleOutput = (output: string) => {
    setOutputs((current) =>
      current.includes(output)
        ? current.filter((item) => item !== output)
        : [...current, output],
    );
  };

  return (
    <DemoFrame profile={profile}>
      <div className="hybrid-demo demo-surface" data-testid="demo-hybrid-docs">
        <header className="hybrid-header">
          <div>
            <span>HD</span>
            <strong>DOCS COMPOSER</strong>
          </div>
          <nav aria-label="Hybrid editor 모드">
            <button
              type="button"
              className={editor === "rich" ? "is-active" : ""}
              onClick={() => setEditor("rich")}
            >
              Rich
            </button>
            <button
              type="button"
              className={editor === "source" ? "is-active" : ""}
              onClick={() => setEditor("source")}
            >
              Source
            </button>
          </nav>
          <button type="button" className="hybrid-preview">
            Preview build
          </button>
        </header>
        <div className="hybrid-grid">
          <aside className="hybrid-tree">
            <small>CONTENT TYPES</small>
            <button type="button" className="is-active">
              Guides <span>12</span>
            </button>
            <button type="button">
              API <span>28</span>
            </button>
            <button type="button">
              Changelog <span>06</span>
            </button>
            <button type="button">
              Resources <span>14</span>
            </button>
            <div className="canonical-card">
              <span>CANONICAL</span>
              <strong>ProseMirror JSON</strong>
              <small>Git export enabled</small>
            </div>
          </aside>
          <section className="hybrid-editor">
            <div className="document-meta">
              <span>GUIDE / QUICKSTART</span>
              <span>draft · revision 07</span>
            </div>
            {editor === "rich" ? (
              <div className="hybrid-rich">
                <div className="mini-toolbar">
                  <button type="button">H2</button>
                  <button type="button">Bold</button>
                  <button type="button">Code</button>
                  <button type="button">Callout</button>
                </div>
                <div
                  contentEditable
                  role="textbox"
                  aria-label="Hybrid rich editor 예시"
                  aria-multiline="true"
                  suppressContentEditableWarning
                >
                  <h2>첫 publication adapter 연결하기</h2>
                  <p>
                    project manifest에서 publisher slot을 선택하고, preview
                    verification을 먼저 실행합니다.
                  </p>
                  <pre>epk doctor .</pre>
                </div>
              </div>
            ) : (
              <pre className="source-editor" aria-label="Source editor 예시">
                {`---\ntitle: 첫 publication adapter 연결하기\n---\n\nproject manifest에서 publisher slot을 선택하고,\npreview verification을 먼저 실행합니다.\n\n\`\`\`sh\nepk doctor .\n\`\`\``}
              </pre>
            )}
          </section>
          <aside className="adapter-panel">
            <small>OUTPUT ADAPTERS</small>
            {[
              ["web", "Web reader", "semantic-html@1"],
              ["git", "Git export", "git-sync@1"],
              ["pdf", "PDF", "paged-output@1"],
              ["api", "JSON API", "structured-export@1"],
            ].map(([id, label, implementation]) => {
              const enabled = outputs.includes(id ?? "");
              return (
                <button
                  type="button"
                  className={`adapter-toggle${enabled ? " is-enabled" : ""}`}
                  key={id}
                  onClick={() => toggleOutput(id ?? "")}
                  aria-pressed={enabled}
                >
                  <span>{enabled ? "ON" : "OFF"}</span>
                  <div>
                    <strong>{label}</strong>
                    <small>{implementation}</small>
                  </div>
                </button>
              );
            })}
            <div className="adapter-summary">
              <span>{outputs.length}</span>
              <p>개의 output이 같은 revision을 사용합니다.</p>
            </div>
          </aside>
        </div>
      </div>
    </DemoFrame>
  );
}

function ProfileDemo({ profile }: { readonly profile: ProfileDefinition }) {
  switch (profile.id) {
    case "wiki-web":
      return <WikiDemo profile={profile} />;
    case "manual-portal":
      return <ManualDemo profile={profile} />;
    case "technical-atlas":
      return <AtlasDemo profile={profile} />;
    case "local-tutorial":
      return <LocalDemo profile={profile} />;
    case "hybrid-docs":
      return <HybridDemo profile={profile} />;
  }
}

export function ProfileGallery({
  selectedProfileId,
  onSelect,
  onAdopt,
  onBack,
}: ProfileGalleryProps) {
  const profile = getProfile(selectedProfileId);
  if (profile === undefined) {
    return null;
  }
  const presentation = PROFILE_PRESENTATIONS[selectedProfileId];

  return (
    <main className="gallery page-shell" data-testid="profile-gallery">
      <div className="gallery-heading">
        <div>
          <span className="section-kicker">Interactive profile lab</span>
          <h1>설명을 읽지 말고, 먼저 만져보세요.</h1>
          <p>
            모든 화면은 개념 증명입니다. 버튼을 눌러 각 profile이 편집·제안·계정·
            자산·게시를 어디에 두는지 확인하세요.
          </p>
        </div>
        <button className="button ghost" type="button" onClick={onBack}>
          ← 추천으로 돌아가기
        </button>
      </div>

      <div className="profile-tabs" role="tablist" aria-label="Profile 선택">
        {PROFILE_IDS.map((profileId) => {
          const item = PROFILE_PRESENTATIONS[profileId];
          const selected = profileId === selectedProfileId;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={selected}
              className={selected ? "is-selected" : ""}
              key={profileId}
              onClick={() => onSelect(profileId)}
              style={
                {
                  "--profile-accent": item.accent,
                  "--profile-soft": item.soft,
                } as React.CSSProperties
              }
            >
              <span>{item.monogram}</span>
              <div>
                <strong>{item.shortName}</strong>
                <small>{item.eyebrow}</small>
              </div>
            </button>
          );
        })}
      </div>

      <section
        className="profile-context"
        style={
          {
            "--profile-accent": presentation.accent,
            "--profile-soft": presentation.soft,
          } as React.CSSProperties
        }
      >
        <div className="context-main">
          <span>{presentation.eyebrow}</span>
          <h2>{presentation.promise}</h2>
          <p>{presentation.scenario}</p>
        </div>
        <div className="context-capabilities">
          {profile.capabilities.slice(0, 7).map((capability) => (
            <span key={capability}>
              {CAPABILITY_LABELS[capability] ?? capability}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="button primary"
          onClick={() => onAdopt(profile.id)}
        >
          {presentation.shortName} 채택
        </button>
      </section>

      <ProfileDemo profile={profile} />

      <section className="gallery-notes">
        <article>
          <span className="section-kicker">기본 adapter</span>
          <ul>
            {profile.adapters.map((adapter) => (
              <li key={adapter.id}>
                <span>{adapter.slot}</span>
                <strong>{adapter.implementation}</strong>
              </li>
            ))}
          </ul>
        </article>
        <article>
          <span className="section-kicker">지켜야 할 경계</span>
          <ol>
            {profile.constraints.map((constraint) => (
              <li key={constraint}>{constraint}</li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}
