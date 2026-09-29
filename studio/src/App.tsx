import { useEffect, useMemo, useState } from "react";
import {
  PROFILE_IDS,
  type ProfileId,
} from "../../src/contracts.js";
import {
  INTERVIEW_QUESTIONS,
  isInterviewComplete,
  recommendFromInterview,
  type InterviewAnswers,
  type InterviewQuestion,
} from "../../src/interview.js";
import { AdoptionView } from "./components/AdoptionView.js";
import { InterviewFlow } from "./components/InterviewFlow.js";
import { ProfileGallery } from "./components/ProfileGallery.js";
import { ResultsView } from "./components/ResultsView.js";
import { Welcome } from "./components/Welcome.js";

type View = "welcome" | "interview" | "results" | "gallery" | "adopt";

interface StudioSession {
  readonly version: 1;
  readonly projectName: string;
  readonly projectId: string;
  readonly purpose: string;
  readonly answers: InterviewAnswers;
  readonly selectedProfileId: ProfileId;
}

const STORAGE_KEY = "epk-profile-studio:v1";

const DEFAULT_SESSION: StudioSession = {
  version: 1,
  projectName: "새 출판 프로젝트",
  projectId: "new-publishing-project",
  purpose: "",
  answers: {},
  selectedProfileId: "hybrid-docs",
};

function isProfileId(value: unknown): value is ProfileId {
  return (
    typeof value === "string" &&
    PROFILE_IDS.includes(value as (typeof PROFILE_IDS)[number])
  );
}

function sanitizeAnswers(value: unknown): InterviewAnswers {
  if (typeof value !== "object" || value === null) {
    return {};
  }
  const candidate = value as Record<string, unknown>;
  const sanitized: Record<string, readonly string[]> = {};
  for (const question of INTERVIEW_QUESTIONS) {
    const raw = candidate[question.id];
    if (!Array.isArray(raw)) {
      continue;
    }
    const valid = raw.filter(
      (optionId): optionId is string =>
        typeof optionId === "string" &&
        question.options.some((option) => option.id === optionId),
    );
    if (valid.length > 0) {
      sanitized[question.id] = question.multiple ? valid : valid.slice(0, 1);
    }
  }
  return sanitized as InterviewAnswers;
}

function loadSession(): StudioSession {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as
      | Partial<StudioSession>
      | null;
    if (stored?.version !== 1) {
      return DEFAULT_SESSION;
    }
    return {
      version: 1,
      projectName:
        typeof stored.projectName === "string"
          ? stored.projectName
          : DEFAULT_SESSION.projectName,
      projectId:
        typeof stored.projectId === "string"
          ? stored.projectId
          : DEFAULT_SESSION.projectId,
      purpose:
        typeof stored.purpose === "string"
          ? stored.purpose
          : DEFAULT_SESSION.purpose,
      answers: sanitizeAnswers(stored.answers),
      selectedProfileId: isProfileId(stored.selectedProfileId)
        ? stored.selectedProfileId
        : DEFAULT_SESSION.selectedProfileId,
    };
  } catch {
    return DEFAULT_SESSION;
  }
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
  return slug.length > 0 ? slug : "new-publishing-project";
}

function firstUnanswered(answers: InterviewAnswers): number {
  const index = INTERVIEW_QUESTIONS.findIndex(
    (question) => (answers[question.id]?.length ?? 0) === 0,
  );
  return index === -1 ? INTERVIEW_QUESTIONS.length - 1 : index;
}

