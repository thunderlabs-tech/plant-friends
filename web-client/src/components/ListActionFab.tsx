import React from "react";
import * as RMWC from "@rmwc/types";
import { Fab, FabProps } from "@rmwc/fab";
import "@rmwc/fab/styles";
import css from "src/components/ListActionFab.module.css";

export default function ListActionFab<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Tag extends React.ElementType<any> = "div"
>(
  props: RMWC.ComponentProps<FabProps, React.HTMLProps<HTMLElement>, Tag>,
): React.ReactElement {
  return (
    <Fab
      theme={["background", "primary", "textPrimaryOnDark"]}
      className={css.ListActionFab}
      mini
      {...props}
    />
  );
}
