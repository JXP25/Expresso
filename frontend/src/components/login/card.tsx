import React from "react";
import Logo from "./logo";
import { Input, Button, Divider, Spinner } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { NEXT_PUBLIC_FRONTEND_URL, login } from "@/helpers/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import googleLogo from "@/../public/icons/google_icon.svg";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const REDIRECT_URI = `${NEXT_PUBLIC_FRONTEND_URL}/google`;

export const GoogleAuthButton = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  return (
    <Link href={`${rootUrl}?${qs.toString()}`}>
      <button className=" w-[100%] text-[rgba(255,255,255,0.5)] text-[0.9rem] h-2rem pl-2 pr-5 flex gap-5 items-center justify-around border-2 border-[rgba(255,255,255,0.5)] rounded-xl hover:shadow-inner transition-shadow">
        <Image
          src={googleLogo.src}
          alt=""
          className="aspect-square h-12 float-left"
          width={50}
          height={50}
        />
        <span className=" text-[1.4rem] -translate-y-1">&#124;</span>
        Login With google
      </button>
    </Link>
  );
};

export default function Card() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [username, setusername] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();

  const onSubmit = async () => {
    if (isLoading) return; // Prevent multiple clicks

    setIsLoading(true);
    try {
      const res = await login({ username: username, password: password });
      if (res) {
        toast.success("Logged in Successfully");
        router.push("/dashboard");
      } else {
        toast.error("Email or password wrong");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isInvalid = React.useMemo(() => {
    if (username === "") return false;
    return true;
  }, [username]);

  return (
    <div className="flex flex-col gap-[1.5rem] sm:gap-[2.5rem] w-[330px] sm:w-auto justify-around items-center relative z-10   backdrop-blur-md  rounded-[20px] border-[2px] border-customblue-600 p-8 sm:p-10 md:p-12 lg:p-14">
      <div className="flex gap-[20px]">
        <Logo width={60} />
        <Divider
          className="h-[60px] bg-customblue-600"
          orientation="vertical"
        />

        <Image src="/data/logos/google.png" alt="G" width={60} height={60} />
      </div>

      <div className="w-[18rem] flex flex-col gap-[1.5rem] justify-center items-center">
        <Input
          isClearable
          type="text"
          autoFocus
          label="Username"
          value={username}
          onValueChange={setusername}
          className="max-w-[25rem] dark"
          color="primary"
          errorMessage="Please enter a valid username"
          isDisabled={isLoading}
        />
        <Input
          isDisabled={!isInvalid || isLoading}
          color="primary"
          label="Password"
          value={password}
          onValueChange={setPassword}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              disabled={isLoading}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-[25rem] dark"
        />

        <div className=" text-customblue-500 flex justify-between w-[95%]">
          <Link href="/signup">
            <span>Create New Account</span>{" "}
          </Link>
          <span>Forgot?</span>
        </div>
      </div>

      <Button
        isDisabled={password === "" || isLoading}
        color="primary"
        variant="ghost"
        fullWidth={true}
        onClick={onSubmit}
        size="lg"
        isLoading={isLoading}
        spinner={<Spinner color="white" size="sm" />}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
      <div className="w-[100%]">
        <GoogleAuthButton />
      </div>
    </div>
  );
}
