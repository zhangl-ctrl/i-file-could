import React from "react";
import logo from "@/assets/logo.png";
import logoCollapsed from "@/assets/logo-collapsed.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Logo: React.FC = () => {
  const collapsed = useSelector((state: RootState) => state.status.collapsed);
  return (
    <img
      src={collapsed ? logoCollapsed : logo}
      alt="logo"
      style={{ height: "64px" }}
    />
  );
};

export default Logo;
