import React from "react";
import "@rmwc/top-app-bar/styles";
import {
  SimpleTopAppBar,
  TopAppBarFixedAdjust,
  SimpleTopAppBarProps,
} from "@rmwc/top-app-bar";
import "@rmwc/grid/styles";
import { ComponentProps } from "@rmwc/types";
import theme from "src/init/theme";
import styles from "src/components/Layout.module.css";
import { ThemeProvider } from "@rmwc/theme";

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
      <ThemeProvider
        options={{
          primary: theme.background,
          onPrimary: theme.textPrimaryOnLight,
        }}
      >
        <SimpleTopAppBar {...appBar} />
      </ThemeProvider>
      <TopAppBarFixedAdjust style={{ backgroundColor: theme.background }} />

      <div className={styles.childrenContainer}>{children}</div>
    </div>
  );
};

export default Layout;
