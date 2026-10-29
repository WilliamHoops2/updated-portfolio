import { Contact } from "./components/Contact";
import { Featured } from "./components/Featured";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero, Statement } from "./components/Hero";
import { Process } from "./components/Process";
import { StatusBar } from "./components/StatusBar";
import { WorkList } from "./components/WorkList";
import { useSound } from "./hooks/useSound";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { enabled: soundOn, toggle: toggleSound, tick } = useSound();

  const onHover = () => tick();

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
        <Hero />
        <Statement />
        <Featured onHover={onHover} />
        <Process />
        <WorkList onHover={onHover} />
        <Contact />
      </main>
      <Footer />
      <StatusBar />
    </>
  );
}
