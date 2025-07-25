import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser, type TUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { verifyToken } from "@/utils/verifyToken";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import React, { useState } from "react";

const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoginError("");
      const res = await login(data).unwrap();

      if (res?.data?.accessToken) {
        const user = verifyToken(res.data.accessToken) as TUser;
        dispatch(setUser({ user, token: res.data.accessToken }));
        toast.success("Login successful");

        if (res.data.needsPasswordChange) {
          navigate(`/`);
        } else {
          navigate(`/change-password`);
        }
      }
    } catch (error) {
      setLoginError("Login failed. Please check your credentials.");
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl border border-border">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-primary">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Please login to continue
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {loginError && (
              <div className="text-center text-red-600 text-sm font-medium mb-2">
                {loginError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your Email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full text-base">
              Sign In
            </Button>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-center text-muted-foreground">
                Quick Login Options
              </p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    onSubmit({
                      email: "superAdmin@gmail.com",
                      password: "admin12345",
                    })
                  }
                >
                  Login as dispatcher
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    onSubmit({
                      email: "ekramulhassan80@gmail.com",
                      password: "123456",
                    })
                  }
                >
                  Login as courier
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-primary underline hover:text-primary/80"
            >
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
