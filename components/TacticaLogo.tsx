import React from "react";
import Svg, { Path } from "react-native-svg";

export const TacticaLogo = ({ size = 96 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M96 48L48 96L0 48L48 0L96 48ZM24.6064 47.8447L48.6064 71.8447L72.6064 47.8447L48.6064 23.8447L24.6064 47.8447Z"
      fill="#CCFF00"
    />
  </Svg>
);

export default TacticaLogo;
