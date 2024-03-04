import { ChannelInfo } from "@/components/channel/channel-info";
import { ChannelVideos } from "@/components/channel/channel-videos";
import { Loading } from "@/components/loading";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type ChannelInfoType = {
  name: string;
  email: string;
  img: string;
  id: string;
};

type VideoInfoType = {
  description: string;
  id: string;
  owner_id: string;
  src: string;
  title: string;
  updated_at: Date;
};

const ChannelPage = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { channel_owner_id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const isOwner = auth.user_id === channel_owner_id;
  const [channelInfo, setChannelInfo] =
    useState<ChannelInfoType | null>(null);
  const [videos, setVideos] = useState<
    VideoInfoType[] | null
  >(null);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.post(
          `/user/channel/${channel_owner_id}`
        );

        setVideos(response.data.videos);
        setChannelInfo(response.data.channelInfo);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannel();
  }, [channel_owner_id, axiosPrivate]);

  if (isLoading)
    return (
      <div className="min-h-[calc(100vh-64px)]">
        <Loading />;
      </div>
    );

  if (!channelInfo) return <div>404 CHANNEL NOT FOUND</div>;

  return (
    <div className="min-h-[calc(100vh-64px)] text-neutral-200 bg-green pb-12">
      <ChannelInfo
        channelInfo={channelInfo}
        isOwner={isOwner}
      />
      <ChannelVideos
        videos={videos}
        owner_img={channelInfo.img}
        owner_name={channelInfo.name}
      />
    </div>
  );
};
export default ChannelPage;
