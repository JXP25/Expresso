"use client";
import { loginWithGoogle } from "@/helpers/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/components/dashboard/loading";
import Particles from "@/components/landingpage/particle";

const Google = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (codeParam: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await loginWithGoogle(codeParam);
      if (result) {
        toast.success("Successfully logged in with Google!");
        router.push("/dashboard");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again.");
      toast.error("Google login failed. Please try again.");
      setTimeout(() => {
        router.push("/login?error=google_auth_failed");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    // Handle OAuth errors
    if (error) {
      setError(`OAuth error: ${error}`);
      toast.error(`OAuth error: ${error}`);
      setTimeout(() => {
        router.push("/login?error=oauth_error");
      }, 2000);
      return;
    }

    // Validate state parameter for CSRF protection
    if (code && state) {
      const storedState = sessionStorage.getItem("google_oauth_state");
      if (state === storedState) {
        // Clear the stored state
        sessionStorage.removeItem("google_oauth_state");
        login(code);
      } else {
        setError("Invalid state parameter. Please try again.");
        toast.error("Invalid state parameter. Please try again.");
        setTimeout(() => {
          router.push("/login?error=invalid_state");
        }, 2000);
      }
    } else if (code) {
      // Fallback for cases where state might not be present
      login(code);
    } else {
      setError("No authorization code received.");
      toast.error("No authorization code received.");
      setTimeout(() => {
        router.push("/login?error=no_code");
      }, 2000);
    }
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-red-400">{error}</p>
          <p className="mt-4 text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Particles />
      <Loader />
    </>
  );
};

export default Google;
