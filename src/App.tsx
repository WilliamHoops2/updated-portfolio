import { useCallback, useState } from "react";
import { Contact } from "./components/Contact";
import { Featured } from "./components/Featured";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero, Statement } from "./components/Hero";
import { Interests } from "./components/Interests";
import { Mascot } from "./components/Mascot";
import { Process } from "./components/Process";
import { Updates } from "./components/Updates";
import { WorkList } from "./components/WorkList";
import { useSound } from "./hooks/useSound";
import { useTheme } from "./hooks/useTheme";

interface OpenState {
  id: string | null;
  /** Increments whenever a project is requested, even the one that's already open. */
  tick: number;
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { enabled: soundOn, toggle: toggleSound, tick } = useSound();
  const [open, setOpen] = useState<OpenState>({ id: null, tick: 0 });

  const onHover = () => tick();

  // Open a project in the work list (used by the hero phones and the story "View project" buttons).
  const openProject = useCallback((id: string) => setOpen((s) => ({ id, tick: s.tick + 1 })), []);

  // Click on a row: open it, or fold it back up if it's already open.
  const toggleProject = useCallback(
    (id: string) =>
      setOpen((s) => (s.id === id ? { id: null, tick: s.tick } : { id, tick: s.tick + 1 })),
    [],
  );

  const closeProject = useCallback(() => setOpen((s) => ({ id: null, tick: s.tick })), []);

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        soundOn={soundOn}
        onToggleSound={toggleSound}
        onHover={onHover}
      />
      <main>
        <Hero onOpen={openProject} onHover={onHover} />
        <Statement />
        <Featured onOpen={openProject} onHover={onHover} />
        <Interests />
        <Process />
        <WorkList
          openId={open.id}
          scrollTick={open.tick}
          onToggle={toggleProject}
          onClose={closeProject}
          onHover={onHover}
        />
        <Updates />
        <Contact />
      </main>
      <Footer />
      <Mascot />
    </>
  );
}
