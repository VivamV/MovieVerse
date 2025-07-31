import React from "react";
import { Link } from "react-router-dom";
import { img_300, img_not_available } from "../../Config";
import { useNavigate } from "react-router-dom";
const CardMoviesStream = ({ data, mediaType }) => {
  const navigate = useNavigate();

  const title = data.movieTitle;
  const id = data.id || data.movieId;
  
  const ImageURL = data.poster_path
    ? img_300 + data.poster_path
    : img_not_available;
  const release_date = data.release_date || data.first_air_date || "2020-11-5";
  const vote_average = parseInt(data?.vote_average || 5.2);
  const original_language = data.original_language || "EN";

  const s3uploadProcessedLink = data?.s3UploadProcessedLink;
  const s3UploadRawLink = data?.s3UploadRawLink;

  const handleTVStreaming = () => {
    if (s3UploadRawLink && s3uploadProcessedLink) {
      navigate("/tv-streaming", {
        state: {
          movieId: id,
          originalFullName: data?.originalFullName,
          rawFileS3Link: data?.s3UploadRawLink,
          processedFileS3Link: data?.s3UploadProcessedLink,
        },
      });
    } else {
      alert("Please upload raw and processed files first");
    }
  };

  return (
    <>
      <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6">
        <Link to="" className="video-thumb">
          <figure className="video-image">
            <span>
              <img src={ImageURL} alt={title} />
            </span>
            <div className="circle-rate">
              <svg
                className="circle-chart"
                viewBox="0 0 30 30"
                width="100"
                height="100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="circle-chart__background"
                  stroke="#2f3439"
                  strokeWidth="2"
                  fill="none"
                  cx="15"
                  cy="15"
                  r="14"
                ></circle>
                <circle
                  className="circle-chart__circle"
                  stroke="#4eb04b"
                  strokeWidth="2"
                  strokeDasharray={`${vote_average}0,100`}
                  cx="15"
                  cy="15"
                  r="14"
                ></circle>
              </svg>
              <b>{vote_average}</b>
            </div>
            <div className="hd">
              {mediaType}
              <b>{original_language}</b>
            </div>
          </figure>
          <div className="video-content">
            <ul className="tags">
              <li>Release Date</li>
            </ul>
            <small className="range">{release_date}</small>
            {/* <h3 className="name">{title}</h3> */}
            <h3 className="name text-white text-base font-bold mt-1 break-words whitespace-normal overflow-hidden">
              {title}
            </h3>
          </div>
        </Link>
        {mediaType === "tv" && s3UploadRawLink && s3uploadProcessedLink ? (
          <button className="book-btn" onClick={() => handleTVStreaming(id)}>
            Stream
          </button>
        ) : (
          "Not available"
        )}
      </div>
    </>
  );
};

export default CardMoviesStream;
