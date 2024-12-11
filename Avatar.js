import { ViewStyle } from "react-native";
import { Image } from "react-native";

const Avatar = ({
  source,
  height = 54,
  width = 62,
  borderRadius = 9999,
  style = {},
}) => {
  return (
    <Image
      source={source}
      style={{
        height: height ?? "100%",
        width: width ?? "100%",
        borderRadius: borderRadius ?? 9999,
      }}
      resizeMode="cover"
    />
  );
};

export default Avatar;
