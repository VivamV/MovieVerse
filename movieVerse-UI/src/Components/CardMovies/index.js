import React from "react";
import { Link } from "react-router-dom";
import { img_300, img_not_available } from "../../Config";
import { useNavigate } from "react-router-dom";
const CardMoviesComponents = ({ data, mediaType }) => {
  const navigate = useNavigate();

  const title = data.original_title || data.name;
  const id = data.id;
  const ImageURL = data.poster_path
    ? img_300 + data.poster_path
    : img_not_available;
  const media_type = data.media_type
    ? data.media_type
    : data.type
    ? data.type
    : mediaType;
  const release_date = data.release_date || data.first_air_date;
  const vote_average = parseInt(data.vote_average);
  const original_language = data.original_language || "";

  const handleTicketBooking = () => {
    const movieId = id;
    navigate(`/theatre-booking/${movieId}/${media_type}`, {
      state: { movieTitle: title, movieId, media_type },
    });
  };
  const handleTVStreaming = () => {
    alert("Streaming feature for these files coming soon,for testing move to StreamingTesting");
    //  navigate("/tv-streaming");
  };
  const today = new Date();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 3);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const releaseDateObj = new Date(release_date);

  const isBookable =
    media_type === "movie" &&
    releaseDateObj >= oneMonthAgo &&
    releaseDateObj < tomorrow;

  return (
    <>
      <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6">
        <Link to={`/details/${id}/${media_type}`} className="video-thumb">
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
              {media_type}
              <b>{original_language}</b>
            </div>
          </figure>
          <div className="video-content">
            <ul className="tags">
              <li>Release Date</li>
            </ul>
            <small className="range">{release_date}</small>
            <h3 className="name">{title}</h3>
          </div>
        </Link>
        {media_type === "movie" && (
          <>
            {isBookable ? (
              <button
                className="book-btn"
                onClick={() => handleTicketBooking(id)}
              >
                Book
              </button>
            ) : releaseDateObj < oneMonthAgo ? (
              <button
                className="book-btn closed"
                onClick={() =>
                  alert(
                    "Movie is older than one month. Booking closed for this."
                  )
                }
              >
                Closed
              </button>
            ) : (
              <button
                className="book-btn coming-soon"
                onClick={() => alert("Movie will be available soon.")}
              >
                Coming Soon
              </button>
            )}
          </>
        )}

        {media_type === "tv" && (
          <button className="book-btn" onClick={() => handleTVStreaming(id)}>
            Stream
          </button>
        )}
      </div>
    </>
  );
};

export default CardMoviesComponents;
