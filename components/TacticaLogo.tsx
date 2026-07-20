import React from "react";
import { Image } from "react-native";

export const TacticaLogo = ({ size = 96 }: { size?: number }) => (
  <Image
    source={require("../assets/icon.png")}
    style={{ width: size, height: size, borderRadius: size * 0.2 }}
    resizeMode="contain"
  />
);

export default TacticaLogo;
