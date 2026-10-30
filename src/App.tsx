import { useCallback, useState } from "react";
import { Contact } from "./components/Contact";
import { Featured } from "./components/Featured";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero, Statement } from "./components/Hero";
import { Process } from "./components/Process";
import { ProjectModal } from "./components/ProjectModal";
import { StatusBar } from "./components/StatusBar";
import { WorkList } from "./components/WorkList";
import { useSound } from "./hooks/useSound";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { enabled: soundOn, toggle: toggleSound, tick } = useSound();
  const [openId, setOpenId] = useState<string | null>(null);

  const onHover = () => tick();
  const onOpen = useCallback((id: string) => setOpenId(id), []);
  const onClose = useCallback(() => setOpenId(null), []);

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
        <Hero onOpen={onOpen} onHover={onHover} />
        <Statement />
        <Featured onOpen={onOpen} onHover={onHover} />
        <Process />
        <WorkList onOpen={onOpen} onHover={onHover} />
        <Contact />
      </main>
      <Footer />
      <StatusBar />
      <ProjectModal projectId={openId} onClose={onClose} onNavigate={onOpen} />
    </>
  );
}
