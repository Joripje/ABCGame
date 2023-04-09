import { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import styled from "styled-components";

function ABCam(props) {
  const videoRef = useRef();
  const canvasRef = useRef();
  // const [count, setCount] = useState(0);

  let mouthOpen = false;
  let prevMouthOpen = false;

  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      const landmarks = detections[0].landmarks;
      const mouthLeft = landmarks.getMouth()[0];
      const mouthRight = landmarks.getMouth()[6];
      const mouthTop = landmarks.getMouth()[13];
      const mouthBottom = landmarks.getMouth()[19];
      const mouthWidth = mouthRight.x - mouthLeft.x;
      const mouthHeight = (mouthBottom.y - mouthTop.y) * 2;
      const mouthAspectRatio = mouthWidth / mouthHeight;

      if (mouthAspectRatio > 0.5 && mouthAspectRatio < 1.5) {
        // console.log("입을 벌린 것 같습니다.");
        mouthOpen = true;
      } else {
        // console.log("입을 다물고 있습니다.");
        mouthOpen = false;
      }

      if (prevMouthOpen && !mouthOpen) {
        // setCount((count) => count + 1);
        props.AB();
      }

      prevMouthOpen = mouthOpen;

      // DRAW YOU FACE IN WEBCAM
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );
      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      });
    }, 200);
  };

  return (
    <div className="myapp">
      {/* <div>냠:{count}</div> */}
      <div>
        <Video crossOrigin="anonymous" ref={videoRef} autoPlay />
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default ABCam;
