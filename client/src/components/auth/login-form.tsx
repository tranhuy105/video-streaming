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

      const accessToken = response?.data.accessToken;

      console.log(response.data);

      setAuth({
        accessToken,
        user_id: response.data.user.id,
        user_img: response.data.user.user_img,
        user_name: response.data.user.name,
      });

      // navigate(from, { replace: true });
    } catch (error: any) {
      console.log(error.response?.data);
    }
  }

  return (
    <div className="px-5 py-4 h-screen flex flex-col items-center justify-center bg-neutral-900">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-4 border px-20 rounded-xl py-12 bg-white w-full md:w-fit h-fit space-y-6 text-muted-foreground"
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
                    className="w-80"
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
              className=" text-blue-500/60 text-xs cursor-pointer"
            >
              Create an account
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};
