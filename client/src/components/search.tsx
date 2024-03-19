import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export const SearchInput = () => {
  const [value, setValue] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  // console.log(location.pathname);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setValue(e.target.value);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (value.length < 1) return;

    if (location.pathname !== "/") {
      navigate(`/?search=${value}`);
      return;
    }

    setSearchParams((currentSearchParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(currentSearchParams),
        search: value,
      });
    });
    setValue("");
  };

  return (
    <div className="w-full relative ">
      <Search className="absolute top-1/2 left-3 transfrom -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <form action="" onSubmit={handleSearch}>
        <Input
          className="w-full max-w-[516px] pl-9 bg-neutral-900 text-neutral-200/60 border-neutral-700 rounded-full"
          placeholder="Search for videos"
          value={value}
          onChange={handleChange}
        />
        <button type="submit" className="hidden "></button>
      </form>
    </div>
  );
};
