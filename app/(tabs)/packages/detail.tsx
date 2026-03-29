import { useLocalSearchParams } from "expo-router";

export default function DetailScreen() {
  const { data } = useLocalSearchParams();

  const item = data ? JSON.parse(data as string) : null;

  console.log(item);
}
