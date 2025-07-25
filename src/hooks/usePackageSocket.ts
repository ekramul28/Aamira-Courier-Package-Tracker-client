import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { packageApi } from "@/redux/features/package/packageApi";
import {
  addOrUpdatePackage,
  removePackage,
} from "@/redux/features/package/packageSlice";
import type { TPackage } from "@/types/package";
import type { TQueryParam } from "@/types/global";
import type { AppDispatch } from "@/redux/store";

const SOCKET_URL = "http://localhost:5000"; // replace with your backend

export const usePackageSocket = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("package_update", (data: TPackage) => {
      console.log("Received update:", data);
      // Update the RTK Query cache for getAllPackages
      dispatch(
        packageApi.util.updateQueryData(
          "getAllPackages",
          undefined as TQueryParam[] | void,
          (draft: { data: TPackage[]; meta: any }) => {
            const idx = draft.data.findIndex((pkg) => pkg.id === data.id);
            if (idx !== -1) {
              draft.data[idx] = data;
            } else {
              draft.data.push(data);
            }
          }
        )
      );
      // Also update local slice
      dispatch(addOrUpdatePackage(data));
    });

    socket.on("package_delete", (id: string) => {
      console.log("Received delete:", id);
      // Remove from RTK Query cache
      dispatch(
        packageApi.util.updateQueryData(
          "getAllPackages",
          undefined as TQueryParam[] | void,
          (draft: { data: TPackage[]; meta: any }) => {
            draft.data = draft.data.filter((pkg) => pkg.id !== id);
          }
        )
      );
      // Also update local slice
      dispatch(removePackage(id));
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
};
