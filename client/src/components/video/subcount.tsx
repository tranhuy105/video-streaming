import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useEffect } from "react";

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

        setSubCount(response.data.number_of_sub);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubCount();
  }, [owner_id, axiosPrivate, setSubCount]);

  return (
    <p className="text-sm -mt-1 text-muted-foreground">
      {subCount && subCount * 1} người đăng kí
    </p>
  );
};
