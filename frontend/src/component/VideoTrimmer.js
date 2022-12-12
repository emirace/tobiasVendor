import React, { useContext, useEffect, useRef, useState } from "react";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import styled from "styled-components";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { Store } from "../Store";
import axios from "axios";

const Button = styled.button`
  background: var(--orange-color);
  color: white;
  padding: 5px 7px;
  border-radius: 0.2rem;
  &:hover {
    background: var(--malon-color);
  }
`;

// let ffmpeg; //Store the ffmpeg instance
function VideoTrimmer({ dispatch, ctxDispatch }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [videoDuration, setVideoDuration] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoFileValue, setVideoFileValue] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [videoTrimmedUrl, setVideoTrimmedUrl] = useState("");
  const [videoTrimmed, setVideoTrimmed] = useState("");
  const videoRef = useRef();
  let initialSliderValue = 0;

  const ffmpeg = createFFmpeg({ log: true });

  //Handle Upload of the video
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const blobURL = URL.createObjectURL(file);
    setVideoFileValue(file);
    setVideoSrc(blobURL);
  };

  //Convert the time obtained from the video to HH:MM:SS format
  const convertToHHMMSS = (val) => {
    const secNum = parseInt(val, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let seconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    let time;
    // only mm:ss
    if (hours === "00") {
      time = minutes + ":" + seconds;
    } else {
      time = hours + ":" + minutes + ":" + seconds;
    }
    return time;
  };

  // useEffect(() => {
  //   //Load the ffmpeg script
  //   loadScript(
  //     "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js"
  //   ).then(async () => {
  //     if (typeof window !== "undefined") {
  //       // creates a ffmpeg instance.
  //       ffmpeg = window.FFmpeg.createFFmpeg({ log: true });
  //       //Load ffmpeg.wasm-core script
  //       await ffmpeg.load();
  //       //Set true that the script is loaded
  //       setIsScriptLoaded(true);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   const loadFFmpeg = async () => {
  //     await ffmpeg.load();
  //     setIsScriptLoaded(true);
  //   };
  //   loadFFmpeg();
  // }, []);
  //Get the duration of the video using videoRef
  useEffect(() => {
    if (videoRef && videoRef.current) {
      const currentVideo = videoRef.current;
      currentVideo.onloadedmetadata = () => {
        setVideoDuration(currentVideo.duration);
        setEndTime(currentVideo.duration);
      };
    }
  }, [videoSrc]);

  //Called when handle of the nouislider is being dragged
  const updateOnSliderChange = (values, handle) => {
    setVideoTrimmedUrl("");
    let readValue;
    if (handle) {
      readValue = values[handle] | 0;
      if (endTime !== readValue) {
        setEndTime(readValue);
      }
    } else {
      readValue = values[handle] | 0;
      if (initialSliderValue !== readValue) {
        initialSliderValue = readValue;
        if (videoRef && videoRef.current) {
          videoRef.current.currentTime = readValue;
          setStartTime(readValue);
        }
      }
    }
  };

  //Play the video when the button is clicked
  const handlePlay = () => {
    if (videoRef && videoRef.current) {
      videoRef.current.play();
    }
  };

  //Pause the video when then the endTime matches the currentTime of the playing video
  const handlePauseVideo = (e) => {
    const currentTime = Math.floor(e.currentTarget.currentTime);

    if (currentTime === endTime) {
      e.currentTarget.pause();
    }
  };

  //Trim functionality of the video
  const handleTrim = async () => {
    // if (isScriptLoaded) {
    await ffmpeg.load();
    const { name, type } = videoFileValue;
    //Write video to memory
    ffmpeg.FS("writeFile", name, await fetchFile(videoFileValue));
    const videoFileType = type.split("/")[1];
    //Run the ffmpeg command to trim video
    await ffmpeg.run(
      "-i",
      name,
      "-ss",
      `${convertToHHMMSS(startTime)}`,
      "-to",
      `${convertToHHMMSS(endTime)}`,
      "-acodec",
      "copy",
      "-vcodec",
      "copy",
      `out.${videoFileType}`
    );
    //Convert data to url and store in videoTrimmedUrl state
    const data = ffmpeg.FS("readFile", `out.${videoFileType}`);
    const newFile = new Blob([data.buffer]);
    console.log(newFile);
    await videouploadHandler(data);
    const file = new File([newFile], videoFileValue.name, {
      type: "mp4",
      lastModified: Date.now(),
    });
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: videoFileValue.type })
    );
    setVideoTrimmedUrl(url);
  };
  const videouploadHandler = async (e) => {
    const file = e;
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      dispatch({ type: "VIDEO_REQUEST" });
      const { data } = await axios.post(
        "/api/upload/video/upload",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log(data);
      dispatch({ type: "VIDEO_SUCCESS", payload: data.secure_url });

      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Video Uploaded",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (error) {
      dispatch({ type: "VIDEO_FAIL" });
    }
  };
  return (
    <div className="VideoTrimmer">
      <input type="file" onChange={handleFileUpload} />
      <br />
      {videoTrimmedUrl ? (
        <video controls>
          <source src={videoTrimmedUrl} type={videoFileValue.type} />
        </video>
      ) : videoSrc.length ? (
        <React.Fragment>
          <video src={videoSrc} ref={videoRef} onTimeUpdate={handlePauseVideo}>
            <source src={videoSrc} type={videoFileValue.type} />
          </video>
          <br />
          <Nouislider
            behaviour="tap-drag"
            step={1}
            margin={3}
            limit={30}
            range={{ min: 0, max: videoDuration || 2 }}
            start={[0, videoDuration || 2]}
            connect
            onUpdate={updateOnSliderChange}
          />
          <br />
          Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration:{" "}
          {convertToHHMMSS(endTime)}
          <br />
          <Button onClick={handlePlay}>Play</Button> &nbsp;
          <Button onClick={handleTrim}>Trim</Button>
          <br />
          videoTrimmedUrl && (
          <video controls>
            <source src={videoTrimmedUrl} type={videoFileValue.type} />
          </video>
          )
        </React.Fragment>
      ) : (
        ""
      )}
    </div>
  );
}

export default VideoTrimmer;
