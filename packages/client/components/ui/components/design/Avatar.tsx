import { JSXElement, Show, createUniqueId } from "solid-js";

import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";

import { Initials } from "../utils";

import { Ripple } from "./Ripple";

export type Props = {
  /**
   * Avatar size
   */
  size?: number;

  /**
   * Avatar shape
   */
  shape?: "circle" | "square" | "rounded-square";

  /**
   * Image source
   */
  src?: string;

  /**
   * Fallback if no source
   */
  fallback?: string | JSXElement;

  /**
   * If this avatar falls back, use primary contrasting colours
   */
  primaryContrast?: boolean;

  /**
   * Punch a hole through the avatar
   */
  holepunch?:
    | "bottom-right"
    | "top-right"
    | "right"
    | "overlap"
    | "overlap-subtle"
    | "none"
    | false;

  /**
   * Specify overlay component
   */
  overlay?: JSXElement;

  /**
   * Whether this icon is interactive
   */
  interactive?: boolean;

  /**
   * Click handler
   */
  onClick?: (e: MouseEvent) => void;

  /**
   * HTML Web Component slot
   */
  slot?: string;
};

/**
 * Text fallback container
 */
const FallbackBase = styled("div", {
  base: {
    width: "100%",
    height: "100%",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontWeight: 600,
    fontSize: "0.75rem",
  },
  variants: {
    contrast: {
      true: {
        color: "var(--md-sys-color-on-primary)",
        background: "var(--md-sys-color-primary)",
      },
      false: {
        fill: "var(--md-sys-color-on-surface)",
        color: "var(--md-sys-color-on-surface)",
        background: "var(--md-sys-color-surface-container-low)",
      },
    },
  },
  defaultVariants: {
    contrast: false,
  },
});

/**
 * Generic Avatar component
 *
 * Partially inspired by Adw.Avatar API, we allow users to specify a fallback component (usually just text) to display in case the URL is invalid.
 *
 * NOTE: We deliberately render the image as a native SVG <image> element (clipped by
 * an SVG <clipPath>) instead of an <img> inside a <foreignObject>. Chrome fails to
 * paint <img> / background-image content inside <foreignObject> (GPU compositing bug),
 * leaving avatars invisible. SVG <image> bypasses <foreignObject> entirely.
 */
export function Avatar(props: Props) {
  // Unique id so the clip path never collides between avatars
  const clipId = createUniqueId();

  return (
    <ParentBase
      // @ts-expect-error not typed for some reason
      slot={props.slot}
      style={{
        width: props.size + "px",
        height: props.size + "px",
      }}
      viewBox="0 0 32 32"
      interactive={props.interactive}
      onClick={props.onClick}
    >
      <defs>
        <clipPath id={clipId}>
          {props.shape === "square" ? (
            <rect x="0" y="0" width="32" height="32" />
          ) : props.shape === "rounded-square" ? (
            <rect x="0" y="0" width="32" height="32" rx="12" />
          ) : (
            <circle cx="16" cy="16" r="16" />
          )}
        </clipPath>
      </defs>

      <g
        mask={
          props.holepunch && props.holepunch !== "none"
            ? `url(#holepunch-${props.holepunch})`
            : undefined
        }
      >
        <Show
          when={props.src}
          keyed
          fallback={
            <foreignObject
              x="0"
              y="0"
              width="32"
              height="32"
              class={css({ transition: "var(--transitions-fast) filter" })}
            >
              <Shape shape={props.shape}>
                <FallbackBase contrast={props.primaryContrast}>
                  {typeof props.fallback === "string" ? (
                    <Initials input={props.fallback} maxLength={2} />
                  ) : (
                    props.fallback
                  )}
                </FallbackBase>
              </Shape>
            </foreignObject>
          }
        >
          {/* Native SVG image path — no foreignObject, no Chrome GPU compositing bug */}
          <g
            style={{ "clip-path": `url(#${clipId})` }}
            class={css({ transition: "var(--transitions-fast) filter" })}
          >
            <rect
              x="0"
              y="0"
              width="32"
              height="32"
              fill="var(--md-sys-color-surface-container-low)"
            />
            <image
              href={props.src}
              x="0"
              y="0"
              width="32"
              height="32"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        </Show>

        {/* Ripple is an HTML web component, so it needs its own transparent overlay */}
        <Show when={props.interactive}>
          <foreignObject x="0" y="0" width="32" height="32">
            <Shape shape={props.shape}>
              <Ripple />
            </Shape>
          </foreignObject>
        </Show>
      </g>
      {props.overlay}
    </ParentBase>
  );
}

/**
 * Avatar parent container
 */
const ParentBase = styled("svg", {
  base: {
    flexShrink: 0,
    userSelect: "none",
    cursor: "inherit",
  },
  variants: {
    interactive: {
      true: {
        cursor: "pointer",
      },
      false: {},
    },
  },
  defaultVariants: {
    interactive: false,
  },
});

/**
 * Shape container (for Ripple support)
 */
const Shape = styled("div", {
  base: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  variants: {
    shape: {
      circle: {
        borderRadius: "var(--borderRadius-circle)",
      },
      square: {},
      "rounded-square": {
        borderRadius: "var(--borderRadius-md)",
      },
    },
  },
  defaultVariants: {
    shape: "circle",
  },
});
