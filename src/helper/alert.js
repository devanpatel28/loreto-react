import Swal from "sweetalert2";

export const underDev = () =>{
    return Swal.fire({
        icon: "warning",
        text: "UNDER DEVELOPMENT",
        timer: 1000,
        width: "400px",
        showConfirmButton: false,
      });
}