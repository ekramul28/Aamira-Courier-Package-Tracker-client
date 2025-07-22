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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
  id: z.string().nonempty("ID is required"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();

      if (res?.data?.accessToken) {
        const user = verifyToken(res.data.accessToken) as TUser;
        dispatch(setUser({ user, token: res.data.accessToken }));
        toast.success("Login successful");

        if (res.data.needsPasswordChange) {
          navigate(`/${user.role}/profile`);
        } else {
          navigate(`/change-password`);
        }
      }
    } catch (error) {
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
            <div className="space-y-2">
              <Label htmlFor="id">User ID</Label>
              <Input
                id="id"
                placeholder="Enter your ID (e.g., A-0001)"
                {...register("id")}
              />
              {errors.id && (
                <p className="text-xs text-red-500">{errors.id.message}</p>
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
                    onSubmit({ id: "A-0001", password: "Admin@123" })
                  }
                >
                  Login as Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onSubmit({ id: "S-0001", password: "123456" })}
                >
                  Login as Student
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    onSubmit({ id: "F-0001", password: "Faculty@123" })
                  }
                >
                  Login as Faculty
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
