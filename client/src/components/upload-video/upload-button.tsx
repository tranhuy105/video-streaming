import { Upload } from "lucide-react";
import { Link } from "react-router-dom";

export const UploadButton = () => {
  return (
    <Link
      to={"/upload"}
      className="w-fit p-2 hover:bg-neutral-800 rounded-full cursor-pointer transition-all duration-300"
    >
      <Upload />
    </Link>
  );
};
