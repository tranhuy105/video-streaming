import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ChannelInputField } from "./channel-input-fielt";
import { ChannelImage } from "./channel-image-upload";

type ChannelInfoType = {
  name: string;
  email: string;
  img: string;
  id: string;
};

export const ChannelInfo = ({
  channelInfo,
  isOwner,
}: {
  channelInfo: ChannelInfoType;
  isOwner: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex px-20 py-4 text-neutral-200/80">
      {/* IMG */}
      <ChannelImage
        isOwner={isOwner}
        src={channelInfo.img}
      />

      {/* INFO */}
      <div className=" px-3 py-2 text-start">
        <h1 className="font-bold text-5xl text-neutral-200 mb-4">
          {isOwner ? (
            <ChannelInputField value={channelInfo.name} />
          ) : (
            channelInfo.name
          )}
        </h1>
        <h2 className="text-neutral-200 italic">
          ✉️: {channelInfo.email}
        </h2>
        <h2 className="text-neutral-200/40 text-sm mt-[2px]">
          @{channelInfo.id}
        </h2>

        {isOwner && (
          <div className="flex mt-6 gap-3">
            <Button
              className="bg-neutral-800 text-neutral-200 rounded-full duration-300 hover:bg-neutral-900"
              // navigate to asdasdas
              onClick={() => {
                navigate(`/studio`);
              }}
            >
              Quản lí video
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
