const DropdownMenu = ({ onEditClick, trip, onClose }) => (
  <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
    <div
      className="dropdown-item"
      onClick={() => {
        onEditClick(trip);
        if (onClose) onClose();
      }}
    >
      수정하기
    </div>
    <div className="dropdown-divider" />
    <div className="dropdown-item">삭제하기</div>
  </div>
);

export const TripCard = ({ trip, isOpen, onToggle, onClick, onEditClick }) => {
  return (
    <div className="trip-card" style={{ background: trip.background }}>
      <div onClick={onClick}>
        <div className="gradient-overlay" />
        <div className="trip-text">
          <div className="trip-title">{trip.title}</div>
          <div className="trip-date">{trip.date}</div>
          <div className="trip-location">{trip.location}</div>
        </div>
      </div>
      <div
        className="dropdown-button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        ⋯
      </div>
      {isOpen && <DropdownMenu trip={trip} onEditClick={onEditClick} onClose={onToggle} />}
    </div>
  );
};
