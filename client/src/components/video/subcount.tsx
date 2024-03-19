import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect, useRef } from "react";

export const Subcount = ({
  owner_id,
  setSubCount,
  subCount,
}: {
  owner_id: string;
  setSubCount: any;
  subCount: number | null;
}) => {
  const axiosPrivate = useAxiosPrivate();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetchSubCount = async () => {
      try {
        console.log("fetching sub count");
        const response = await axiosPrivate.post(
          "/user/subcount",
          {
            owner_id,
          }
        );

        setSubCount(response.data.number_of_sub * 1);
      } catch (error) {
        console.log(error);
      }
    };

    if (!isFirstRender.current) {
      fetchSubCount();
    } else {
      isFirstRender.current = false;
    }
  }, [owner_id, axiosPrivate, setSubCount]);

  return (
    <p className="text-sm -mt-1 text-muted-foreground">
      {subCount && subCount * 1} người đăng kí
    </p>
  );
};
