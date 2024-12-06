export const SUCCESS_ALERT: any = {
  richColors: true,
  unstyled: true,
  closeButton: false,
  dismissible: false,
  styles: {
    toastContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    toast: {
      shadowOpacity: 0.0015 * 4 + 0.1,
      shadowRadius: 3 * 4,
      shadowOffset: {
        height: 4,
        width: 0,
      },
      elevation: 4,
      backgroundColor: "white",
      borderRadius: 999999,
      borderCurve: "continuous",
    },
    toastContent: {
      padding: 12,
      paddingHorizontal: 32,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 4,
    },
    description: {
      fontSize: 14,
      color: "#666",
      textAlign: "center",
    },
  },
};
