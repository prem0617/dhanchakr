import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CameraIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const ScanFile = ({ scanedData }) => {
  const fileInputRef = useRef();

  const [file, setFile] = useState();

  const { mutate: fileUpload, isPending } = useMutation({
    mutationFn: async ({ base64String, type }) => {
      try {
        const response = await axios.post("/api/getFileData", {
          base64String,
          type,
        });
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: (data) => {
      scanedData(data);
      toast.success("Image Scanned");
    },
  });

  const handleFileChange = async (file) => {
    setFile(file);
    console.log(file);
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less then 5 MB");
      return;
    }

    const arrayBuffer = await file.arrayBuffer();

    const base64String = Buffer.from(arrayBuffer).toString("base64");

    // console.log(base64String);

    fileUpload({ base64String, type: file.type });
  };
  return (
    <div>
      <Input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
      />
      {isPending ? (
        <Button
          type="button"
          variant="outline"
          disabled
          className="w-full flex bg-gradient-to-r from-blue-500 to-black text-white hover:text-white cursor-not-allowed"
          onClick={() => fileInputRef.current?.click()}
        >
          <Loader2 className="animate-spin mr-2" />
          {file?.name ? file?.name : "Selecting File..."}
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full flex bg-gradient-to-r from-blue-500 to-black text-white hover:text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          <CameraIcon className="mr-2" />
          {file?.name ? file?.name : "Select File"}
        </Button>
      )}
    </div>
  );
};

export default ScanFile;
