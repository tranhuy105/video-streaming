import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { Edit } from "lucide-react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

interface ChannelInputFieldProps {
  value: string;
}

export const ChannelInputField = ({
  value,
}: ChannelInputFieldProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [v, setV] = useState(value);
  const axiosPrivate = useAxiosPrivate();

  const formRef = useRef<HTMLFormElement>(null);

  useOnClickOutside(formRef, () => {
    if (selected) {
      setSelected(false);
    }
  });

  const handleChange = (e: any) => {
    setV(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axiosPrivate.post(
        "/user/name",
        {
          new_name: v,
        }
      );

      console.log(response.data);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={() => {
        if (!selected) {
          setSelected(true);
        }
      }}
      ref={formRef}
      className=" h-14 flex gap-4 items-center"
    >
      <Input
        value={v}
        onChange={handleChange}
        disabled={isLoading}
        className="bg-transparent border-none text-4xl h-full text-neutral-200 px-0 flex items-center cursor-pointer"
      />

      <Button
        type="submit"
        className="hidden"
        aria-hidden
      />
    </form>
  );
};
