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
import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "@/context/AuthProvider";

const REGISTER_URL = "/user";

const formSchema = z.object({
  name: z.string().min(2),
  email: z
    .string()
    .min(2, { message: "Email phải lớn hơn hai kí tự" })
    .max(50)
    .email("Hãy nhập địa chỉ email hợp lệ"),
  password: z.string().min(2),
});

export const RegisterForm = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof formSchema>
  ) {
    try {
      console.log(values);
      await axios.post(
        REGISTER_URL,
        JSON.stringify(values),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log(JSON.stringify(response?.data));

      navigate("/login");
    } catch (error: any) {
      console.log(error.response);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
            <p>Already have an account?</p>
            <p
              onClick={() => navigate("/login")}
              className="text-muted-foreground text-blue-500 text-xs cursor-pointer"
            >
              Log in to your account
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};
