import { About } from "./components/About";
import { CaseView } from "./components/CaseView";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Interests } from "./components/Interests";
import { ordered } from "./components/mediaShape";
import { Reel } from "./components/Reel";
import { Services } from "./components/Services";
import { Toolkit } from "./components/Toolkit";
import { Work } from "./components/Work";
import { useCase } from "./hooks/useCase";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

export default function App() {
  useSmoothScroll();
  const { id: caseId, open: openCase, go: goCase, close: closeCase } = useCase();

  // The open project comes from the URL (#work/<id>), so it can be linked to.
  const activeProject = caseId ? ordered.find((project) => project.id === caseId) : undefined;

  return (
    <>
      <Header inert={!!activeProject} />
      {/* `contents` keeps these out of the legacy `main > section` padding rule */}
      <main inert={!!activeProject}>
        <div className="contents">
          <Hero />
          <About />
          <Toolkit />
          <Work onOpen={openCase} />
          <Reel onOpen={openCase} />
          <Services />
        </div>
        <Interests />
        <div className="contents">
          <Contact />
        </div>
      </main>
      <Footer inert={!!activeProject} />
      {activeProject && <CaseView project={activeProject} onClose={closeCase} onGo={goCase} />}
    </>
  );
}
