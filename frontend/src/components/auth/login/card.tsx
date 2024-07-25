import React from "react";
import Logo from "./logo";
import { Input, Button, Divider } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { FRONTEND_URL, login } from "@/helpers/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import googleLogo from "@/../public/icons/google_icon.svg";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const REDIRECT_URI = `${FRONTEND_URL}/google`;

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
      <button className="bg-white text-black h-2rem pl-2 pr-4 flex items-center border-2 border-gray-200 rounded-xl hover:shadow-inner transition-shadow">
        <Image
          src={googleLogo.src}
          alt=""
          className="aspect-square h-12 float-left"
          width={50}
          height={50}
        />
        Login With google
      </button>
    </Link>
  );
};

export default function Card() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [username, setusername] = React.useState("");
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();

  const onSubmit = () => {
    const s1 = async () => {
      const res = await login({ username: username, password: password });
      if (res) {
        toast.success("Logged in SuccessFully");
        router.push("/dashboard");
      } else {
        toast.error("Email or password wrong");
      }
    };
    s1();
  };

  const isInvalid = React.useMemo(() => {
    if (username === "") return false;

    return true;
  }, [username]);

  return (
    <div className="flex flex-col gap-[2.5rem] justify-around items-center relative z-10   backdrop-blur-md  rounded-[20px] border-[2px] border-customblue-600 p-14">
      <div className="flex gap-[20px]">
        <Logo width={60} />
      </div>

      <div className="w-[20rem] flex flex-col gap-[1.5rem] justify-center items-center">
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
        />
        <Input
          isDisabled={!isInvalid}
          color="primary"
          label="Password"
          value={password}
          onValueChange={setPassword}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
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
        isDisabled={password === "" ? true : false}
        color="primary"
        variant="ghost"
        fullWidth={true}
        onClick={onSubmit}
      >
        Login
      </Button>
      <GoogleAuthButton />
    </div>
  );
}
