import { Loading } from "@/components/loading";
import { VideosTable } from "@/components/studio/videos-table";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useState } from "react";

type StudioVideoTypes = {
  like_count: number;
  cmt_count: number;
  title: string;
  id: string;
  src: string;
  description: string;
  created_at: Date;
  filename: string;
};

const StudioPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [studioVideos, setStudioVideos] = useState<
    StudioVideoTypes[] | null
  >(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(
          "/user/studio"
        );

        // console.log(typeof response.data);
        // console.log(response);

        setStudioVideos(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [axiosPrivate]);

  const handleDeleteVideo = async (filename: string) => {
    try {
      setIsLoading(true);
      console.log("start");
      await axiosPrivate
        .post("/video/delete", {
          filename,
        })
        .then(() => console.log("im done"));

      setStudioVideos(
        (cur) =>
          cur &&
          cur.filter(
            (video: StudioVideoTypes) =>
              video.filename !== filename
          )
      );
    } catch (error) {
      console.log(error);
    } finally {
      console.log("imhere");
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-[calc(100vh-64px)]">
        <Loading />
      </div>
    );

  if (!studioVideos) {
    return (
      <div>CHANNEL DONT EXIST, CANT GET STUDIO VIODEO</div>
    );
  }

  // console.log(studioVideos.length);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-800 rounded-xl pt-2 text-neutral-200/80 mr-4">
      <VideosTable
        studioVideos={studioVideos}
        handleDeleteVideo={handleDeleteVideo}
      />
    </div>
  );
};
export default StudioPage;
