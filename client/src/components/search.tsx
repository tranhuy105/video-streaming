import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "usehooks-ts";
import qs from "query-string";
import { useNavigate } from "react-router-dom";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 1000);
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: {
          search: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    if (url !== "/") navigate(url);
  }, [navigate, debouncedValue]);

  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 left-3 transfrom -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="w-full max-w-[516px] pl-9"
        placeholder="Search for videos"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
