import React from "react";
import { Link } from "@remix-run/react";
import {
  HomeOutlined,
  InsertRowAboveOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";

export default function FloatingMenu() {
  return (
    <div
      className="
    float-left
    bg-white
    w-1/8
    h-8
    rounded-xl
    b-4
    border-lightgrey
    shadow-md
    absolute
    top-4
    left-4
    clear-both
    content-center"
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
    </div>
  );
}
