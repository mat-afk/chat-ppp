export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      neutral: "neutral",
    },
    dashboardPanel: {
      slots: {
        body: "p-0 sm:p-0 px-4 sm:px-6 md:px-30 lg:px-25 xl:px-40",
      },
    },
    chatMessage: {
      slots: {
        content: "break-all",
      },
    },
  },
});
