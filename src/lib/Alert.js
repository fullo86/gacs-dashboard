import Swal from "sweetalert2";

const Alert = {
  success: (title, text, timer = 3000) =>
    Swal.fire({
      icon: "success",
      title,
      text,
      timer,
      showConfirmButton: false,
    }),

  error: (title, text, timer = 3000) =>
    Swal.fire({
      icon: "error",
      title,
      text,
      timer,
      showConfirmButton: false,
    }),

  warning: (title, text, timer = 3000) =>
    Swal.fire({
      icon: "warning",
      title,
      text,
      timer,
      showConfirmButton: false,
    }),

  info: (title, text, timer = 3000) =>
    Swal.fire({
      icon: "info",
      title,
      text,
      timer,
      showConfirmButton: false,
    }),

  confirm: async ({
    title = "Yakin?",
    text = "",
    confirmText = "Ya",
    cancelText = "Batal",
  }) => {
    return Swal.fire({
      icon: "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    });
  },
};

export default Alert;
