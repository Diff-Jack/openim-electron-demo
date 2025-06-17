import { App as AntdApp, ConfigProvider, theme } from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider } from "react-router-dom";

import AntdGlobalComp from "./AntdGlobalComp";
import router from "./routes";
import { useUserStore } from "./store";

function App() {
  const locale = useUserStore((state) => state.appSettings.locale);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <ConfigProvider
      autoInsertSpaceInButton={false}
      locale={locale === "zh-CN" ? zhCN : enUS}
      theme={{
        token: {
          colorPrimary: "#0089FF",
          fontFamily:
            "Roboto,-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
        },
        components: {
          Input: {
            activeBg: "rgba(36, 34, 32, 0.04)",
            hoverBg: "rgba(36, 34, 32, 0.04)",
            activeBorderColor: "transparent",
            hoverBorderColor: "transparent",
            fontSize: 14,
            colorBorder: "rgba(36,34,32,0.04)",
            colorText: "#000000",
            lineHeight: 1.142,
            colorTextPlaceholder: "#B0B0B0",
            activeShadow: "transparent",
          },
          Layout: {
            bodyBg: "#FFFFFF",
          },
          Avatar: {
            borderRadius: 12,
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>loading...</div>}>
          <AntdApp>
            <AntdGlobalComp />
            <RouterProvider router={router} />
          </AntdApp>
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
