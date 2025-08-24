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
  justify-content: flex-start;
  cursor: pointer;
  gap: 1rem;
  height: calc(100vh - 2rem);

  .video {
    height: 100%;
    aspect-ratio: 9 / 16;
    position: relative;
    border-radius: 1rem;
    max-width: calc(100vw - 2.5rem);
    overflow: hidden;

    video {
      height: 100%;
      object-fit: cover;
    }

    .video-actions {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;

      button {
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
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
      padding: 0 3rem 1rem 1rem;
      background: linear-gradient(
        0deg,
        rgba(var(--dark-color) / 0.8) 0%,
        rgba(var(--dark-color) / 0) 100%
      );
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 0.75rem;

      p {
        font-size: 0.9rem;
        color: rgb(var(--light-color));
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .creator-details {
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          object-fit: cover;
        }

        button {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
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

      & > div span {
        display: block;
        font-size: 0.75rem;
        color: rgb(var(--light-color));
        text-align: center;
      }

      .like button.liked {
        color: rgb(var(--like-color));
      }

      .dislike button.disliked {
        color: rgb(var(--primary-color));
      }

      button {
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
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
`;

const Video = ({
  video,
  mute,
  setMute,
  playingVideo,
  setPlayingVideo,
  autoplay = false, // Thêm prop mới với default là false
}: {
  video: VideoType;
  mute: boolean;
  setMute: React.Dispatch<React.SetStateAction<boolean>>;
  playingVideo: string | null;
  setPlayingVideo: React.Dispatch<React.SetStateAction<string | null>>;
  autoplay?: boolean; // Prop mới optional
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // State "play" phụ thuộc xem video này có đang được chọn play hay không
  const [play, setPlay] = useState(
    autoplay || video.postId === playingVideo
  );
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    setDisliked(false);
    setLiked((prev) => !prev);
  };

  const handleDislike = () => {
    setLiked(false);
    setDisliked((prev) => !prev);
    toast.success("Thank you for your feedback!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(video.submission.mediaUrl);
    toast.success("Video link copied to clipboard!");
  };

  const handleComment = () => {
    toast.success("Comment feature coming soon!");
  };

  // Khi prop playingVideo hoặc autoplay thay đổi, cập nhật lại trạng thái play
  useEffect(() => {
    setPlay(autoplay || video.postId === playingVideo);
  }, [playingVideo, video.postId, autoplay]);

  // Dùng IntersectionObserver để tự động chuyển video đang phát khi video này được scroll vào vùng hiển thị (threshold 0.5)
  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPlayingVideo(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(currentVideo);

    return () => {
      observer.unobserve(currentVideo);
    };
  }, [setPlayingVideo]);

  // Điều khiển play/pause video dựa trên state "play"
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const playPause = async () => {
      try {
        if (play) {
          if (videoEl.paused) await videoEl.play();
        } else {
          if (!videoEl.paused) videoEl.pause();
        }
      } catch (error) {
        console.warn("Playback error:", error);
      }
    };

    playPause();
  }, [play]);

  return (
    <VideoStyled>
      <div className="video selected">
        <video
          ref={videoRef}
          src={video.submission.mediaUrl}
          poster={video.submission.thumbnail}
          id={video.postId}
          loop
          muted={mute}
          playsInline
          onClick={(e) => {
            e.stopPropagation();
            setPlay((prev) => !prev);
            if (!play) setPlayingVideo(video.postId);
          }}
        />
        <div className="video-actions">
          <div className="play-pause">
            {play ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPlay(false);
                }}
              >
                <IoMdPause />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPlay(true);
                  setPlayingVideo(video.postId);
                }}
              >
                <IoMdPlay />
              </button>
            )}
          </div>
          <div className="volume">
            {mute ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMute(false);
                }}
              >
                <IoMdVolumeOff />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMute(true);
                }}
              >
                <IoMdVolumeHigh />
              </button>
            )}
          </div>
        </div>

        <div className="video-details">
          <div className="creator-details">
            <img src={video.creator.pic} alt={video.creator.name} />
            <p>{video.creator.name}</p>
            <button>Subscribe</button>
          </div>
          <p>{video.submission.title}</p>
          <p>{video.submission.description}</p>
        </div>

        <div className="buttons">
          <div className="like">
            <button
              title="I like this"
              onClick={handleLike}
              className={`like-button ${liked ? "liked" : ""}`}
            >
              <FaThumbsUp />
            </button>
            <span>
              {video.reaction.count > 0
                ? liked
                  ? video.reaction.count + 1
                  : video.reaction.count
                : "Like"}
            </span>
          </div>

          <div className="dislike">
            <button
              title="I dislike this"
              onClick={handleDislike}
              className={`dislike-button ${disliked ? "disliked" : ""}`}
            >
              <FaThumbsDown />
            </button>
            <span>Dislike</span>
          </div>

          <div className="comment">
            <button title="Comment" onClick={handleComment}>
              <MdInsertComment />
            </button>
            <span>0</span>
          </div>

          <div className="share">
            <button title="Share" onClick={handleShare}>
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