export function App() {
  const [session, setSession] = useState<StudioSession>(loadSession);
  const [view, setView] = useState<View>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    firstUnanswered(session.answers),
  );
  const result = useMemo(
    () =>
      recommendFromInterview({
        purpose: session.purpose,
        answers: session.answers,
      }),
    [session.answers, session.purpose],
  );
  const complete = isInterviewComplete(session.answers);
  const hasProgress = result.answeredQuestions > 0;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const updateSession = (patch: Partial<StudioSession>) => {
    setSession((current) => ({ ...current, ...patch }));
  };

  const startInterview = () => {
    setCurrentQuestion(firstUnanswered(session.answers));
    setView("interview");
  };

  const answerQuestion = (
    question: InterviewQuestion,
    optionId: string,
  ) => {
    setSession((current) => {
      const selected = current.answers[question.id] ?? [];
      const nextSelected = question.multiple
        ? selected.includes(optionId)
          ? selected.filter((item) => item !== optionId)
          : [...selected, optionId]
        : [optionId];
      return {
        ...current,
        answers: {
          ...current.answers,
          [question.id]: nextSelected,
        },
      };
    });
  };

  const nextQuestion = () => {
    if (currentQuestion >= INTERVIEW_QUESTIONS.length - 1) {
      const selectedProfileId =
        result.recommendations[0]?.profile.id ?? "hybrid-docs";
      updateSession({ selectedProfileId });
      setView("results");
      window.scrollTo({ top: 0 });
      return;
    }
    setCurrentQuestion((current) => current + 1);
    window.scrollTo({ top: 0 });
  };

  const previousQuestion = () => {
    if (currentQuestion === 0) {
      setView("welcome");
      return;
    }
    setCurrentQuestion((current) => current - 1);
  };

  const selectProfile = (profileId: ProfileId) => {
    updateSession({ selectedProfileId: profileId });
  };

  const openGallery = (profileId = session.selectedProfileId) => {
    selectProfile(profileId);
    setView("gallery");
    window.scrollTo({ top: 0 });
  };

  const openAdoption = (profileId = session.selectedProfileId) => {
    selectProfile(profileId);
    setView("adopt");
    window.scrollTo({ top: 0 });
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(DEFAULT_SESSION);
    setCurrentQuestion(0);
    setView("welcome");
  };

  const changeProjectName = (projectName: string) => {
    updateSession({
      projectName,
      projectId: slugify(projectName),
    });
  };

  return (
    <div className="app">
      <header className="site-header">
        <button
          type="button"
          className="brand-button"
          onClick={() => setView("welcome")}
          aria-label="Profile Studio 시작 화면"
        >
          <span>EPK</span>
          <div>
            <strong>Profile Studio</strong>
            <small>local adoption lab</small>
          </div>
        </button>
        <nav aria-label="Studio 주요 단계">
          <button
            type="button"
            className={view === "interview" ? "is-active" : ""}
            onClick={startInterview}
          >
            1. 인터뷰
          </button>
          <button
            type="button"
            className={
              view === "results" || view === "gallery" ? "is-active" : ""
            }
            onClick={() =>
              complete ? setView("results") : openGallery()
            }
          >
            2. 비교·체험
          </button>
          <button
            type="button"
            className={view === "adopt" ? "is-active" : ""}
            onClick={() => openAdoption()}
          >
            3. 채택
          </button>
        </nav>
        <div className="header-actions">
          <span className="local-badge">
            <i />
            LOCAL
          </span>
          {hasProgress ? (
            <button type="button" className="reset-button" onClick={reset}>
              초기화
            </button>
          ) : null}
        </div>
      </header>

      {view === "welcome" ? (
        <Welcome
          projectName={session.projectName}
          purpose={session.purpose}
          hasProgress={hasProgress}
          onProjectNameChange={changeProjectName}
          onPurposeChange={(purpose) => updateSession({ purpose })}
          onStart={startInterview}
          onBrowse={() => openGallery()}
        />
      ) : null}

      {view === "interview" ? (
        <InterviewFlow
          answers={session.answers}
          currentQuestion={currentQuestion}
          result={result}
          onAnswer={answerQuestion}
          onBack={previousQuestion}
          onNext={nextQuestion}
          onJump={setCurrentQuestion}
        />
      ) : null}

      {view === "results" ? (
        <ResultsView
          result={result}
          selectedProfileId={session.selectedProfileId}
          onSelect={selectProfile}
          onTry={openGallery}
          onAdopt={openAdoption}
          onEditAnswers={() => {
            setCurrentQuestion(0);
            setView("interview");
          }}
        />
      ) : null}

      {view === "gallery" ? (
        <ProfileGallery
          selectedProfileId={session.selectedProfileId}
          onSelect={selectProfile}
          onAdopt={openAdoption}
          onBack={() => setView(complete ? "results" : "welcome")}
        />
      ) : null}

      {view === "adopt" ? (
        <AdoptionView
          profileId={session.selectedProfileId}
          projectName={session.projectName}
          projectId={session.projectId}
          onProjectNameChange={changeProjectName}
          onProjectIdChange={(projectId) => updateSession({ projectId })}
          onBack={() => setView(complete ? "results" : "gallery")}
          onTryProfile={() => openGallery()}
        />
      ) : null}

      <footer className="site-footer">
        <p>
          Editorial Publishing Kit · profile은 시작점이고, 차이는 manifest
          overlay로 남습니다.
        </p>
        <span>v0.1 studio preview · no remote data</span>
      </footer>
    </div>
  );
}
