import { useRef, useState } from "react";

import { Upload } from "lucide-react";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export const VideoUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState<File[]>(
    []
  );
  const [progress, setProgress] = useState<number>();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [videoId, setVideoId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedFile[0] ||
      !title ||
      !description ||
      !auth.user_id
    )
      return;

    console.log(auth);
    const formData = new FormData();
    formData.append("file", selectedFile[0]);
    formData.append("user_id", auth.user_id!);
    formData.append("title", title);
    formData.append("description", description);
    setUploading(true);

    try {
      const res = await axiosPrivate.post(
        "/video/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (data) => {
            if (data.total)
              setProgress(
                Math.round(100 * (data.loaded / data.total))
              );
          },
        }
      );

      setVideoId(res.data.id);

      console.log(res.data);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();

    if (e.dataTransfer?.files[0].type.startsWith("video")) {
      console.log("ok");
      setSelectedFile(e.dataTransfer.files);
      return;
    }

    alert("invalid file type");
  };

  return (
    <div className="min-h-screen w-1/2 mx-auto flex items-center justify-center ">
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div
          className="flex flex-col justify-center items-start border-2 px-4 py-5 gap-4 w-full h-64  border-dashed border-blue-500 cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Input
            ref={inputRef}
            className="hidden"
            accept="video/*"
            type="file"
            onChange={(
              e: React.ChangeEvent<HTMLInputElement>
            ) => {
              const files = e.target.files;
              if (files) {
                setSelectedFile(Array.from(files));
              }
            }}
          />
          <Upload className="w-full text-center h-20 text-muted-foreground" />
          <p className="text-center text-xs font-semibold w-full text-muted-foreground">
            Upload your file here
          </p>
          {selectedFile[0] && (
            <p className="text-xs truncate w-1/2 mx-auto text-muted-foreground mt-6 text-center">
              {selectedFile[0].name}
            </p>
          )}
        </div>
        <Progress
          value={uploading ? progress : 0}
          className={cn(
            "w-full h-8 bg-blue-500",
            !uploading && "bg-transparent"
          )}
        />

        {videoId && (
          <div className="text-neutral-200">
            <p>
              Upload Succesful, you can click{" "}
              <Link
                to={`/video/${videoId}`}
                className="text-blue-500"
              >
                here
              </Link>{" "}
              to watch your video
            </p>
          </div>
        )}

        <div className="text-neutral-200 w-full">
          <p>Title of your video</p>
          <Input
            placeholder=""
            className="bg-neutral-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="text-neutral-200 w-full">
          <p>Description of your video</p>
          <Input
            placeholder=""
            className="bg-neutral-900"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div
          className={cn(
            "px-3 py-1 rounded-full cursor-pointer  text-xl text-white w-full",
            buttonVariants({ variant: "ghost" })
          )}
          onClick={handleSubmit}
        >
          Submit
        </div>
      </div>
    </div>
  );
};
