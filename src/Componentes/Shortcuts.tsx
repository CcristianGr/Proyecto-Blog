import React, { useEffect } from "react";

type Props = { onKey: (cmd: "new"|"home"|"articles"|"theme"|"help") => void };

const Shortcuts: React.FC<Props> = ({ onKey }) => {
  useEffect(() => {
    let chain = "";
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      // Comandos simples
      if (k === "n") { onKey("new"); return; }
      if (k === "k") { onKey("theme"); return; }
      if (k === "?") { onKey("help"); return; }

      // Comandos en cadena: g h / g a
      chain = (chain + k).slice(-2);
      if (chain === "gh") { onKey("home"); chain=""; return; }
      if (chain === "ga") { onKey("articles"); chain=""; return; }
    };
    window.addEventListener("keydown", onDown);
    return () => window.removeEventListener("keydown", onDown);
  }, [onKey]);

  return null;
};

export default Shortcuts;
