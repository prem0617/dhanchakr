"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const FetchAllData = () => {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/getAccounts");
        console.log(response);
        if (response.error || response.data.error)
          throw new Error(
            response.error || response.data.error || "Error in getAccout"
          );
        return response.data.accounts;
      } catch (error) {
        console.log(error);
        throw new Error(
          response.error || response.data.error || "Error in getAccout"
        );
      }
    },
  });
};

export default FetchAllData;
