import { useMemo, useState } from "react";
import type { ProfileId } from "../../../src/contracts.js";
import {
  composeManifest,
  formatManifest,
  validateManifest,
} from "../../../src/manifest.js";
import { getProfile } from "../../../src/profiles.js";
import {
  CAPABILITY_LABELS,
  PROFILE_PRESENTATIONS,
} from "../profilePresentation.js";

interface AdoptionViewProps {
  readonly profileId: ProfileId;
  readonly projectName: string;
  readonly projectId: string;
  readonly onProjectNameChange: (value: string) => void;
  readonly onProjectIdChange: (value: string) => void;
  readonly onBack: () => void;
  readonly onTryProfile: () => void;
}

type CopyState = "idle" | "command" | "manifest" | "failed";

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", "'\"'\"'")}'`;
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard !== undefined) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) {
    throw new Error("Clipboard copy was rejected.");
  }
}

export function AdoptionView({
  profileId,
  projectName,
  projectId,
  onProjectNameChange,
  onProjectIdChange,
  onBack,
  onTryProfile,
}: AdoptionViewProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [adopted, setAdopted] = useState(false);
  const profile = getProfile(profileId);
  const presentation = PROFILE_PRESENTATIONS[profileId];
  const manifest = useMemo(
    () =>
      composeManifest({
        id: projectId,
        name: projectName.trim() || "New Publishing Project",
        profile: profileId,
      }),
    [profileId, projectId, projectName],
  );
  const manifestIssues = useMemo(() => validateManifest(manifest), [manifest]);
  const blockingIssues = manifestIssues.filter(
    (issue) => issue.severity === "error",
  );
  const manifestText = useMemo(() => formatManifest(manifest), [manifest]);
  const command = `epk init ${shellQuote(`./${projectId || "new-project"}`)} --name ${shellQuote(
    projectName.trim() || "New Publishing Project",
  )} --profile ${profileId}`;

  if (profile === undefined) {
    return null;
  }

  const handleCopy = async (
    value: string,
    nextState: Exclude<CopyState, "idle" | "failed">,
  ) => {
    try {
      await copyText(value);
      setCopyState(nextState);
    } catch {
      setCopyState("failed");
    }
  };

  const downloadManifest = () => {
    if (blockingIssues.length > 0) {
      return;
    }
    const url = URL.createObjectURL(
      new Blob([manifestText], { type: "application/json;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "publishing.project.json";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="adoption page-shell" data-testid="adoption-view">
      <div className="adoption-heading">
        <div>
          <span className="section-kicker">Adoption desk</span>
          <h1>선택을 실행 가능한 프로젝트 계약으로 바꿉니다.</h1>
          <p>
            이름과 ID를 확인한 뒤 명령을 복사하거나 manifest를 내려받으세요.
            실제 scaffold는 기존 파일을 덮어쓰지 않습니다.
          </p>
        </div>
        <button type="button" className="button ghost" onClick={onBack}>
          ← 선택 다시 보기
        </button>
      </div>

      <div
        className="adoption-grid"
        style={
          {
            "--profile-accent": presentation.accent,
            "--profile-soft": presentation.soft,
          } as React.CSSProperties
        }
      >
        <section className="adoption-summary">
          <div className="adoption-profile">
            <span>{presentation.monogram}</span>
            <div>
              <small>{presentation.eyebrow}</small>
              <h2>{presentation.shortName}</h2>
            </div>
          </div>
          <p>{presentation.promise}</p>
          <button type="button" className="text-button" onClick={onTryProfile}>
            UI 예시를 한 번 더 체험하기 →
          </button>

          <div className="adoption-form">
            <label>
              <span>프로젝트 이름</span>
              <input
                value={projectName}
                onChange={(event) => {
                  onProjectNameChange(event.target.value);
                  setAdopted(false);
                }}
              />
            </label>
            <label>
              <span>프로젝트 ID</span>
              <input
                value={projectId}
                aria-invalid={blockingIssues.length > 0}
                onChange={(event) => {
                  onProjectIdChange(event.target.value);
                  setAdopted(false);
                }}
              />
              <small>소문자, 숫자와 하이픈을 사용하세요.</small>
            </label>
          </div>

          <div className="contract-health" aria-live="polite">
            <span className={blockingIssues.length === 0 ? "is-valid" : "is-invalid"}>
              {blockingIssues.length === 0 ? "✓ 계약 유효" : "계약 수정 필요"}
            </span>
            {blockingIssues.map((issue) => (
              <p key={`${issue.path}-${issue.code}`}>
                {issue.path}: {issue.message}
              </p>
            ))}
          </div>

          <div className="adoption-capabilities">
            <small>ENABLED CAPABILITIES</small>
            <div>
              {profile.capabilities.map((capability) => (
                <span key={capability}>
                  {CAPABILITY_LABELS[capability] ?? capability}
                </span>
              ))}
            </div>
          </div>

          <div className="adapter-plan">
            <small>ADAPTER PLAN</small>
            <ul>
              {profile.adapters.map((adapter) => (
                <li key={adapter.id}>
                  <span>{adapter.slot}</span>
                  <strong>{adapter.implementation}</strong>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="adoption-output">
          <div className="output-block">
            <div className="output-head">
              <div>
                <small>01 · SCAFFOLD COMMAND</small>
                <strong>터미널에서 프로젝트 생성</strong>
              </div>
              <button
                type="button"
                onClick={() => void handleCopy(command, "command")}
                data-testid="copy-command"
              >
                {copyState === "command" ? "복사됨 ✓" : "명령 복사"}
              </button>
            </div>
            <pre>
              <code>{command}</code>
            </pre>
          </div>

          <div className="output-block manifest-output">
            <div className="output-head">
              <div>
                <small>02 · PROJECT CONTRACT</small>
                <strong>publishing.project.json</strong>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => void handleCopy(manifestText, "manifest")}
                  data-testid="copy-manifest"
                >
                  {copyState === "manifest" ? "복사됨 ✓" : "JSON 복사"}
                </button>
                <button
                  type="button"
                  disabled={blockingIssues.length > 0}
                  onClick={downloadManifest}
                  data-testid="download-manifest"
                >
                  다운로드
                </button>
              </div>
            </div>
            <pre tabIndex={0}>
              <code>{manifestText}</code>
            </pre>
          </div>

          {copyState === "failed" ? (
            <p className="copy-failure" role="alert">
              브라우저가 clipboard 접근을 막았습니다. 코드 영역에서 직접 복사해
              주세요.
            </p>
          ) : null}

          <div className={`adoption-confirm${adopted ? " is-adopted" : ""}`}>
            <div>
              <small>03 · LOCAL DECISION</small>
              <strong>
                {adopted
                  ? `${presentation.shortName}을 이 장치에서 채택했습니다.`
                  : "이 선택을 로컬에 기록할까요?"}
              </strong>
              <p>
                원격 저장이나 저장소 생성은 하지 않습니다. 실제 scaffold를 실행할
                때 파일이 만들어집니다.
              </p>
            </div>
            <button
              type="button"
              className="button primary"
              disabled={blockingIssues.length > 0}
              onClick={() => setAdopted(true)}
              data-testid="confirm-adoption"
            >
              {adopted ? "채택 완료 ✓" : "이 profile로 결정"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
