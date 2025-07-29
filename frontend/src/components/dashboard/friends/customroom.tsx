"use client";
import React, { useEffect, useState } from "react";
import Cards from "@/components/dashboard/friends/cards";
import Image from "next/image";
import { blackops } from "@/app/fonts";

import Profile from "@/components/dashboard/friends/reqprofile";
import {
  fetchFriendRequests,
  updateFriendRequest,
  deleteFriendRequest,
} from "@/helpers/api";
import toast from "react-hot-toast";
export default function joinroom(props: any) {
  const [requests, setRequests] = useState([null]);
  const accept = async (index: number) => {
    await updateFriendRequest(requests[index].id, "accepted").then;
    toast.success("Friend Added");
  };
  const reject = async (index: number) => {
    await deleteFriendRequest(requests[index].id);
    toast.success("Friend Request Rejected");
  };
  useEffect(() => {
    fetchFriendRequests().then((data) => {
      setRequests(data);
    });
  }, []); 

  return (
    <Cards>
      <div
        className={` w-[100%] flex justify-between  text-wrap text-left text-[2rem] font-black ${blackops.className}`}
      >
        Friend Requests
      </div>

      <div className="w-full max-h-[12.5rem] min-h-[12.5rem] flex flex-col   border-small px-[5px] py-[2px] rounded-l-3xl border-default-200 dark:border-default-100 dark overflow-y-auto">
        {requests.map(
          (request, index) =>
            request?.currentStatus === "pending" && (
              <Profile
                key={request.id}
                username={request.from_user.username}
                user={request.from_user.username}
                photo={props.photo}
                accept={accept}
                reject={reject}
                index={index}
              />
            )
        )}
      </div>
    </Cards>
  );
}
