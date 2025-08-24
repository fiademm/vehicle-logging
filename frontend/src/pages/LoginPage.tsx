import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  passcode: z
    .string()
    .min(8, { message: "Passcode must be at least 8 characters" }),
});

type FormData = z.infer<typeof schema>;

const LoginPage = () => {
  const [showPasscode, setShowPasscode] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-neutralLight dark:bg-black flex">
      {/* Left Section: Background Image and Text (3/5 width on large screens) */}
      <div
        className="relative flex-[3] hidden lg:flex flex-col justify-center items-center text-white bg-cover bg-center p-12"
        style={{ backgroundImage: "url(/security.jpg)" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      {/* Right Section: Login Form (2/5 width on large screens) */}
      <div className="flex-[2] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white dark:bg-textDark rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            {/* Logo Placeholder */}
            <div className="mx-auto mb-4"> {/* Removed w-24 h-8 bg-... */}
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent1 text-transparent bg-clip-text">Logo</span>
            </div>
            <h2 className="text-3xl font-bold text-textDark dark:text-white">
              Sign in
            </h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                {...register("email")}
                placeholder="Email"
                type="email"
                className="w-full"
                error={errors.email?.message}
              />
            </div>
            <div className="relative">
              <Input
                {...register("passcode")}
                placeholder="8-digit Passcode"
                type={showPasscode ? "text" : "password"}
                className="w-full"
                error={errors.passcode?.message}
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-textLight dark:text-textLight"
              >
                {showPasscode ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent1 hover:from-accent1 hover:to-primary text-white font-bold py-3 rounded-lg"
            >
              Login
            </Button>
          </form>
          <p className="text-center text-sm text-textLight dark:text-textLight mt-8">
            Powered by Coenablers
          </p>
        </div>
      </div>
    
    </div>
  );
};

export default LoginPage;