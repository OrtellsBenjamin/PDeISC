import Toast from "react-native-toast-message";
import { useWindowDimensions } from "react-native";

export default function useToasts() {
  const { width } = useWindowDimensions();

  const showToast = (type, text1, text2 = "") => {
    const isMobile = width < 700;
    Toast.show({
      type,
      text1,
      text2,
      visibilityTime: 2500,
      topOffset: isMobile ? 50 : 70,
      props: {
        style: {
          width: isMobile ? "90%" : "70%",
          alignSelf: "center",
          paddingHorizontal: isMobile ? 12 : 20,
        },
        text1Style: { fontSize: isMobile ? 14 : 16, fontWeight: "700" },
        text2Style: { fontSize: isMobile ? 13 : 15 },
      },
    });
  };

  return { showToast };
}
