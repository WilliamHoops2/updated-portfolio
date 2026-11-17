import { useCallback, useState } from "react";
import { CaseView } from "./components/CaseView";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero, Statement } from "./components/Hero";
import { Interests } from "./components/Interests";
import { Loader, shouldSkipLoader } from "./components/Loader";
import { ordered } from "./components/mediaShape";
import { WorkIndex } from "./components/WorkIndex";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { useMagnetic } from "./hooks/useMagnetic";
import { useCase } from "./hooks/useCase";
import { useSound } from "./hooks/useSound";

type Phase = "loading" | "leaving" | "done";

export default function App() {
  useMagnetic();
  useSmoothScroll();
  const { enabled: soundOn, toggle: toggleSound, tick } = useSound();
  const { id: caseId, open: openCase, go: goCase, close: closeCase } = useCase();
  const [phase, setPhase] = useState<Phase>(() => (shouldSkipLoader() ? "done" : "loading"));

  const onHover = () => tick();

  const startLeaving = useCallback(() => setPhase("leaving"), []);
  const finishLoading = useCallback(() => setPhase("done"), []);

  // The open project comes from the URL (#work/<id>), so it can be linked to.
  const activeProject = caseId ? ordered.find((project) => project.id === caseId) : undefined;

  return (
    <>
      {phase !== "done" && <Loader onLeave={startLeaving} onDone={finishLoading} />}
      <Header
        soundOn={soundOn}
        onToggleSound={toggleSound}
        onHover={onHover}
      />
      <main>
        <Hero ready={phase !== "loading"} onHover={onHover} />
        <WorkIndex onOpen={openCase} onHover={onHover} />
        <Statement />
        <Interests />
        <Contact />
      </main>
      <Footer />
      {activeProject && <CaseView project={activeProject} onClose={closeCase} onGo={goCase} />}
    </>
  );
}
