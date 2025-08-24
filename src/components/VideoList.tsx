import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Video from "./Video";
import type { VideoType } from "../../types/Video";
import { styled } from "styled-components";
import { toast } from "react-hot-toast";

type ApiResponseType = {
  data: {
    posts: VideoType[];
  };
};

const VideoListStyled = styled.div`
  display: grid;
  place-items: center;
  min-height: 100vh;

  .video-list {
    display: grid;
    place-items: center;
    gap: 1rem;
    scroll-snap-type: y mandatory;
    overflow-y: auto;
    max-height: 100vh;
    width: 100%;

    @media (min-width: 768px) {
      gap: 2rem;
    }

    & > div:first-child {
      margin-top: 1rem;
    }

    & .video {
      scroll-snap-align: center;
      width: 100%;
      max-width: 400px;
    }
  }

  .loader,
  .end-message {
    text-align: center;
    margin: 1rem 0;
  }
`;

const VideoList = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [page, setPage] = useState(0);
  const [mute, setMute] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getVideos = async (currentPage: number) => {
    setLoading(true);
    try {
      const res: AxiosResponse<ApiResponseType> = await axios.get(
        `https://tiktok-video-api.onrender.com/videos?page=${currentPage}`
      );
      const newVideos = res.data.data.posts.filter(
        (video) => !videos.some((v) => v.postId === video.postId)
      );
      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        setVideos((prev) => [...prev, ...newVideos]);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    getVideos(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Khi scroll tới cuối, load thêm
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (
      hasMore &&
      !loading &&
      target.scrollHeight - target.scrollTop <= target.clientHeight + 100
    ) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <VideoListStyled>
      {videos.length ? (
        <div className="video-list" onScroll={handleScroll}>
          {videos.map((video) => (
            <Video
              key={video.postId}
              video={video}
              mute={mute}
              setMute={setMute}
              playingVideo={null} // Không cần quản lý riêng, autoplay tất cả
              setPlayingVideo={() => {}} // Không dùng
              // xóa prop autoplay đi vì Video không nhận
            />
          ))}
          {loading && <span className="loader">Loading...</span>}
          {!hasMore && <p className="end-message">You have reached the end!</p>}
        </div>
      ) : (
        <span className="loader">Loading videos...</span>
      )}
    </VideoListStyled>
  );
};

export default VideoList;
