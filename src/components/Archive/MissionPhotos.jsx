import React from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import "./MissionPhotos.css"; // CSS 분리

const SortablePhoto = ({ photo, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: photo.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} className="photo-box" style={style} {...attributes} {...listeners}>
      <img src={photo.src} alt="" />
      <button className="delete-btn" onClick={() => onDelete(photo.id)}>
        ×
      </button>
    </div>
  );
};

export const MissionPhotos = ({ missionId, photos, setPhotos }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const missionPhotoList = photos[missionId] || [];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPhotos((prev) => {
      const list = [...(prev[missionId] || [])];
      const oldIndex = list.findIndex((p) => p.id.toString() === active.id);
      const newIndex = list.findIndex((p) => p.id.toString() === over.id);
      return { ...prev, [missionId]: arrayMove(list, oldIndex, newIndex) };
    });
  };

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newPhotos = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      src: URL.createObjectURL(file),
    }));
    setPhotos((prev) => ({
      ...prev,
      [missionId]: [...(prev[missionId] || []), ...newPhotos],
    }));
  };

  const handleDeletePhoto = (photoId) => {
    setPhotos((prev) => ({
      ...prev,
      [missionId]: (prev[missionId] || []).filter((p) => p.id.toString() !== photoId),
    }));
  };

  return (
    <div className="mission-photos-wrapper">
      <label className="photo-add-btn">
        +
        <input
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAddPhoto}
        />
      </label>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={missionPhotoList.map((p) => p.id.toString())}
          strategy={horizontalListSortingStrategy}
        >
          <div className="photo-list">
            {missionPhotoList.map((photo) => (
              <SortablePhoto key={photo.id} photo={photo} onDelete={handleDeletePhoto} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
