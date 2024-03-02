import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "@/api/axios";
import useAuth from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const LOGIN_URL = "/auth/login";

const formSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Email phải lớn hơn hai kí tự" })
    .max(50)
    .email("Hãy nhập địa chỉ email hợp lệ"),
  password: z.string(),
});

export const LoginForm = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof formSchema>
  ) {
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify(values),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log(JSON.stringify(response?.data));
      const accessToken = response?.data.accessToken;
      // const user = response?.data.user;
      // setAuth({ accessToken, user });
      setAuth({ accessToken });

      // quay lai trang nguoi dung vua bi redirect den day
      navigate(from, { replace: true });
    } catch (error: any) {
      console.log(error.response?.data);
    }
  }

  return (
    <div className="container px-5 py-4 h-screen flex items-center justify-center bg-green-400">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-4 border px-3 py-4 bg-secondary w-full md:w-1/2 h-full flex flex-col items-center justify-center"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-6">
            Submit
          </Button>
          <div>
            <p>Dont have an account?</p>
            <p
              onClick={() => navigate("/register")}
              className="text-muted-foreground text-blue-500 text-xs cursor-pointer"
            >
              Create an account
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};
