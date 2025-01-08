import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const AddLimit = ({ accountData }) => {
  // console.log(accountData);
  const handleLimit = (e) => {
    e.preventDefault();
    // console.log("Limit Clicked");
  };

  if (accountData.limit)
    return <div className="mt-3">Limit of this Accout is : 400</div>;

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-muted-foreground">
          Add Minimum Ammout Must in Account{" "}
        </h2>
        <form onSubmit={handleLimit} className="space-y-2">
          <Input type={"number"} placeholder="₹ 1000" className="w-[300px]" />
          <Button variant="outline">Add Limit</Button>
        </form>
      </div>
    </div>
  );
};

export default AddLimit;
