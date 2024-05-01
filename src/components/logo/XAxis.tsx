import React from "react";

import { xrange } from "../../common/utils";

type XAxisProps = {
  /** The total number of positions in the logo. */
  n: number;
  /** SVG transform to apply to the axis. */
  transform: string;
  /** The width of each glyph in the containing logo. */
  glyphWidth: number;
  /** The number of the first position in the logo. */
  startpos: number;
  /** The rotation of the axis. */
  rotation?: number;
};

/**
 * Renders an x-axis with logo position numbers.
 */
export const XAxis = ({
  n,
  transform,
  glyphWidth,
  startpos,
  rotation = -90,
}: XAxisProps) => {
  const numbers = xrange(n);
  const rotationTransform = `rotate(${rotation})`;
  return (
    <g transform={transform}>
      {numbers.map((n) => (
        <text
          x={glyphWidth * (n + 0.66)}
          y="0"
          fontSize="18"
          textAnchor="middle"
          key={n}
          transform={rotationTransform}
          style={{ transformBox: "fill-box", transformOrigin: "right" }}
        >
          {n + startpos}
        </text>
      ))}
    </g>
  );
};
export default XAxis;