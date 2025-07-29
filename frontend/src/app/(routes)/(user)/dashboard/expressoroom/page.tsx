"use client";
import { useEffect, useState } from "react";

import Loader from "@/components/dashboard/loader";
import Quickroom from "@/components/dashboard/room/quickroom";
import Joinroom from "@/components/dashboard/room/joinroom";
import Customroom from "@/components/dashboard/room/customroom";
import Upcoming from "@/components/dashboard/room/upcoming";
import Tasks from "@/components/dashboard/room/tasks";
import WordRotate from "@/components/dashboard/word-rotate";
import TypingAnimation from "@/components/dashboard/typinganimation";
import Topbar from "@/components/dashboard/topbar";
import Sections from "@/components/dashboard/room/sections";
import Profile from "@/components/dashboard/room/profile";
import ViewAI from "@/components/dashboard/room/viewai";
import Particles from "@/components/landingpage/particles";
import { fetchSelfDetails } from "@/helpers/api";
import React from "react";
import Createroom from "@/components/dashboard/room/createroom";
export default function Dashboard() {


  // const [
  //   mousePosition,
  //   setMousePosition
  // ] = React.useState({ x: 0, y: 350 });
  // React.useEffect(() => {
  //   const updateMousePosition = (ev: any) => {
  //     setMousePosition({ x: ev.clientX, y: ev.clientY });
  //   };
  //   window.addEventListener('mousemove', updateMousePosition);
  //   return () => {
  //     window.removeEventListener('mousemove', updateMousePosition);
  //   };
  // }, []);





  const [user, setUser] = useState("Jai");
  const [username, setUsername] = useState("jaipannu08");
  const [mail, setMail] = useState("ce230004019@iiti.ac.in");
  const [selfDetails, setSelfDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    
    setTimeout(() => setLoading(false), 2500);
    async function loadSelfDetails() {
      try {
        const data = await fetchSelfDetails();
        setSelfDetails(data);
      console.log("data",selfDetails);
      } catch (error) {
        console.error("Failed to fetch self details:", error);
      }
    }
    loadSelfDetails();

  }, []);
  if (loading) {
    return (
      <>
        {selfDetails.map((detail) =>(<Loader user={detail.username}/>))}
      </>
    );
  } else {
    return (
      <>
      <Particles className="absolute w-full h-full" />
      <div className={`flex gap-[10px] w-[100%] justify-around [@media(max-width:1100px)]:flex-col lg:flex-row  `}>
        {/* <div className=" absolute -z-0 -translate-x-[50%] -translate-y-[50%]  bg-customorange-700 w-[40%] h-[40%] blur-[500px] opacity-[0.3]"  style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }}></div> */}


        <div className=" flex [@media(max-width:1100px)]:flex-col-reverse lg:flex-row gap-[10px] w-[100%]">
          <Sections>


            <div className=" enter w-[100%]">
            <Joinroom />
            </div>
            <div className=" enter w-[100%]">
            <Createroom details={selfDetails[0].id} />
            </div>
            <div className=" w-[100%] flex flex-col gap-[10px] sm:flex-row">
              <div className=" [@media(min-width:1101px)]:hidden w-[100%] h-[100%]">
                <Quickroom />
              </div>
              <div className=" enter2 w-[100%]">
              <Customroom />
              </div>
            </div>




          </Sections>

          <div className=" w-[100%] items-center min-w-[270px] justify-around   flex flex-col gap-[10px]">
          <div className=" enter7 w-[100%]">
            <Topbar></Topbar>
            </div>
            <div className=" [@media(min-width:1101px)]:hidden w-[100%]">
            <div className=" enter5 w-[100%]">
            {selfDetails.map((detail) => (
              <Profile user={detail.username}/>
            ))}
              </div>
            </div>
            <div className=" enter8 w-[100%]">
            <ViewAI />
            </div>
            <div className=" [@media(max-width:1100px)]:hidden w-[100%] ">
            <div className=" enter3 w-[100%]">
              <Quickroom />
              </div>
            </div>
          </div>

        </div>
        <Sections>
          <div className=" [@media(max-width:1100px)]:hidden w-[100%]">
          <div className=" enter4 w-[100%]">
            {selfDetails.map((detail) => (
              <Profile user={detail.username}/>
            ))}
            </div>
          </div>
          <div className=" enter5 w-[100%]">
          <Upcoming />
          </div>
          <div className=" enter6 w-[100%]">
          <Tasks />

          </div>

        </Sections>





      </div>
      </>





    );
  }
}