import { useEffect, useRef, useState } from "react";
import { VideoType } from "../video-cards";
import { useInView } from "react-intersection-observer";
import { Videos } from "./videos";
import { VideoSkeleton } from "./video-skeletion";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { cn } from "@/lib/utils";

export const LoadVideos = ({
  filterQuery,
  searchQuery,
  small,
}: {
  filterQuery?: string;
  searchQuery?: string;
  small?: boolean;
}) => {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const isFirstRender = useRef(true);
  const [ref, inView] = useInView();

  useEffect(() => {
    const loadMoreVideo = async () => {
      try {
        console.log("load more");
        const nextPage = page + 1;
        const response =
          (await axiosPrivate.get("/video", {
            params: {
              page: page + 1,
              filter: filterQuery,
              search: searchQuery,
              perPage: small && 3,
            },
          })) ?? [];

        const newVideos = response.data;

        if (newVideos.length === 0) {
          setHasMoreVideos(false);
        } else {
          setVideos((prev) => [...prev, ...response.data]);
          setPage(nextPage);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!isFirstRender.current) {
      if (inView && hasMoreVideos && !small) {
        loadMoreVideo();
      } else if (inView && small && videos.length < 10) {
        loadMoreVideo();
      }
    } else {
      isFirstRender.current = false;
    }
  }, [inView]);

  return (
    <>
      <div
        className={cn(
          " w-full gap-x-3 gap-y-6 p-4 pr-8 grid grid-cols-3",
          small && "grid-cols-1"
        )}
      >
        <Videos videos={videos} />
      </div>

      {hasMoreVideos &&
      (small ? small && videos.length < 10 : 1) ? (
        <div
          ref={ref}
          className={cn(
            " w-full gap-x-3 gap-y-6 p-4 pr-8 grid grid-cols-3",
            small && "grid-cols-1"
          )}
        >
          <VideoSkeleton small={false} />
          {!small && <VideoSkeleton small={false} />}
          {!small && <VideoSkeleton small={false} />}
        </div>
      ) : !small ? (
        <div className="text-neutral-200/50 gap-0 text-center flex items-center justify-center flex-col mt-28">
          <p className="text-3xl font-bold text-center">
            Hết òi!
          </p>

          <img
            src={"/minori.png"}
            alt="minori"
            className="grayscale-0 object-cover object-center select-none pointer-events-none -mt-20"
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

// {!isLoading && (
//
// )}
