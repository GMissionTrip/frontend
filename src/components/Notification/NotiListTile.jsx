import "./styles.css";

const NotiListTile = ({ notification }) => {
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
