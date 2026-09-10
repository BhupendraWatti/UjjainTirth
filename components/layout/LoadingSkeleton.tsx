import React from "react";
import { View, StyleSheet } from "react-native";
import { AvailabilityLoader } from "@/components/common/AvailabilityLoader";

interface LoadingSkeletonProps {
  label?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  label = "Gathering Sacred Details...",
}) => {
  return (
    <View style={styles.container}>
      <AvailabilityLoader
        isLoading={true}
        label={label}
        count={0}
        images={[]}
      />
    </View>
  );
};

export default LoadingSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
});