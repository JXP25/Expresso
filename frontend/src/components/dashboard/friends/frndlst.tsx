"use client";
import { Button, Input, Tooltip } from "@nextui-org/react";

import { use, useState, useEffect } from "react";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import React from "react";
import { DateInput } from "@nextui-org/react";
import { parseZonedDateTime } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { today } from "@internationalized/date";
import Shine from "./shine";
import { DatePicker } from "@nextui-org/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import FriendPicker from "./addfriends";
import Cards from "@/components/dashboard/room/cards";
import Image from "next/image";
import { blackops } from "@/app/fonts";
import SearchIcon from "@mui/icons-material/Search";
import Profile from "@/components/dashboard/friends/mainprofile";
import {
  fetchFriendRequests,
  deleteFriendRequest,
  fetchSelfDetails,
  deleteFriend,
} from "@/helpers/api";
import toast from "react-hot-toast";
export default function joinroom(props: any) {
  const [friends, setFriends] = useState([null]);
  useEffect(() => {
    fetchSelfDetails().then((data) => {
      setFriends(data);
      console.log("requests999", friends);
    });
  }, []); // Changed from [friends] to [] to prevent infinite loop
  const reject = async (id: number) => {
    await deleteFriend(id);
    toast.success("Friend Removed Successfully");
  };

  return (
    <Cards>
      <div
        className={` w-[100%] flex justify-between  text-wrap text-left text-[2rem] font-black ${blackops.className}`}
      >
        Friends
      </div>
      <div className="w-full bg-[rgba(25,25,25,0.9)] flex flex-col h-[75vh]   border-small px-[5px] py-[2px] rounded-bl-3xl  rounded-tl-3xl border-default-200 dark:border-default-100 dark overflow-y-auto">
        {friends ? (
          friends[0]?.friends?.map((friend: any, index) => (
            <Profile
              key={friend.id}
              username={friend.friend.username}
              user={friend.friend.username}
              photo={props.photo}
              inviteId={friend.friend.id}
              id={friend.id}
              index={index}
              reject={reject}
            />
          ))
        ) : (
          <div className="text-white">No Friends Found</div>
        )}
      </div>
    </Cards>
  );
}
