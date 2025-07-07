import { deleteRedisLock } from "../api/bookingAPI";
import { refreshToken } from "../api/authAPI";
export const clearRedisLock = async (payload, logout) => {
  try {
    await deleteRedisLock(payload);
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message;

    if (status === 401) {
      try {
        const refreshRes = await refreshToken();

        if (refreshRes.status === 200) {
          const retryRes = await deleteRedisLock(payload);
          if (retryRes.status === 200) {
            return;
          } else {
            alert("Retry failed after refreshing token.");
            logout();
          }
        } else {
          alert(message);
          logout();
        }
      } catch (refreshErr) {
        console.error("Error refreshing token:", refreshErr);
        alert(refreshErr.response?.data?.message || "Session expired.");
        logout();
      }
    } else if (status === 403) {
      alert(message);
      logout();
    } else if (status === 400 || status === 500) {
      //   toast.error(message);
      // navigate("/home");
    }
  }
};
