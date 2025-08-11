// import React from "react";

// export default function Navbar() {
//   return (
//     <nav className="navbar navbar-dark bg-dark px-3">
//       <span className="navbar-brand mb-0 h1">📄 NotebookLM Clone</span>
//     </nav>
//   );
// }

import React from "react";

export default function Navbar({ mode, toggleMode }) {
  return (
    <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">
      <span className="navbar-brand mb-0 h1">📄 NotebookLM Clone</span>

      {/* Toggle Button */}
      <div className="form-check form-switch text-light">
        <input
          className="form-check-input"
          type="checkbox"
          id="modeToggle"
          checked={mode === "scroll"}
          onChange={toggleMode}
        />
        <label className="form-check-label" htmlFor="modeToggle">
          {mode === "page" ? "Scroll Mode" : "Page Mode"}
        </label>
      </div>
    </nav>
  );
}

