import { Show, onMount, onCleanup } from "solid-js";

/**
 * Custom title bar for Electron builds.
 * Only renders when running inside Electron.
 */
export function ElectronTitleBar() {
  let maximizeBtn!: HTMLButtonElement;

  const isElectron = !!(window as any).electronAPI?.isElectron;
  const api = (window as any).electronAPI;

  onMount(() => {
    if (!isElectron || !api) return;

    // Add padding for the title bar
    document.body.style.paddingTop = "36px";

    // Update maximize button state
    const updateMaxState = async () => {
      if (!maximizeBtn) return;
      const maximized = await api.isMaximized();
      maximizeBtn.dataset.maximized = maximized ? "true" : "false";
    };

    // Check on mount
    updateMaxState();

    // Listen for maximize/unmaximize events
    window.addEventListener("resize", updateMaxState);
    onCleanup(() => window.removeEventListener("resize", updateMaxState));
  });

  return (
    <Show when={isElectron}>
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          height: "36px",
          "z-index": "99999",
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
          "background-color": "#0d1117",
          "-webkit-app-region": "drag",
          "user-select": "none",
          padding: "0 8px",
          "border-bottom": "1px solid #1e2128",
        }}
      >
        {/* App title */}
        <div
          style={{
            display: "flex",
            "align-items": "center",
            gap: "8px",
            "padding-left": "8px",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              "font-size": "13px",
              "font-weight": "600",
              "letter-spacing": "0.3px",
              opacity: "0.9",
            }}
          >
            Limyrx Chat
          </span>
        </div>

        {/* Window controls */}
        <div
          style={{
            display: "flex",
            "align-items": "center",
            height: "100%",
            "-webkit-app-region": "no-drag",
          }}
        >
          <button
            onClick={() => api?.minimize()}
            style={{
              width: "46px",
              height: "36px",
              border: "none",
              background: "transparent",
              color: "#8b949e",
              cursor: "pointer",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              transition: "background 0.15s, color 0.15s",
              "font-size": "16px",
              padding: "0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1e2128";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#8b949e";
            }}
            title="Minimize"
          >
            <svg width="12" height="1" viewBox="0 0 12 1" fill="currentColor">
              <rect width="12" height="1" />
            </svg>
          </button>
          <button
            ref={maximizeBtn}
            onClick={() => api?.maximize()}
            style={{
              width: "46px",
              height: "36px",
              border: "none",
              background: "transparent",
              color: "#8b949e",
              cursor: "pointer",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              transition: "background 0.15s, color 0.15s",
              "font-size": "16px",
              padding: "0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1e2128";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#8b949e";
            }}
            title="Maximize"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="0.5" y="0.5" width="9" height="9" />
            </svg>
          </button>
          <button
            onClick={() => api?.close()}
            style={{
              width: "46px",
              height: "36px",
              border: "none",
              background: "transparent",
              color: "#8b949e",
              cursor: "pointer",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              transition: "background 0.15s, color 0.15s",
              "font-size": "16px",
              padding: "0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e81123";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#8b949e";
            }}
            title="Close"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.2">
              <line x1="0" y1="0" x2="10" y2="10" />
              <line x1="10" y1="0" x2="0" y2="10" />
            </svg>
          </button>
        </div>
      </div>
    </Show>
  );
}
