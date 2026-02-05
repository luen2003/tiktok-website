import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { VideoType } from "../../types/Video";
import { RiShareForwardFill } from "react-icons/ri";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { MdInsertComment } from "react-icons/md";
import {
  IoMdPause,
  IoMdPlay,
  IoMdVolumeHigh,
  IoMdVolumeOff,
} from "react-icons/io";
import { toast } from "react-hot-toast";

const VideoStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 2rem);

  .video {
    position: relative;
    width: 100%;
    max-width: 420px;
    height: 100%;
    border-radius: 1rem;
    overflow: hidden;
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;

    video {
      width: 100%;
      height: 100%;
      max-height: 100%;
      object-fit: contain;
      background: black;
    }

    .video-actions {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 0.5rem;
      display: flex;
      justify-content: space-between;
      z-index: 2;

      button {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: rgb(var(--light-color));
        transition: 0.15s;

        &:hover {
          background: rgb(var(--light-color) / 0.25);
        }

        svg {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }

    .video-details {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0 3rem 1rem 1rem;
      background: linear-gradient(
        0deg,
        rgba(var(--dark-color) / 0.8) 0%,
        rgba(var(--dark-color) / 0) 100%
      );
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: 2;

      p {
        font-size: 0.9rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .creator-details {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        img {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          object-fit: cover;
        }

        button {
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          border-radius: 0.25rem;
          background: rgb(var(--primary-color));
        }
      }
    }

    .buttons {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 2rem 0.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      z-index: 2;

      > div {
        text-align: center;

        span {
          font-size: 0.75rem;
        }

        &.like button.liked {
          color: rgb(var(--like-color));
        }

        &.dislike button.disliked {
          color: rgb(var(--primary-color));
        }
      }

      button {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: rgb(var(--light-color));
        transition: 0.15s;

        &:hover {
          background: rgb(var(--light-color) / 0.25);
        }

        svg {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }
    .buttons {
  button {
    color: rgba(0, 0, 0, 0.9);
  }
&:hover {
  background: rgba(0, 0, 0, 0.6);
}

}
.buttons {
  button {
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(4px);
    color: white;
  }

  button:hover {
    background: rgba(0, 0, 0, 0.9);
  }
}
.buttons {
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;

    span {
      min-width: 2rem;
      height: 2rem;
      padding: 0 0.5rem;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 0.7rem;
      color: white;

      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(4px);

      border-radius: 999px;
      line-height: 1;
      user-select: none;
    }
  }
}

`;

const Video = ({
  video,
  mute,
  setMute,
  playingVideo,
  setPlayingVideo,
}: {
  video: VideoType;
  mute: boolean;
  setMute: React.Dispatch<React.SetStateAction<boolean>>;
  playingVideo: string | null;
  setPlayingVideo: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const [play, setPlay] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const isPlaying = playingVideo === video.postId;
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    isPlaying
      ? videoRef.current.play()
      : videoRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
  const el = videoRef.current;
  if (!el) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      // ⛔ nếu user đã pause thì KHÔNG auto play
      if (userPaused) return;

      if (entry.isIntersecting && playingVideo !== el.id) {
        el.play().catch(() => {});
        setPlayingVideo(el.id);
      }
    },
    { threshold: 0.6 }
  );

  observer.observe(el);
  return () => observer.disconnect();
}, [playingVideo, setPlayingVideo, userPaused]);


  //  useEffect(() => {
  //   if (playingVideo === video.postId) {
  //     setPlay(true);
  //   } else {
  //     setPlay(false);
  //   }
  // }, [playingVideo, video.postId]);
  // useEffect(() => {
  //   play ? videoRef.current?.play() : videoRef.current?.pause();
  // }, [play]);

  return (
    <VideoStyled>
      <div className="video">
        <video
          ref={videoRef}
          id={video.postId}
          src={video.submission.mediaUrl}
          poster={video.submission.thumbnail}
          muted={mute}
          loop
          playsInline
          onClick={() =>
            setPlayingVideo(
              playingVideo === video.postId ? null : video.postId
            )
          }
        />

        <div className="video-actions">
<button
  onClick={() => {
    if (isPlaying) {
      setUserPaused(true);
      setPlayingVideo(null);
    } else {
      setUserPaused(false);
      setPlayingVideo(video.postId);
    }
  }}
>
  {isPlaying ? <IoMdPause /> : <IoMdPlay />}
</button>

          <button onClick={() => setMute(!mute)}>
            {mute ? <IoMdVolumeOff /> : <IoMdVolumeHigh />}
          </button>
        </div>

        <div className="video-details">
          <div className="creator-details">
            <img src={video.creator.pic} />
            <p>{video.creator.name}</p>
            <button>Subscribe</button>
          </div>
          <p>{video.submission.title}</p>
          <p>{video.submission.description}</p>
        </div>

        <div className="buttons">
          <div className="like">
            <button
              className={liked ? "liked" : ""}
              onClick={() => {
                setDisliked(false);
                setLiked(!liked);
              }}
            >
              <FaThumbsUp />
            </button>
            <span>{liked ? video.reaction.count + 1 : video.reaction.count}</span>
          </div>

          <div className="dislike">
            <button
              className={disliked ? "disliked" : ""}
              onClick={() => {
                setLiked(false);
                setDisliked(!disliked);
                toast.success("Thank you for your feedback!");
              }}
            >
              <FaThumbsDown />
            </button>
            <span>Dislike</span>
          </div>

          <div>
            <button onClick={() => toast.success("Coming soon!")}>
              <MdInsertComment />
            </button>
            <span>0</span>
          </div>

          <div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(video.submission.mediaUrl);
                toast.success("Copied!");
              }}
            >
              <RiShareForwardFill />
            </button>
            <span>Share</span>
          </div>
        </div>
      </div>
    </VideoStyled>
  );
};

export default Video;
