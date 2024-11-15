import React from "react";
import FloatingMenu from "./FloatingMenu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        <FloatingMenu />
      </header>
      <main className="p-6 border border-gray-500 rounded-lg shadow-md mt-4 min-h-lvh max-w-screen-2xl mx-auto bg-white">
        {children}
      </main>
    </div>
  );
};

export default Layout;
