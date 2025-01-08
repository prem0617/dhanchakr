"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const FetchAllData = () => {
  const { data, isRefetching } = useQuery({
    queryKey: ["authUser"],
    queryFn: async function () {
      try {
        const response = await axios.get("/api/auth/getMe", {
          withCredentials: true,
        });
        // console.log(response);
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        return response.data;
      } catch (error) {
        // console.error(error.message || "Error in Get Me");
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      try {
        const response = await axios?.get("/api/getAccounts");
        // console.log(response);

        return response.data.accounts;
      } catch (error) {
        // console.log(error);
        // throw new Error(
        //   response.error || response.data.error || "Error in getAccout"
        // );
        return error;
      }
    },
  });
};

export default FetchAllData;
