import { cn } from "@/lib/utils";
import { Overlay } from "../overlay";
import { useRef, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { Upload } from "lucide-react";
import axios from "axios";
import { Loading } from "../loading";

const placeHolderImgSrc =
  "https://avatars.githubusercontent.com/u/136960770?v=4";

export const ChannelImage = ({
  isOwner,
  src,
}: {
  isOwner: boolean;
  src: string;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [imgPreview, setImgPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (openForm) {
      setImgPreview("");
      setSelectedFile(null);
      setOpenForm(false);
    }
  };

  useOnClickOutside(divRef, handleClose);

  const handleOpenUploadImgForm = () => {
    if (!openForm) {
      setOpenForm(true);
    }
  };

  const handleUploadImage = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const CLOUD_NAME = "dabouwerv";
      const PRESET_NAME = "image-storage";
      const FOLDER_NAME = "profile-pic";
      const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      if (!selectedFile) throw new Error("NO FILE");

      const formData = new FormData();

      formData.append("upload_preset", PRESET_NAME);
      formData.append("folder", FOLDER_NAME);
      formData.append("file", selectedFile);

      const response = await axios.post(api, formData);

      const cloudinaryUrls = response.data.secure_url;

      await axiosPrivate.post("/user/img", {
        new_img: cloudinaryUrls,
      });
      setImgSrc(cloudinaryUrls);
      console.log("success");
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result;

        if (result && typeof result === "string") {
          const base64String = result.split(",")[1];
          setImgPreview(base64String);
          setSelectedFile(file);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    if (isLoading) return;
    const file = e.dataTransfer?.files[0];

    if (file.type.startsWith("image")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result;

        if (result && typeof result === "string") {
          const base64String = result.split(",")[1];
          setImgPreview(base64String);
          setSelectedFile(file);
        }
      };

      reader.readAsDataURL(file);
      return;
    }

    alert("invalid file type");
  };

  return (
    <>
      <div
        className={cn(
          "w-44 h-44",
          isOwner && "cursor-pointer group relative"
        )}
        onClick={
          isOwner && !isLoading
            ? handleOpenUploadImgForm
            : () => {}
        }
      >
        <img
          src={imgSrc ? imgSrc : placeHolderImgSrc}
          alt={""}
          className="w-full h-full object-cover rounded-full"
        />
        {isOwner && <Overlay rounded />}
      </div>

      {isOwner && openForm && (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/60 z-[9998] flex items-center justify-center">
          <div
            ref={divRef}
            className="w-2/3 h-3/4 bg-black/80 rounded-xl p-6 flex items-center justify-between px-[6%]"
          >
            {/* UPLOAD INPUT */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div
                className={cn(
                  "flex items-center justify-center border border-dashed border-blue-500 w-[480px] h-80 cursor-pointer",
                  isLoading &&
                    "pointer-events-none opacity-50"
                )}
                onClick={() => inputRef?.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload size={48} />
                <input
                  disabled={isLoading}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  aria-hidden
                  ref={inputRef}
                />
              </div>
              <div className="text-neutral-50 italic">
                Click chuột hoặc kéo thả file từ máy tính
                của bạn
              </div>
            </div>

            {/* IMAGE PREVIEW */}
            <div className="">
              <div className="w-60 h-60 mb-5">
                <img
                  src={
                    !imgPreview
                      ? imgSrc
                        ? imgSrc
                        : placeHolderImgSrc
                      : `data:image/png;base64,${imgPreview}`
                  }
                  className="object-cover object-center rounded-full w-full h-full"
                />
              </div>
              <p className="text-neutral-200 font-semibold text-center">
                Ảnh của bạn sẽ trông như thế này
              </p>
              <p className="text-neutral-200 font-semibold text-center">
                Nhấn cập nhật để hoàn tất
              </p>
              <div
                className={cn(
                  "text-center mt-4 px-6 py-3 text-lg cursor-pointer bg-neutral-800 hover:bg-black/80 text-neutral-50 transition-all duration-300 rounded-full w-fit mx-auto",
                  isLoading &&
                    "pointer-events-none opacity-50"
                )}
                onClick={handleUploadImage}
              >
                Cập nhật
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && <Loading />}
    </>
  );
};
