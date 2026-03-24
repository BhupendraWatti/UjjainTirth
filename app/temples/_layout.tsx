import { Stack } from "expo-router";

export default function TempleLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[slug]"
        options={{
          headerShown: true,
          title: "Temple Details",
        }}
      />
    </Stack>
  );
}
