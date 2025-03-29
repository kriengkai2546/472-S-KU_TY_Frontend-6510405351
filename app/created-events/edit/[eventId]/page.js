"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import {
  fetchEventData,
  editEvent,
  updateEventImage,
} from "../../../apis/eventApi";
import { useRouter } from "next/navigation";
import { useUserContext } from "../../../UserContext";

export default function Event({ params }) {
  const { user } = useUserContext();
  const router = useRouter();
  const userId = user?.userId;
  const [eventId, setEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [typeName, setTypeName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isDefaultImage, setIsDefaultImage] = useState(true);

  useEffect(() => {
    params.then((resolvedParams) => {
      setEventId(resolvedParams.eventId);
    });
  }, [params]);

  useEffect(() => {
    if (userId && eventId) {
      fetchEventData(eventId)
        .then((data) => {
          console.log(data.data)
          setEventDetails(data);
          setEventName(data.name || "");
          setEventDescription(data.description || "");
          setEventDate(data.date || "");
          setEventLocation(data.location || "");
          setStartTime(data.startTime || "");
          setTypeName(data.typeName || "");
          setCapacity(data.capacity || "");
          setStatus(data.status || "CLOSED");
          setImagePreviewUrl(data.imageUrl);
          if (data.createdBy.userId !== userId) {
            setError(new Error("You are not authorized to edit this event."));
          }
        })
        .catch((error) => {
          console.error("Error fetching event data:", error);
          setError(error);
        });
    }
  }, [eventId, userId]);

  const handleStatusToggle = async () => {
    setStatus(status === "OPEN" ? "CLOSED" : "OPEN");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = {
        eventId: eventId,
        name: eventName,
        description: eventDescription,
        startDate: eventDate,
        startTime: startTime,
        location: eventLocation,
        capacity: capacity,
        typeName: typeName,
        status: status,
      };
      console.log("Updating event with data:", updatedEvent);
      await editEvent(updatedEvent);
      await handleImageUpload(e, eventId);
      router.push("/created-events");
    } catch (error) {
      console.error("Error updating event:", error);
      setError(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setIsDefaultImage(false);
    console.log("Image file:", file);
  };

  const handleImageUpload = async (e, eventId) => {
    e.preventDefault();
    if (!imageFile) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const newImageUrl = await updateEventImage(eventId, formData);
      setUserData((prevData) => ({
        ...prevData,
        imageUrl: newImageUrl,
      }));
      console.log("New Image URL:", newImageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setIsDefaultImage(true);
  };

  if (error) {
    return <div>Error loading event details: {error.message}</div>;
  }

  if (!eventDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginLeft: 90,
        marginRight: 90,
        marginBottom: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          marginTop: 50,
          marginBottom: 45,
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginLeft: 24,
          }}
        >
          <Image
            src="/images/back-icon.png"
            width={17}
            height={32}
            alt="back-logo"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/created-events")}
          />
        </div>
        <div>
          <p
            style={{
              fontSize: 48,
              fontWeight: "bold",
              marginLeft: 30,
            }}
          >
            แก้ไขกิจกรรม
          </p>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: 1,
          backgroundColor: "rgba(233, 233, 233, 1)",
          marginBottom: 40,
        }}
      ></div>

      <div
        style={{
          display: "flex",
        }}
      >
        <div className={styles["input-wrapper"]}>
          <input
            type="file"
            id="imageUpload"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <label htmlFor="imageUpload" className={styles["input-label"]}>
            <Image
              src={imagePreviewUrl || "/images/add-picture-icon.png"}
              width={400}
              height={400}
              alt="add-picture-logo"
            />
            {imagePreviewUrl ? null : (
              <span
                style={{
                  fontSize: 40,
                  fontWeight: "bold",
                }}
              >
                อัปโหลดรูปภาพ
              </span>
            )}
          </label>
        </div>

        <div style={{ marginLeft: 75 }}>
          <div className={styles["create-event-input-container"]}>
            <div>
              <p className={styles["create-event-text"]}>ชื่อกิจกรรม</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="กรอกชื่อกิจกรรม"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                className={styles["create-event-input-event-name"]}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/images/error-icon.png"
                width={10}
                height={10}
                alt="error-icon"
              />
              <p className={styles["create-event-error-text"]}>
                จำเป็นต้องกรอก
              </p>
            </div>
          </div>

          <div
            style={{ display: "flex" }}
            className={styles["create-event-input-container"]}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/calendar-icon.png"
                  width={18}
                  height={20}
                  alt="calendar-icon"
                  style={{ marginRight: 5 }}
                />
                <p className={styles["create-event-text"]}>วันที่</p>
              </div>
              <div>
                <input
                  type="date"
                  placeholder="ระบุวันที่"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className={styles["create-event-input-event-date"]}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/error-icon.png"
                  width={10}
                  height={10}
                  alt="error-icon"
                />
                <p className={styles["create-event-error-text"]}>
                  จำเป็นต้องกรอก
                </p>
              </div>
            </div>
            <div style={{ marginLeft: 35 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/clock-icon.png"
                  width={20}
                  height={20}
                  alt="clock-icon"
                  style={{ marginRight: 5 }}
                />
                <p className={styles["create-event-text"]}>เวลา</p>
              </div>
              <div>
                <input
                  type="time"
                  placeholder="ระบุเวลา"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className={styles["create-event-input-event-time"]}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/error-icon.png"
                  width={10}
                  height={10}
                  alt="error-icon"
                />
                <p className={styles["create-event-error-text"]}>
                  จำเป็นต้องกรอก
                </p>
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex" }}
            className={styles["create-event-input-container"]}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/location-icon.png"
                  width={14}
                  height={20}
                  alt="location-icon"
                  style={{ marginRight: 5 }}
                />
                <p className={styles["create-event-text"]}>สถานที่</p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="ระบุสถานที่"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  required
                  className={styles["create-event-input-event-location"]}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/error-icon.png"
                  width={10}
                  height={10}
                  alt="error-icon"
                />
                <p className={styles["create-event-error-text"]}>
                  จำเป็นต้องกรอก
                </p>
              </div>
            </div>
            <div style={{ marginLeft: 35 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/category-icon.png"
                  width={20}
                  height={20}
                  alt="category-icon"
                  style={{ marginRight: 5 }}
                />
                <p className={styles["create-event-text"]}>ประเภท</p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="ระบุประเภท"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  required
                  className={styles["create-event-input-event-category"]}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/error-icon.png"
                  width={10}
                  height={10}
                  alt="error-icon"
                />
                <p className={styles["create-event-error-text"]}>
                  จำเป็นต้องกรอก
                </p>
              </div>
            </div>
          </div>

          <div
            className={styles["create-event-input-container"]}
            style={{ display: "flex" }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/number-of-participants-icon.png"
                  width={22}
                  height={16}
                  alt="number-of-participants-icon"
                  style={{ marginRight: 5 }}
                />
                <p className={styles["create-event-text"]}>จำนวนผู้เข้าร่วม</p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="ระบุจำนวนผู้เข้าร่วม"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                  className={styles["create-event-input-event-location"]}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/images/error-icon.png"
                  width={10}
                  height={10}
                  alt="error-icon"
                />
                <p className={styles["create-event-error-text"]}>
                  หากไม่ระบุจำนวน
                  กิจกรรมนี้จะสามารถรับจำนวนผู้เข้าร่วมได้ไม่จำกัด
                </p>
              </div>
            </div>
            <div
              style={{ marginLeft: 35 }}
              className={styles["edit-event-button-status"]}
            >
              <p
                className={styles["create-event-text"]}
                style={{ whiteSpace: "nowrap" }}
              >
                Status: {status}
              </p>
              <button
                onClick={handleStatusToggle}
                className={`${styles["status-button"]} ${
                  status !== "OPEN"
                    ? styles["status-open"]
                    : styles["status-close"]
                }`}
              >
                {status === "OPEN" ? "Close Event" : "Open Event"}
              </button>
            </div>
          </div>

          <div>
            <div>
              <p className={styles["create-event-text"]}>รายละเอียด</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="ข้อความ.."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
                className={styles["create-event-input-event-description"]}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            {!isDefaultImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className={styles.removeButton}
              >
                ลบรูปภาพ
              </button>
            )}
            <button
              className={styles["create-event-button"]}
              onClick={handleEditSubmit}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
