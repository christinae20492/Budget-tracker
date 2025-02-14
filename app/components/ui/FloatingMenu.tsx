import React, { useEffect, useState } from "react";
import { toggleTheme } from "~/utils/theme";
import { Link } from "@remix-run/react";
import {
  HomeOutlined,
  InsertRowAboveOutlined,
  MailOutlined,
  PieChartOutlined,
  BulbOutlined,
  BulbFilled,
  EditOutlined
} from "@ant-design/icons";

export default function FloatingMenu() {

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDarkTheme(savedTheme === "dark");
  }, []);

  const handleToggleTheme = () => {
    toggleTheme();
    setIsDarkTheme((prev) => !prev);
  };
  
  return (
    <div
      className="floating-menu"
    >
      <Link to={"/"}>
        <HomeOutlined className="mx-4 hover:b-2 border-blue" />
      </Link>
      <Link to={"/calendar"}>
        <InsertRowAboveOutlined className="mx-4 hover:ring:1" />
      </Link>
      <Link to={"/monthly-summary"}>
        <PieChartOutlined className="mx-4 hover:ring:1" />
      </Link>
      <Link to={"/envelopes"}>
        <MailOutlined className="mx-4 hover:ring:1" />
      </Link>
      <Link to={"/edit"}>
        <EditOutlined className="mx-4 hover:ring:1" />
      </Link>
      <button onClick={handleToggleTheme} id="theme-toggle">
      {isDarkTheme ? (
        <BulbOutlined className="mx-4 hover:ring-1" />
      ) : (
        <BulbFilled className="mx-4 hover:ring-1" />
      )}
      </button>
    </div>
  );
}
