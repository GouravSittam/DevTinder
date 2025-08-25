import { FaPhoneAlt, FaPhoneSlash, FaMicrophoneSlash, FaVideoSlash, FaMicrophone, FaVideo } from "react-icons/fa";
import { useState, useEffect, useRef, use } from "react";
import Peer from "simple-peer";
import { useSelector } from "react-redux";

const IncomingCallNotification = ({
  callerDetails,
  setCallAccepted,
  setRecievingCall,
  setCallerDetails,
  socket,
  callerSignal,
  callAccepted
}) => {

  // ✅ Use a ref for the stream to avoid stale closures
  const streamRef = useRef(null); 

  // You can keep a state just to know IF a stream exists, to trigger UI updates
  const [hasStream, setHasStream] = useState(false); 

  const myVideo = useRef(null);

  const receiverVideo = useRef(null); // receiver video ref

  const connectionRef = useRef(); // current user peer ref

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

    // ✅ This effect will correctly attach the stream AFTER the component re-renders
  useEffect(() => {
    if (hasStream && myVideo.current && streamRef.current) {
      myVideo.current.srcObject = streamRef.current;
    }
  }, [hasStream]); // This runs whenever `hasStream` changes


  useEffect(() => {
    if (!socket) return;

        // ✅ Add the listener for when the other user ends the call
    const handleCallEnded = () => {
      // We call the same cleanup function used by the hang-up button
      endCallCleanup();
    };

    socket.on("callEnded", handleCallEnded);

    // ✅ Return a cleanup function to remove the listener when the component unmounts
    return () => {
      socket.off("callEnded", handleCallEnded);
    };
  }, [socket]);


  const handleAcceptCall = async () => {
    try {
      const currStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: true,
      });

      // ✅ Set the ref's current value
      streamRef.current = currStream; 
      setHasStream(true); 

      if (myVideo.current) {
        myVideo.current.srcObject = currStream;
      }

      currStream.getAudioTracks().forEach((track) => {
        track.enabled = true; // Enable audio track
      });

      setCallAccepted(true);
      setRecievingCall(true);

      const peer = new Peer({
        initiator: false, // This user isn't the call initiator
        trickle: false, // Preventing trickle of ICE candidates, ensuring a single signal exchange
        stream: currStream,
      });

      peer.on("signal", (data) => {
        socket.emit("answeredCall", {
          signalData: data, // ✅ WebRTC signal data required for establishing connection
          from: socket.id, // ✅ ID of the user accepting the call
          to: callerDetails?.from, // ✅ socket ID of the caller
        });
      });

      // listening for incoming video stream from server to receiver
      peer.on("stream", (remoteStream) => {
        if (receiverVideo.current) {
          receiverVideo.current.srcObject = remoteStream; // Set the receiver video stream
          receiverVideo.current.muted = false; // Unmute the receiver video
          receiverVideo.current.volume = 1.0; // Set volume to 1
        }
      });

      if (callerSignal) {
        peer.signal(callerSignal); // Signal the caller's data to establish connection
      }

      connectionRef.current = peer;
    } catch (error) {
      console.error("Error accepting call:", error);
    }
  };

  const handleDeclineCall = () => {
    // This function now also handles hanging up the call
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    socket.emit("rejectCall", {
      to: callerDetails.from,
      name: callerDetails.name,
      profilepic: callerDetails.profilepic,
    });

    setRecievingCall(false);
    setCallerDetails(null);
  };

    // ✅ End call cleanup logic
const endCallCleanup = () => {
  // 1. Stop all media tracks (camera + mic)
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
  }

  // 2. Destroy peer connection
  if (connectionRef.current) {
    connectionRef.current.destroy();
  }


  // Reset state
  setHasStream(false);
  streamRef.current = null;
  setRecievingCall(false);
  setCallAccepted(false);
  setCallerDetails(null);
  connectionRef.current = null;

};

  // ✅ New function for the user clicking the hang-up button
  const hangUpCall = () => {
    // First, notify the other user that the call is ending
    if (callerDetails) { // callerDetails holds the callee's socket ID
      socket.emit("endCall", { to: callerDetails.from });
    }
    // Then, perform the local cleanup
    endCallCleanup();
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

    if (callAccepted) {
    return (
      <div className="absolute inset-0 bg-black z-100 flex flex-col justify-between text-white">
        
        {/* Background: Shows blurred user photo before call is accepted (though it's accepted here, this structure is for consistency) */}
        {/* This part is less relevant here since we jump straight to accepted, but good for structure */}
        {!receiverVideo.current?.srcObject && (
          <>
            <img
              src={callerDetails?.profilepic || "/default-avatar.png"}
              alt="User background"
              className="absolute inset-0 w-full h-full object-contain blur-md z-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/50 z-0"></div>
          </>
        )}

        {/* Remote Video - shows only when call is accepted */}
          <video
            ref={receiverVideo}
            autoPlay
            playsInline
            className="absolute top-0 left-0 w-full h-full object-contain z-0"
          />

        {/* UI Overlays for better text visibility */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

        {/* Header with Target User Info */}
        <div className="relative z-20 p-4 flex items-center space-x-3">
          <img
            src={callerDetails?.profilepic || "/default-avatar.png"}
            alt="Target User"
            className="w-10 h-10 rounded-full border-2 border-white"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-bold">{callerDetails?.name}</h3>
            <p className="text-sm text-gray-300">
              Connected
            </p>
          </div>
        </div>

        {/* Local Video (PiP) - always shows when your stream is active */}
        {hasStream && (
          <div className="absolute top-5 right-5 w-28 h-40 md:w-32 md:h-48 bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-gray-600 z-20">
            <video
              ref={myVideo}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Call Controls at the bottom */}
        <div className="relative z-20 p-4 flex justify-center items-center space-x-6">
          
            <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full cursor-pointer">
            {isMuted ? (
              <FaMicrophoneSlash size={24} onClick={toggleMute} />
              ) : (
                <FaMicrophone size={24} onClick={toggleMute} />
                )}
            </button>

          <button
            onClick={hangUpCall}
            className="bg-red-600 hover:bg-red-700 p-4 rounded-full text-white transition-all cursor-pointer"
            aria-label="Hang up"
          >
            <FaPhoneSlash size={28} />
          </button>
          
            <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full cursor-pointer">
              {isVideoOff ? (
                <FaVideoSlash size={24} onClick={toggleVideo} />
              ) : (
                <FaVideo size={24} onClick={toggleVideo} />
              )}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/40 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 transition-colors duration-200">
        <div className="flex flex-col items-center">
          <p className="font-black text-xl mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            Call From...
          </p>
          <img
            src={callerDetails?.profilepic || "/default-avatar.png"}
            alt="Caller"
            className="w-20 h-20 rounded-full border-4 border-green-500"
          />
          <h3 className="text-lg font-bold mt-3 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {callerDetails?.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-300 transition-colors duration-200">
            {callerDetails?.email}
          </p>
          <div className="flex gap-4 mt-5">
            <button
              type="button"
              onClick={handleAcceptCall}
              className="bg-green-500 text-white px-4 py-1 rounded-lg w-28 flex gap-2 justify-center items-center"
            >
              Accept <FaPhoneAlt />
            </button>
            <button
              type="button"
              onClick={handleDeclineCall}
              className="bg-red-500 text-white px-4 py-2 rounded-lg w-28 flex gap-2 justify-center items-center"
            >
              Reject <FaPhoneSlash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
