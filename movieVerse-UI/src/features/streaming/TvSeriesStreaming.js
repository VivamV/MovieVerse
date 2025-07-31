import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import shaka from "shaka-player/dist/shaka-player.ui";
import "shaka-player/dist/controls.css"; // THIS IS IMPORTANT FOR UI CONTROLS TO SHOW

const ShakaPlayerWithUI = () => {
  const location = useLocation();
  const { movieId, originalFullName, rawFileS3Link, processedFileS3Link,status } =location.state;

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    shaka.polyfill.installAll();

    if (
      shaka.Player.isBrowserSupported() &&
      videoRef.current &&
      containerRef.current &&
      rawFileS3Link &&
      processedFileS3Link
      && status==="processed"
    ) {
      const player = new shaka.Player(videoRef.current);
      const ui = new shaka.ui.Overlay(
        player,
        containerRef.current,
        videoRef.current
      );

      //   const uiConfig = {
      //     controlPanelElements: [
      //       'play_pause',
      //       'time_and_duration',
      //       'spacer',
      //       'volume',
      //       'mute',
      //       'quality', // THIS SHOWS QUALITY OPTIONS
      //       'fullscreen',
      //       'overflow_menu',
      //     ],
      //     overflowMenuButtons: ['playback_rate', 'captions', 'quality'], // quality in overflow too
      //     addBigPlayButton: true,
      //     autoHide: true,
      //   };

      //   ui.configure(uiConfig);
      // `https://processed-videos-movieverse.s3.ap-south-1.amazonaws.com/dash/${movieId}_${originalFullName}/output.mpd`
      // https://processed-videos-movieverse.s3.ap-south-1.amazonaws.com/dash/9ca35892-873f-4f9d-9fbf-0081a9453bac_Fan__7C_Official_Trailer__7C_Shah_Rukh_Khan.mp4/output.mpd
      // 9ca35892-873f-4f9d-9fbf-0081a9453bac_Fan__7C_Official_Trailer__7C_Shah_Rukh_Khan.mp4/
      // .load('https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd')
      player
        .load(processedFileS3Link)
        .then(() => console.log("Video loaded with UI"))
        .catch((e) => console.error("Error loading video", e));

      return () => {
        player.destroy();
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        position: "relative",
        backgroundColor: "black",
      }}
    >
      <video
        ref={videoRef}
        style={{ width: "100%", height: "100%" }}
        autoPlay
        // muted
        //  DO NOT use `controls` here — Shaka UI handles that
      />
    </div>
  );
};

export default ShakaPlayerWithUI;
