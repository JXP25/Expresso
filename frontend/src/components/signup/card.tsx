import React from "react";
import Logo from "./logo";
import { Input, Button, Divider, Spinner } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { register } from "@/helpers/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { GoogleAuthButton } from "../login/card";

export default function Card() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmpassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (isLoading) return; // Prevent multiple clicks

    setIsLoading(true);
    try {
      const res = await register({
        username: username,
        email: email,
        password1: password,
        password2: confirmpassword,
      });
      if (res.success) {
        if (res.autoLogin) {
          toast.success("Account Created Successfully! Welcome!");
          router.push("/dashboard"); // Go directly to dashboard
        } else {
          toast.success("Account Created Successfully! Please login.");
          router.push("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: any) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const validateusername = (username: any) => username.match(/^[a-z0-9]+$/);

  const isUsernameInvalid = React.useMemo(() => {
    if (username === "") return false;

    return validateusername(username) ? false : true;
  }, [username]);

  const validatepass = (password: any) => password.match(/^.{8,}$/);

  const isPassInvalid = React.useMemo(() => {
    if (password === "") return false;

    return validatepass(password) ? false : true;
  }, [password]);

  const validateconfirmpass = (confirmpassword: any) =>
    confirmpassword.match(password);

  const isConfirmPassInvalid = React.useMemo(() => {
    if (confirmpassword === "") return false;

    return validateconfirmpass(confirmpassword) ? false : true;
  }, [confirmpassword]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <div className="flex flex-col sm:gap-[2.5rem] gap-[1rem] absolute top-[6rem] justify-around items-center sm:relative sm:top-0 z-10   backdrop-blur-md  rounded-[20px] border-[2px] border-customorange-400 sm:p-14 p-5">
      <div className="flex gap-[20px]">
        <Logo width={60} />
        <Divider
          className="h-[60px] bg-customorange-400"
          orientation="vertical"
        />

        <Image src="/data/logos/google.png" alt="G" width={60} height={60} />
      </div>

      <div className="w-[20rem] flex flex-col gap-[1.5rem] justify-center items-center">
        <Input
          isClearable
          isRequired
          type="text"
          autoFocus
          label="Username"
          isInvalid={isUsernameInvalid}
          color={isUsernameInvalid ? "danger" : "warning"}
          errorMessage="Username can only contain a-z 0-9"
          size="sm"
          className="max-w-[25rem] dark"
          value={username}
          onValueChange={setUsername}
          isDisabled={isLoading}
        />
        <Input
          isDisabled={username === "" ? true : false || isLoading}
          isClearable
          isRequired
          type="email"
          label="Email"
          isInvalid={isInvalid}
          color={isInvalid ? "danger" : "warning"}
          errorMessage="Please enter a valid email"
          size="sm"
          className="max-w-[25rem] dark"
          value={email}
          onValueChange={setEmail}
        />
        <Input
          isDisabled={
            isInvalid ? true : email === "" ? true : false || isLoading
          }
          isClearable
          type="password"
          label="Password"
          isInvalid={isPassInvalid}
          color={isPassInvalid ? "danger" : "warning"}
          errorMessage="Password must contain atleast 8 digits"
          size="sm"
          className="max-w-[25rem] dark"
          value={password}
          onValueChange={setPassword}
        />
        <Input
          value={confirmpassword}
          onValueChange={setConfirmPassword}
          isDisabled={
            isPassInvalid ? true : password === "" ? true : false || isLoading
          }
          isRequired
          label="Confirm Password"
          isInvalid={isConfirmPassInvalid}
          color={isConfirmPassInvalid ? "danger" : "warning"}
          errorMessage="Password must match with above password"
          size="sm"
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

        <div className=" text-customorange-600 flex justify-start w-[95%]">
          <Link href="/login">
            <span>Already Signed Up?</span>{" "}
          </Link>
        </div>
      </div>

      <Button
        isDisabled={
          isConfirmPassInvalid
            ? true
            : confirmpassword === ""
            ? true
            : false || isLoading
        }
        color="warning"
        variant="ghost"
        fullWidth={true}
        onClick={onSubmit}
        isLoading={isLoading}
        spinner={<Spinner color="white" size="sm" />}
      >
        {isLoading ? "Creating Account..." : "Sign In"}
      </Button>
      <div className=" w-[100%]">
        <GoogleAuthButton />
      </div>
    </div>
  );
}
