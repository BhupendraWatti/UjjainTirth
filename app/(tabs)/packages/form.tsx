import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function PackageForm() {
  const [loading, setLoading] = useState(true);

  const injectedCSS = `
    const style = document.createElement('style');
    style.innerHTML = \`
      header, footer, .footer, .header, nav, .navbar, .site-header, .site-footer {
        display: none !important;
      }

      body {
        padding: 10px !important;
        background: #fff !important;
      }
    \`;
    document.head.appendChild(style);
  `;

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator size="large" color="#EB5C49" style={styles.loader} />
      )}

      <WebView
        source={{
          uri: "https://ujjaintirth.com/my-package-my-cost-mobile/",
        }}
        injectedJavaScript={injectedCSS}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    zIndex: 10,
  },
});
