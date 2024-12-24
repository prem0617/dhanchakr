"use client";

import { useParams } from "next/navigation";
import React from "react";

const Account = () => {
  const { id } = useParams();
  console.log(id);

  return <div>Seperate Account - {id}</div>;
};

export default Account;
