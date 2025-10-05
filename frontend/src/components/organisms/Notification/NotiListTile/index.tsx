import "./styles.css";

interface Notification {
  title: string;
  message: string;
}

interface NotiListTileProps {
  notification: Notification;
}

const NotiListTile: React.FC<NotiListTileProps> = ({ notification }) => {
  return (
    <div className="noti-list-tile">
      <div className="noti-content">
        <div className="noti-title">{notification.title}</div>
        <div className="noti-message">{notification.message}</div>
      </div>
    </div>
  );
};

export default NotiListTile;
