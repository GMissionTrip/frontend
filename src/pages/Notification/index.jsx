import { LayoutTitleWithActions } from "@/components/common/LayoutTitleWithActions";
import "./styles.css";
import NotiListTile from "@/components/Notification/NotiListTile";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();

  const notifications = [
    {
      title: "여행 일정이 업데이트 되었습니다.",
      message: "새로운 일정이 추가되었습니다. 확인해보세요!",
    },
    {
      title: "여행지 추천",
      message: "새로운 여행지 추천이 도착했습니다. 확인해보세요!",
    },
    {
      title: "여행 사진 업로드",
      message: "여행 사진이 업로드 되었습니다. 확인해보세요!",
    },
    {
      title: "여행 일정 변경",
      message: "여행 일정이 변경되었습니다. 확인해보세요!",
    },
  ];

  return (
    <LayoutTitleWithActions
      title={"알림"}
      leftIcon={<FaHome />}
      onLeftIconClick={() => {
        navigate("/");
      }}
    >
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <NotiListTile key={index} notification={notification} />
        ))
      ) : (
        <div className="no-notifications">🥲 알림이 없습니다.</div>
      )}
    </LayoutTitleWithActions>
  );
};

export default Notification;
