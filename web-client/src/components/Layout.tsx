import React from "react";
import "@rmwc/top-app-bar/styles";
import {
  TopAppBarFixedAdjust,
  SimpleTopAppBarProps,
  TopAppBar,
  TopAppBarActionItem,
  TopAppBarNavigationIcon,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from "@rmwc/top-app-bar";
import "@rmwc/grid/styles";
import { ComponentProps } from "@rmwc/types";
import theme from "src/init/theme";
import styles from "src/components/Layout.module.css";
import { ThemeProvider } from "@rmwc/theme";

export type LayoutProps = {
  appBar: ComponentProps<
    SimpleTopAppBarProps,
    Omit<React.HTMLProps<HTMLElement>, "title">,
    "div"
  >;
};

const Layout: React.FC<LayoutProps> = ({ children, appBar }) => {
  const {
    title,
    actionItems,
    navigationIcon,
    startContent,
    endContent,
    ...rest
  } = appBar;

  return (
    <div className={styles.root}>
      <ThemeProvider
        options={{
          primary: theme.background,
          onPrimary: theme.textPrimaryOnLight,
        }}
      >
        <TopAppBar {...rest}>
          <TopAppBarRow>
            <TopAppBarSection alignStart>
              {!!navigationIcon && (
                <TopAppBarNavigationIcon
                  icon="menu"
                  {...(typeof navigationIcon === "boolean"
                    ? {}
                    : navigationIcon)}
                />
              )}
              {!!title && <TopAppBarTitle>{title}</TopAppBarTitle>}
              {startContent}
            </TopAppBarSection>

            {(!!actionItems || endContent) && (
              <TopAppBarSection alignEnd>
                {endContent}
                {!!actionItems &&
                  actionItems.map((actionItemProps, index) => (
                    <TopAppBarActionItem {...actionItemProps} key={index} />
                  ))}
              </TopAppBarSection>
            )}
          </TopAppBarRow>
        </TopAppBar>
      </ThemeProvider>
      <TopAppBarFixedAdjust style={{ backgroundColor: theme.background }} />

      <div className={styles.childrenContainer}>{children}</div>
    </div>
  );
};

export default Layout;
