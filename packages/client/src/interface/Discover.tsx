import { styled } from "styled-system/jsx";

import { Column, typography } from "@revolt/ui";

const title = typography({ class: "headline", size: "large" });
const subtitle = typography({ class: "label", size: "medium" });
const Base = styled("div", {
  base: {
    minWidth: 0,
    flexGrow: 1,
    display: "flex",
    position: "relative",
    flexDirection: "column",
  },
});

export function Discover() {
  return (
    <Base>
      <Column align="center" justify="center" style={{ height: "100%" }}>
        <span class={title}>Discover</span>
        <span class={subtitle}>Not available on this instance.</span>
      </Column>
    </Base>
  );
}
