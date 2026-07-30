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
import { CompatibilityPanel } from "./CompatibilityPanel.js";
import {
  ExperienceMission,
  ProfileGuide,
} from "./ProfileGuide.js";

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
  const [draft, setDraft] = useState({
    title: "분쇄도는 흐름의 언어입니다.",
    body:
      "미세한 분쇄는 표면적을 늘려 용출 속도를 높입니다. 다만 흐름이 막히면 채널링이 생길 수 있으므로, 맛과 유량을 함께 기록하세요.",
  });
  const [published, setPublished] = useState(draft);
  const [editSummary, setEditSummary] = useState("관찰 기준을 더 명확하게 설명");
  const [proposal, setProposal] = useState(
    "‘채널링’의 관찰 기준을 한 문장 추가하면 좋겠습니다.",
  );
  const [revision, setRevision] = useState(42);
  const [proposalCount, setProposalCount] = useState(0);
  const [notice, setNotice] = useState("Revision 42 · 현재 reader와 동기화됨");
  const [history, setHistory] = useState([
    "문장 흐름 정리",
    "분쇄 사진 교체",
    "초안 공개",
  ]);

  const saveRevision = () => {
    if (draft.title.trim().length === 0 || draft.body.trim().length === 0) {
      setNotice("제목과 본문을 모두 작성해야 저장할 수 있습니다.");
      return;
    }
    const nextRevision = revision + 1;
    setPublished({
      title: draft.title.trim(),
      body: draft.body.trim(),
    });
    setRevision(nextRevision);
    setHistory((current) => [
      editSummary.trim() || "편집 요약 없음",
      ...current,
    ]);
    setNotice(`Revision ${nextRevision} 저장됨 · reader preview 갱신`);
    setMode("read");
  };

  const startNewArticle = () => {
    setDraft({
      title: "새 지식 문서",
      body: "이 문서에서 독자가 가장 먼저 알아야 할 사실을 작성해 보세요.",
    });
    setEditSummary("새 문서 초안 작성");
    setNotice("새 문서 초안 · 아직 게시되지 않음");
    setMode("edit");
  };

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
            <button type="button" className="wiki-new" onClick={startNewArticle}>
              + 새 글
            </button>
          </nav>
        </header>
        <div className="wiki-grid">
          <aside className="wiki-tree" aria-label="Wiki 목차">
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
            {mode === "edit" ? (
              <div className="rich-editor wiki-writing-room">
                <div className="mini-toolbar" aria-label="Rich editor 도구막대">
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        body: `${current.body}\n\n새 소제목\n설명을 이어서 작성하세요.`,
                      }))
                    }
                  >
                    H2 추가
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        body: `${current.body}\n\n핵심: 독자가 기억해야 할 문장을 작성하세요.`,
                      }))
                    }
                  >
                    핵심 문장
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        body: `${current.body}\n관련 문서: https://example.com`,
                      }))
                    }
                  >
                    Link 추가
                  </button>
                  <span />
                  <small>로컬 초안 · 외부 전송 없음</small>
                </div>
                <label className="wiki-title-field">
                  <span>문서 제목</span>
                  <input
                    value={draft.title}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="wiki-body-field">
                  <span>본문</span>
                  <textarea
                    value={draft.body}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        body: event.target.value,
                      }))
                    }
                    rows={8}
                  />
                </label>
                <div className="wiki-save-row">
                  <label>
                    <span>편집 요약</span>
                    <input
                      value={editSummary}
                      onChange={(event) => setEditSummary(event.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="demo-action"
                    onClick={saveRevision}
                  >
                    Revision 저장
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2>{published.title}</h2>
                <p className="article-lead">
                  같은 원두라도 입자 분포가 달라지면 물이 지나가는 경로와 접촉
                  시간이 함께 바뀝니다.
                </p>
                <p
                  className={`wiki-published-copy${
                    mode === "propose" ? " proposal-selection" : ""
                  }`}
                >
                  {published.body}
                </p>
              </>
            )}
            {mode === "propose" ? (
              <div className="inline-proposal">
                <span>
                  선택 위치 · block b_019fa7 · revision {revision}
                </span>
                <blockquote>{published.body}</blockquote>
                <textarea
                  aria-label="Wiki 수정 제안"
                  value={proposal}
                  onChange={(event) => setProposal(event.target.value)}
                  rows={3}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (proposal.trim().length === 0) {
                      setNotice("제안 내용을 먼저 작성하세요.");
                      return;
                    }
                    const nextProposal = proposalCount + 1;
                    setProposalCount(nextProposal);
                    setNotice(
                      `제안 #${18 + nextProposal} 등록됨 · 본문은 아직 변경되지 않음`,
                    );
                    setMode("read");
                  }}
                >
                  제안 등록
                </button>
              </div>
            ) : null}
          </article>
          <aside className="wiki-history" aria-label="Wiki 변경 이력">
            <small>HISTORY</small>
            <strong aria-live="polite">{notice}</strong>
            {proposalCount > 0 ? (
              <div className="proposal-count">
                <span>{proposalCount}</span>
                <p>검토 대기 제안</p>
              </div>
            ) : null}
            <ol>
              {history.slice(0, 4).map((item, index) => (
                <li key={`${item}-${revision - index}`}>
                  <span>{revision - index}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </DemoFrame>
  );
}

type ManualBlockKind = "heading" | "paragraph" | "checklist" | "callout";

interface ManualBlock {
  readonly id: number;
  readonly kind: ManualBlockKind;
  readonly content: string;
}

const MANUAL_BLOCK_LABELS: Readonly<Record<ManualBlockKind, string>> = {
  heading: "제목",
  paragraph: "본문",
  checklist: "체크리스트",
  callout: "안전 경고",
};

const MANUAL_BLOCK_SEEDS: Readonly<Record<ManualBlockKind, string>> = {
  heading: "새 절차 제목",
  paragraph: "작업자가 따라야 할 절차를 한 단계씩 작성하세요.",
  checklist: "☐ 전원 차단 확인\n☐ 보호구 착용 확인",
  callout: "장비가 완전히 정지하기 전에는 커버를 열지 마세요.",
};

function ManualDemo({ profile }: { readonly profile: ProfileDefinition }) {
  const [role, setRole] = useState<"viewer" | "staff" | "admin">("staff");
  const [assetState, setAssetState] = useState<"empty" | "staged" | "ready">(
    "empty",
  );
  const [title, setTitle] = useState("감속기 점검 절차");
  const [blocks, setBlocks] = useState<readonly ManualBlock[]>([
    {
      id: 1,
      kind: "callout",
      content: "전원을 차단하고 잔류 에너지가 없는지 확인합니다.",
    },
    {
      id: 2,
      kind: "heading",
      content: "1. 외관 상태 기록",
    },
    {
      id: 3,
      kind: "paragraph",
      content:
        "누유, 진동, 비정상 소음을 확인하고 점검표에 현재 상태를 기록합니다.",
    },
  ]);
  const [preview, setPreview] = useState(false);
  const [revision, setRevision] = useState(7);
  const [publishState, setPublishState] = useState<
    "draft" | "saved" | "published"
  >("draft");
  const [accountCount, setAccountCount] = useState(12);
  const canWrite = role !== "viewer";

  const advanceAsset = () => {
    if (!canWrite) {
      return;
    }
    setAssetState((current) =>
      current === "empty" ? "staged" : current === "staged" ? "ready" : "empty",
    );
  };

  const addBlock = (kind: ManualBlockKind) => {
    if (!canWrite) {
      return;
    }
    setBlocks((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((block) => block.id)) + 1,
        kind,
        content: MANUAL_BLOCK_SEEDS[kind],
      },
    ]);
    setPublishState("draft");
  };

  const updateBlock = (id: number, content: string) => {
    setBlocks((current) =>
      current.map((block) =>
        block.id === id ? { ...block, content } : block,
      ),
    );
    setPublishState("draft");
  };

  const saveDraft = () => {
    if (!canWrite) {
      return;
    }
    setRevision((current) => current + 1);
    setPublishState("saved");
  };

  const publish = () => {
    if (role !== "admin" || assetState !== "ready") {
      setPublishState("saved");
      return;
    }
    setRevision((current) => current + 1);
    setPublishState("published");
    setPreview(true);
  };

  return (
    <DemoFrame profile={profile}>
      <div className="manual-demo demo-surface" data-testid="demo-manual-portal">
        <aside className="manual-nav" aria-label="Manual Portal 메뉴">
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
              {preview || !canWrite ? (
                <h2>{title}</h2>
              ) : (
                <label className="manual-title-field">
                  <span className="visually-hidden">매뉴얼 제목</span>
                  <input
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      setPublishState("draft");
                    }}
                  />
                </label>
              )}
            </div>
            <div className="manual-status">
              <span className={`status-${publishState}`}>
                {publishState === "published"
                  ? "게시됨"
                  : publishState === "saved"
                    ? `저장됨 · r${revision}`
                    : "수정 중"}
              </span>
              <button type="button" onClick={() => setPreview((current) => !current)}>
                {preview ? "편집으로" : "미리보기"}
              </button>
              <button type="button" onClick={saveDraft} disabled={!canWrite}>
                초안 저장
              </button>
              <button
                type="button"
                onClick={publish}
                disabled={role !== "admin" || assetState !== "ready"}
                title={
                  role !== "admin"
                    ? "admin 역할이 필요합니다."
                    : assetState !== "ready"
                      ? "asset 검사를 먼저 완료하세요."
                      : "현재 revision을 게시합니다."
                }
              >
                게시
              </button>
            </div>
          </header>
          {!preview ? (
            <div className="manual-toolbar" aria-label="WYSIWYG block 도구막대">
              {(Object.keys(MANUAL_BLOCK_LABELS) as ManualBlockKind[]).map(
                (kind) => (
                  <button
                    type="button"
                    key={kind}
                    onClick={() => addBlock(kind)}
                    disabled={!canWrite}
                  >
                    + {MANUAL_BLOCK_LABELS[kind]}
                  </button>
                ),
              )}
            </div>
          ) : null}
          <div className="manual-canvas">
            {blocks.map((block) => (
              <div
                className={`manual-block manual-block-${block.kind}${
                  preview ? " is-preview" : ""
                }`}
                key={block.id}
              >
                {!preview ? (
                  <span className="block-handle" aria-hidden="true">
                    ⋮⋮
                  </span>
                ) : null}
                <small>{MANUAL_BLOCK_LABELS[block.kind]}</small>
                {preview || !canWrite ? (
                  <p>{block.content}</p>
                ) : (
                  <textarea
                    value={block.content}
                    onChange={(event) =>
                      updateBlock(block.id, event.target.value)
                    }
                    aria-label={`${MANUAL_BLOCK_LABELS[block.kind]} block`}
                    rows={block.kind === "checklist" ? 3 : 2}
                  />
                )}
              </div>
            ))}
            {!preview ? (
              <button
                type="button"
                className="add-block"
                onClick={() => addBlock("paragraph")}
                disabled={!canWrite}
              >
                + 본문 Block 추가
              </button>
            ) : null}
          </div>
        </section>
        <aside className="manual-inspector" aria-label="Manual 운영 도구">
          <div className="inspector-section">
            <small>DEMO ROLE</small>
            <label>
              <span className="visually-hidden">역할 선택</span>
              <select
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value as "viewer" | "staff" | "admin",
                  )
                }
              >
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
          <div className="inspector-section account-demo">
            <small>ACCOUNT MANAGEMENT</small>
            <div>
              <strong>{accountCount}</strong>
              <span>활성 사용자</span>
            </div>
            <button
              type="button"
              onClick={() => setAccountCount((current) => current + 1)}
              disabled={role !== "admin"}
            >
              + 사용자 초대
            </button>
            <p>
              {role === "admin"
                ? "초대 사용자는 기본 viewer로 시작합니다."
                : "admin으로 전환하면 계정 초대를 체험할 수 있습니다."}
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
            <button
              type="button"
              className="demo-action"
              onClick={advanceAsset}
              disabled={!canWrite}
            >
              {assetState === "ready" ? "Demo 초기화" : "다음 단계"}
            </button>
            <p>
              {assetState === "ready"
                ? "검사된 파일만 현재 revision에 attach할 수 있습니다."
                : "업로드 파일은 공개 전까지 private 상태를 유지합니다."}
            </p>
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
  const [view, setView] = useState<"reader" | "source">("reader");
  const [title, setTitle] = useState(
    "Adjoint map은 좌표계 사이의 twist를 옮깁니다.",
  );
  const [body, setBody] = useState(
    "여기서 p̂는 위치 벡터 p의 skew-symmetric matrix이며, body와 spatial convention에 따라 block 순서가 달라집니다.",
  );
  const [proposal, setProposal] = useState(
    "body convention과 spatial convention의 block 순서를 표로 비교해주세요.",
  );
  const [revision, setRevision] = useState(48);
  const [builtOutputs, setBuiltOutputs] = useState<readonly string[]>(["web"]);

  const buildOutput = (output: "pdf" | "epub") => {
    setBuiltOutputs((current) =>
      current.includes(output) ? current : [...current, output],
    );
  };

  const saveSource = () => {
    if (title.trim().length === 0 || body.trim().length === 0) {
      return;
    }
    setTitle(title.trim());
    setBody(body.trim());
    setRevision((current) => current + 1);
    setBuiltOutputs(["web"]);
    setSelected(false);
    setProposalState("draft");
    setView("reader");
  };

  return (
    <DemoFrame profile={profile}>
      <div className="atlas-demo demo-surface" data-testid="demo-technical-atlas">
        <header className="atlas-header">
          <div>
            <small>ROBOTICS MATH ATLAS</small>
            <strong>SE(3) / Adjoint map</strong>
          </div>
          <div className="atlas-downloads">
            <button
              type="button"
              className={builtOutputs.includes("pdf") ? "is-built" : ""}
              onClick={() => buildOutput("pdf")}
            >
              {builtOutputs.includes("pdf") ? "PDF ready ✓" : "PDF build"}
            </button>
            <button
              type="button"
              className={builtOutputs.includes("epub") ? "is-built" : ""}
              onClick={() => buildOutput("epub")}
            >
              {builtOutputs.includes("epub") ? "EPUB ready ✓" : "EPUB build"}
            </button>
            <button
              type="button"
              className={view === "source" ? "is-active" : ""}
              onClick={() =>
                setView((current) =>
                  current === "reader" ? "source" : "reader",
                )
              }
            >
              {view === "reader" ? "Source 편집" : "Reader 보기"}
            </button>
          </div>
        </header>
        <div className="atlas-grid">
          <aside className="atlas-toc" aria-label="Technical Atlas 목차">
            <small>CHAPTER 04</small>
            <ol>
              <li>Lie group 복습</li>
              <li className="is-active">Adjoint 표현</li>
              <li>Twist 변환</li>
              <li>수치 예제</li>
            </ol>
            <div className="build-proof">
              <span>BUILD PROOF</span>
              <strong>{builtOutputs.join(" · ")}</strong>
              <small>source revision r{revision}</small>
            </div>
          </aside>
          <article className="atlas-reader">
            {view === "source" ? (
              <div className="atlas-source-editor">
                <div className="source-path">
                  content/concepts/geometry/adjoint-map.qmd
                </div>
                <label>
                  <span>title</span>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </label>
                <label>
                  <span>QMD body</span>
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    rows={10}
                  />
                </label>
                <div className="source-guard">
                  <span>보호 node</span>
                  <code>
                    $$ Ad_T = [ R\; 0 ; \hat{"{"}p{"}"}R\; R ] $$
                  </code>
                </div>
                <button
                  type="button"
                  className="demo-action"
                  onClick={saveSource}
                >
                  Source 저장 · reader rebuild
                </button>
              </div>
            ) : (
              <>
                <span className="chapter-mark">4.2</span>
                <h2>{title}</h2>
                <p>
                  강체 변환 <code>T ∈ SE(3)</code>가 주어지면 adjoint 표현은
                  body와 spatial 좌표 사이의 선형 변환을 제공합니다.
                </p>
                <div className="math-block">
                  Ad<sub>T</sub> =
                  <span className="matrix">
                    [ R&nbsp;&nbsp; 0 ; p̂R&nbsp;&nbsp; R ]
                  </span>
                </div>
                <button
                  type="button"
                  className={`selectable-paragraph${
                    selected ? " is-selected" : ""
                  }`}
                  onClick={() => {
                    setSelected((current) => !current);
                    setProposalState("draft");
                  }}
                  aria-pressed={selected}
                >
                  {body}
                </button>
                <small className="selection-help">
                  문단을 눌러 정확한 위치 제안 흐름을 체험하세요.
                </small>
              </>
            )}
          </article>
          <aside
            className={`atlas-review${selected && view === "reader" ? " is-open" : ""}`}
            aria-label="Technical Atlas 위치 제안"
          >
            {selected && view === "reader" ? (
              <>
                <small>INLINE PROPOSAL</small>
                <strong>block b_01J4 · revision r{revision}</strong>
                <blockquote>“{body}”</blockquote>
                <label>
                  <span>수정 제안</span>
                  <textarea
                    rows={5}
                    value={proposal}
                    onChange={(event) => {
                      setProposal(event.target.value);
                      setProposalState("draft");
                    }}
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
                  onClick={() => {
                    if (proposal.trim().length > 0) {
                      setProposalState("submitted");
                    }
                  }}
                >
                  {proposalState === "submitted"
                    ? "제안 #27 제출됨 · 본문은 유지"
                    : "제안 검토 요청"}
                </button>
              </>
            ) : (
              <div className="review-empty">
                <span>⌁</span>
                <strong>교정할 문단을 선택하세요.</strong>
                <p>
                  {view === "source"
                    ? "Source를 저장한 뒤 reader에서 문단을 선택하세요."
                    : "선택 위치와 source revision이 함께 고정됩니다."}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </DemoFrame>
  );
}

function LocalDemo({ profile }: { readonly profile: ProfileDefinition }) {
  const [runState, setRunState] = useState<"ready" | "ran" | "published">(
    "ready",
  );
  const [kp, setKp] = useState(80);
  const [kd, setKd] = useState(12);
  const [duration, setDuration] = useState(6);
  const [prediction, setPrediction] = useState(
    "Kp를 높이면 더 빨리 도달하지만 overshoot가 커질 것이다.",
  );
  const [observation, setObservation] = useState(
    "응답 곡선에서 예측과 다른 점을 기록하세요.",
  );
  const [runNumber, setRunNumber] = useState(0);
  const [metrics, setMetrics] = useState({
    overshoot: 0,
    settling: 0,
    peakTorque: 0,
  });

  const markParametersChanged = () => {
    setRunState("ready");
  };

  const runExperiment = () => {
    const safeKp = Math.max(1, kp);
    const safeKd = Math.max(0, kd);
    const nextRun = runNumber + 1;
    setMetrics({
      overshoot: Math.max(
        0,
        Math.round((safeKp / (safeKd + 8) - 2.4) * 6),
      ),
      settling: Number(
        Math.min(duration, Math.max(0.4, 14 / (safeKd + 2))).toFixed(2),
      ),
      peakTorque: Number((safeKp * 0.084 + safeKd * 0.11).toFixed(1)),
    });
    setRunNumber(nextRun);
    setRunState("ran");
  };

  const publishArtifact = () => {
    if (runState === "ran" && observation.trim().length > 0) {
      setRunState("published");
    }
  };

  return (
    <DemoFrame profile={profile}>
      <div className="local-demo demo-surface" data-testid="demo-local-tutorial">
        <aside className="local-sidebar" aria-label="Local Tutorial 단계">
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
            <label className="prediction-field">
              <span>1 · 실행 전 예측</span>
              <textarea
                value={prediction}
                onChange={(event) => setPrediction(event.target.value)}
                rows={2}
              />
            </label>
            <div className="parameter-row">
              <label>
                <span>Kp</span>
                <input
                  type="number"
                  value={kp}
                  min="1"
                  max="300"
                  onChange={(event) => {
                    setKp(Number(event.target.value));
                    markParametersChanged();
                  }}
                />
              </label>
              <label>
                <span>Kd</span>
                <input
                  type="number"
                  value={kd}
                  min="0"
                  max="80"
                  onChange={(event) => {
                    setKd(Number(event.target.value));
                    markParametersChanged();
                  }}
                />
              </label>
              <label>
                <span>duration</span>
                <input
                  type="number"
                  value={duration}
                  min="1"
                  max="20"
                  step="0.5"
                  onChange={(event) => {
                    setDuration(Number(event.target.value));
                    markParametersChanged();
                  }}
                />
              </label>
            </div>
            <button
              type="button"
              className="local-run"
              onClick={runExperiment}
              disabled={prediction.trim().length === 0}
            >
              {runState === "ready" ? "로컬 실습 실행" : "다시 실행"}
            </button>
          </div>
          <div
            className={`local-chart run-${runState}`}
            role="img"
            aria-label="제어 응답 예시 그래프"
            style={
              {
                "--overshoot": `${Math.min(30, metrics.overshoot)}px`,
              } as React.CSSProperties
            }
          >
            <div className="chart-grid" />
            <div className="chart-line target" />
            <div className="chart-line response" />
            <div className="chart-legend">
              <span>— target</span>
              <span>— q1 response</span>
            </div>
          </div>
          {runState !== "ready" ? (
            <div className="run-evidence">
              <div>
                <span>overshoot</span>
                <strong>{metrics.overshoot}%</strong>
              </div>
              <div>
                <span>settling</span>
                <strong>{metrics.settling}s</strong>
              </div>
              <div>
                <span>peak torque</span>
                <strong>{metrics.peakTorque}Nm</strong>
              </div>
            </div>
          ) : null}
        </section>
        <aside className="artifact-panel" aria-label="Local artifact bundle">
          <small>ARTIFACT BUNDLE</small>
          {runState === "ready" ? (
            <div className="artifact-empty">
              <strong>아직 게시된 run이 없습니다.</strong>
              <p>
                예측을 적고 실행하면 관찰 메모와 artifact staging이 열립니다.
              </p>
            </div>
          ) : (
            <>
              <div
                className={`artifact-success${
                  runState === "published" ? " is-verified" : ""
                }`}
              >
                <span>{runState === "published" ? "✓" : "…"}</span>
                <div>
                  <strong>
                    run_demo_{String(runNumber).padStart(3, "0")}
                  </strong>
                  <small>
                    {runState === "published"
                      ? "manifest verified"
                      : "staging · observation 필요"}
                  </small>
                </div>
              </div>
              <label className="observation-field">
                <span>2 · 실행 후 관찰</span>
                <textarea
                  value={observation}
                  onChange={(event) => {
                    setObservation(event.target.value);
                    if (runState === "published") {
                      setRunState("ran");
                    }
                  }}
                  rows={4}
                />
              </label>
              <button
                type="button"
                className="demo-action"
                onClick={publishArtifact}
                disabled={
                  runState === "published" || observation.trim().length === 0
                }
              >
                {runState === "published"
                  ? "Artifact 게시 완료"
                  : "관찰 포함해 로컬 게시"}
              </button>
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
                <li>
                  <span>MD</span> learner-note.md
                </li>
              </ul>
              <div className="checksum">
                {runState === "published"
                  ? `sha256 · d02a…${String(7_000 + runNumber)}`
                  : "checksum · terminal publish 뒤 확정"}
              </div>
            </>
          )}
        </aside>
      </div>
    </DemoFrame>
  );
}

function hybridSource(title: string, body: string): string {
  return `---
title: ${title}
---

${body}

\`\`\`sh
epk doctor .
\`\`\``;
}

function parseHybridSource(source: string): {
  readonly title: string;
  readonly body: string;
} {
  const titleMatch = /^title:\s*(.+)$/mu.exec(source);
  const withoutFrontMatter = source.replace(/^---[\s\S]*?---\s*/u, "");
  const body = withoutFrontMatter.replace(/```[\s\S]*$/u, "").trim();
  return {
    title: titleMatch?.[1]?.trim() || "제목 없는 문서",
    body: body || "본문을 작성하세요.",
  };
}

function HybridDemo({ profile }: { readonly profile: ProfileDefinition }) {
  const [editor, setEditor] = useState<"rich" | "source">("rich");
  const [outputs, setOutputs] = useState(["web", "git"]);
  const [title, setTitle] = useState("첫 publication adapter 연결하기");
  const [body, setBody] = useState(
    "project manifest에서 publisher slot을 선택하고, preview verification을 먼저 실행합니다.",
  );
  const [source, setSource] = useState(() =>
    hybridSource(
      "첫 publication adapter 연결하기",
      "project manifest에서 publisher slot을 선택하고, preview verification을 먼저 실행합니다.",
    ),
  );
  const [revision, setRevision] = useState(7);
  const [buildReceipt, setBuildReceipt] = useState<readonly string[]>([]);

  const toggleOutput = (output: string) => {
    setOutputs((current) =>
      current.includes(output)
        ? current.filter((item) => item !== output)
        : [...current, output],
    );
    setBuildReceipt([]);
  };

  const openSource = () => {
    setSource(hybridSource(title, body));
    setEditor("source");
  };

  const applySource = () => {
    const parsed = parseHybridSource(source);
    setTitle(parsed.title);
    setBody(parsed.body);
    setRevision((current) => current + 1);
    setBuildReceipt([]);
    setEditor("rich");
  };

  const addRichBlock = (kind: "heading" | "bold" | "code" | "callout") => {
    const additions: Readonly<Record<typeof kind, string>> = {
      heading: "\n\n새 섹션\n이 섹션의 목적을 설명하세요.",
      bold: "\n\n핵심: 배포 전에는 항상 preview를 검증합니다.",
      code: "\n\nepk doctor .",
      callout: "\n\n주의: 정본과 output adapter의 책임을 섞지 마세요.",
    };
    setBody((current) => `${current}${additions[kind]}`);
    setBuildReceipt([]);
  };

  const buildPreview = () => {
    if (outputs.length === 0) {
      setBuildReceipt(["출력 adapter를 하나 이상 선택하세요."]);
      return;
    }
    setRevision((current) => current + 1);
    setBuildReceipt(
      outputs.map((output) => `${output} · verified · same revision`),
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
              onClick={editor === "source" ? applySource : undefined}
            >
              Rich
            </button>
            <button
              type="button"
              className={editor === "source" ? "is-active" : ""}
              onClick={editor === "rich" ? openSource : undefined}
            >
              Source
            </button>
          </nav>
          <button
            type="button"
            className="hybrid-preview"
            onClick={buildPreview}
          >
            {buildReceipt.length > 0 ? "Preview 다시 build" : "Preview build"}
          </button>
        </header>
        <div className="hybrid-grid">
          <aside className="hybrid-tree" aria-label="Hybrid Docs 콘텐츠 유형">
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
              <span>draft · revision {String(revision).padStart(2, "0")}</span>
            </div>
            {editor === "rich" ? (
              <div className="hybrid-rich">
                <div className="mini-toolbar">
                  <button
                    type="button"
                    onClick={() => addRichBlock("heading")}
                  >
                    + H2
                  </button>
                  <button type="button" onClick={() => addRichBlock("bold")}>
                    + 핵심
                  </button>
                  <button type="button" onClick={() => addRichBlock("code")}>
                    + Code
                  </button>
                  <button
                    type="button"
                    onClick={() => addRichBlock("callout")}
                  >
                    + Callout
                  </button>
                </div>
                <div className="hybrid-rich-fields">
                  <label>
                    <span>문서 제목</span>
                    <input
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                        setBuildReceipt([]);
                      }}
                    />
                  </label>
                  <label>
                    <span>본문 block</span>
                    <textarea
                      value={body}
                      onChange={(event) => {
                        setBody(event.target.value);
                        setBuildReceipt([]);
                      }}
                      rows={9}
                    />
                  </label>
                  <pre>epk doctor .</pre>
                </div>
              </div>
            ) : (
              <div className="source-editor-wrap">
                <label>
                  <span>Markdown source · Rich로 돌아가면 model에 적용됩니다.</span>
                  <textarea
                    className="source-editor"
                    aria-label="Source editor 예시"
                    value={source}
                    onChange={(event) => {
                      setSource(event.target.value);
                      setBuildReceipt([]);
                    }}
                    rows={15}
                  />
                </label>
                <button
                  type="button"
                  className="demo-action"
                  onClick={applySource}
                >
                  Source 적용 · Rich로 돌아가기
                </button>
              </div>
            )}
            {buildReceipt.length > 0 ? (
              <div className="hybrid-build-receipt" aria-live="polite">
                <strong>PREVIEW RECEIPT · r{revision}</strong>
                <ul>
                  {buildReceipt.map((receipt) => (
                    <li key={receipt}>{receipt}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
          <aside className="adapter-panel" aria-label="Hybrid Docs 출력 adapter">
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
            자산·게시를 어디에 두는지 확인하세요. 체험 데이터는 브라우저 안에서만
            움직이며 새로고침하면 초기화됩니다.
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

      <ExperienceMission presentation={presentation} />
      <ProfileDemo profile={profile} />
      <ProfileGuide presentation={presentation} />

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

      <CompatibilityPanel />
    </main>
  );
}
