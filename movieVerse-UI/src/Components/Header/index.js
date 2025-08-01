import React,{useState,useEffect} from "react";
import Container from "react-bootstrap/Container";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { getUserId,getUserIdByToken } from "../../utils/getUserId";
import useLogout from "../../Hooks/useLogout";
import { adminClearRedis, adminGetandUploadProcessedVideos, adminGetRedis,adminUploadRawVideo,adminGetPresignedUrl,adminSaveVideoMetadata,adminUploadRawVideoPresignedUrl } from '../../api/adminAPI';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { getStreamUploadedData } from "../../api/streamingAPI";
// import { triggerN8NforMail } from "../../utils/sendAImail";

const HeaderComponent = () => {
    const [userIdByToken, setUserIdByToken] = useState(null);

    //for upload button->3 states
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileInputKey, setFileInputKey] = useState(Date.now()); // to reset file input

    //for convert button ->3 states
     const [showModal, setShowModal] = useState(false);
     const [rawVideoList, setRawVideoList] = useState([]);
     const [selectedVideo, setSelectedVideo] = useState(null);
     const [processing,setProccessing]=useState(false);


  const userId = getUserId();
  const logout = useLogout();
  const navData = [
    { name: "Home", link: "/" },
    { name: "Movies", link: "/movies" },
    { name: "Tv Series", link: "/series" },
    { name: "Search", link: "/search" },
    {name :"StreamTesting",link:"/streamtesting"},
    { name: "Profile", link: `/profile/${userIdByToken}` },
  ];
useEffect(() => {
  const fetchUserIdByToken = async () => {
    const userIdByToken = await getUserIdByToken();
    setUserIdByToken(userIdByToken);
  };
  fetchUserIdByToken();
}, []);



  // const clearRedis = async () => {
  //   try {
  //     const res = await adminClearRedis();
  //   } catch (error) {
  //     console.error("Error clearing Redis:", error.response?.data || error.message);
  //   }
  // };

  // const getRedis = async () => {
  //   try {
  //     const res = await adminGetRedis()
  //   } catch (error) {
  //     console.error("Error fetching Redis data:", error.response?.data || error.message);
  //   }
  // };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      setUploading(true);
      setUploadProgress(0);
       
    const preSignedResponse=await adminGetPresignedUrl(file);
    const { uploadUrl, s3Key,movieId } = preSignedResponse?.data;
    const s3Response=await adminUploadRawVideoPresignedUrl(uploadUrl,file,{onUploadProgress: (progressEvent) => {
    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setUploadProgress(progress);
  },});

    const videoDetails=  {
        movieId,
        originalFullName: file.name,
        movieTitle: file.name.replace(/\.[^/.]+$/, ""),
        s3UploadRawLink: `https://raw-videos-bucket-vivam.s3.ap-south-1.amazonaws.com/${s3Key}`,
        first_air_date: "2024-01-01", 
        poster_path: "",
        original_language: "en",
        vote_average: 5.5,
      };
    const metadataResponse = await adminSaveVideoMetadata(videoDetails)
      alert("Video uploaded successfully!");
    } catch (err) {
      console.error("Uploading Raw Video failed", err.response?.data || err.message);
      alert("Uploading Raw Video failed!");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setFileInputKey(Date.now()); // Reset file input so same file can be uploaded again
    }
  };

const openConvertModal = async () => {
  try {
    setShowModal(true);
    setSelectedVideo(null);
    const response = await getStreamUploadedData();
    setRawVideoList(response?.data?.data); 
  } catch (err) {
    console.error("Error fetching raw video list", err);
    alert("Failed to fetch video list");
  }

};

const handleProcess = async () => {
  if (!selectedVideo) {
    alert("Please select a video to process.");
    return;
  }
  try {
    setProccessing(true);
    const response = await adminGetandUploadProcessedVideos(selectedVideo); 
    alert("Video successfully converted and uploaded!");
    setShowModal(false);
  } catch (err) {
    console.error("Error converting video:", err);
    alert("Conversion failed.");
  }
    finally{
    setShowModal(false);
    setSelectedVideo(null);
    setRawVideoList([]);
    setProccessing(false);
  }
};

const handleModalClose = () => {
  setShowModal(false);
  setSelectedVideo(null);
  setRawVideoList([]);
  setProccessing(false);
};


   return (
    <header className="header">
  <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Select a Video to Process</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {rawVideoList.length === 0 ? (
      <p>No raw videos found.</p>
    ) : (
      <div className="list-group">
{rawVideoList.map((video) => {
  const { movieId, movieTitle,s3UploadProcessedLink } = video;
  const status = video.status || "unprocessed";

  const isDisabled = status === "processing" || status === "processed" ;
  const statusLabel = {
    unprocessed: "",
    processing: "⏳ (Processing)",
    processed: "✅ (Processed)",
    failed: "❌ (Failed)"
  }[status];
  return (
    <button
      key={movieId}
      className={`list-group-item list-group-item-action ${
        selectedVideo?.movieId === movieId ? "active" : ""
      }`}
      onClick={() => !isDisabled && setSelectedVideo(video)}
      disabled={isDisabled}
    >
      🎬 {movieTitle} {statusLabel}
    </button>
  );
})}

      </div>
    )}
    
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleModalClose}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleProcess} disabled={!selectedVideo || processing}>
      Process
    </Button>
      </Modal.Footer>
</Modal>
      <Navbar bg="dark" expand="lg">
        <Container>
          <Navbar.Brand>MovieVerse</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              {navData.map((item) => {
                return (
                <Nav key={item.name}>
                    <Link to={item.link}>{item.name}</Link>
                </Nav>
                );
              })}
            </Nav>
              <button
                onClick={logout}
              className="btn btn-outline-light me-2"
              style={{ borderRadius: "4px" }}
              >
                Logout
              </button>
              {/*admin Routes */}
              {/* <button onClick={clearRedis} className="btn btn-warning me-2">Clear Redis</button>
              <button onClick={getRedis} className="btn btn-info">Get Redis</button> */}
              {/* <buttton onClick={()=>{triggerN8NforMail("varunpratapsingh7213@gmail.com","values.fullname","Signup success","Hi,Welcome to MovieVerse")}} className="btn btn-primary">Trigger N8N</buttton> */}
              <input
                key={fileInputKey}
                type="file"
                id="rawVideoUpload"
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                onClick={() => document.getElementById("rawVideoUpload").click()}
                className="btn btn-success"
                disabled={uploading}
              >
                {uploading
                  ? `Uploading... ${uploadProgress}%`
                  : "Upload Raw Video"}
              </button>
              <button onClick={openConvertModal} className="btn btn-primary">Convert</button>
        
            
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default HeaderComponent;
