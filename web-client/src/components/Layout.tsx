import React from "react";
import "@rmwc/top-app-bar/styles";
import {
  SimpleTopAppBar,
  TopAppBarFixedAdjust,
  SimpleTopAppBarProps,
} from "@rmwc/top-app-bar";
import "@rmwc/grid/styles";
import { ComponentProps } from "@rmwc/types";
import { primaryColor } from "src/init/theme";
import styles from "src/components/Layout.module.css";

export type LayoutProps = {
  appBar: ComponentProps<
    SimpleTopAppBarProps,
    React.HTMLProps<HTMLElement>,
    "div"
  >;
};

const Layout: React.FC<LayoutProps> = ({ children, appBar }) => {
  return (
    <div className={styles.root}>
      <SimpleTopAppBar {...appBar} theme={["primaryBg"]} />
      <TopAppBarFixedAdjust style={{ backgroundColor: primaryColor }} />

      <div className={styles.childrenContainer}>{children}</div>
    </div>
  );
};

export default Layout;
