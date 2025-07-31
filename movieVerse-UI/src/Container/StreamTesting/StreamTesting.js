import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardMoviesStream from "../../Components/CardMoviesStream/CardMoviesStream";
import { getStreamUploadedData } from "../../api/streamingAPI";

const StreamTesting = () => {
     const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const GetDataTrending = async () => {
    // const data = {
    //   results: [
    //     {
    //       id: 93405,
    //       originalFullName: "오징어 게임",
    //       movieTitle: "Squid Game",

    //       poster_path: "/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg",
    //       first_air_date: "2021-09-17",
    //       vote_average: 7.865,
    //       original_language: "ko",
    //     },

    //     {
    //       id: 112470,
    //       originalFullName: "Ici tout commence",
    //       movieTitle: "Ici tout commence",

    //       poster_path: "/x9HeaagUAyyGl1fQ6exQcpELBxP.jpg",
    //       first_air_date: "2020-11-02",
    //       vote_average: 6.839,
    //       original_language: "fr",
    //     },
    //     {
    //       id: 65270,
    //       originalFullName: "라디오스타",
    //       movieTitle: "Radio Star",

    //       poster_path: "/uRUZDsvUfIP3JUEgOC8ReBlQQUU.jpg",
    //       first_air_date: "2007-05-30",
    //       vote_average: 7.3,
    //       original_language: "ko",
    //     },
    //     {
    //       id: 50821, //
    //       movieTitle: "Among Friends", //
    //       originalFullName: "hu", //

    //       poster_path: "/kBBbSgNchtMvsgD6z1oI1RRluHP.jpg", //
    //       first_air_date: "1998-10-26", //
    //       vote_average: 3.1, //
    //       original_language: "EN",
    //     },
    //   ],
    // };
    // setContent(data.results);
  try{
    const res = await getStreamUploadedData();
    setContent(res?.data?.data);
  }
  catch(error){
    const status=error.response?.status;
    const message=error.response?.data?.message;
    console.error("Error in feching uploaded Movies",error);
    if(status===401 || status === 403){
      alert(message);
      navigate("/")
    }
    else if(status===404){
      alert(message);
      navigate("/home")
    }
  }
  };

  useEffect(() => {
    GetDataTrending();
  }, []);

  return (
    <main className="homePage">
      <Container>
        <Row>
          <Col className="col-12">
            <section>
              <h1 className="txtCenter">Trending Stream Series</h1>
            </section>
          </Col>
        </Row>
        <Row>
          <Col className="col-10">
            <Row>
              {content && content.length > 0
                ? content.map((item, index) => {
                    return (
                      <CardMoviesStream
                        key={index}
                        data={item}
                        mediaType="tv"
                      />
                    );
                  })
                : "Loading ...."}
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default StreamTesting;
