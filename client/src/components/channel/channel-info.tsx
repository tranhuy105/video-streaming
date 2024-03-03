import { Button } from "../ui/button";

type ChannelInfoType = {
  name: string;
  email: string;
  img: string;
  id: string;
};

const placeHolderImgSrc =
  "https://avatars.githubusercontent.com/u/136960770?v=4";

export const ChannelInfo = ({
  channelInfo,
  isOwner,
}: {
  channelInfo: ChannelInfoType;
  isOwner: boolean;
}) => {
  return (
    <div className="flex px-20 py-4 text-neutral-200/80">
      {/* IMG */}
      <div className="w-44 h-44">
        <img
          src={
            channelInfo.img
              ? channelInfo.img
              : placeHolderImgSrc
          }
          alt={channelInfo.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* INFO */}
      <div className=" px-3 py-2 text-start">
        <h1 className="font-bold text-5xl text-neutral-200 mb-4">
          {channelInfo.name}
        </h1>
        <h2 className="text-neutral-200 italic pl-1">
          ✉️: {channelInfo.email}
        </h2>
        <h2 className="text-neutral-200/40 text-sm mt-[2px]">
          @{channelInfo.id}
        </h2>

        {isOwner && (
          <div className="flex mt-6 gap-3">
            <Button className="bg-neutral-800 text-neutral-200 rounded-full duration-300 hover:bg-neutral-900">
              Tùy chỉnh kênh
            </Button>
            <Button className="bg-neutral-800 text-neutral-200 rounded-full duration-300 hover:bg-neutral-900">
              Quản lí video
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
