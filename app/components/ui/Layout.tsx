import React from "react";
import { applySavedTheme } from "~/utils/theme";
import FloatingMenu from "./FloatingMenu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  applySavedTheme();

  return (
    <div id="layout">
      <header>
        <FloatingMenu />
      </header>
      <main className="main-container">
        {children}
      </main>
    </div>
  );
};

export default Layout;
