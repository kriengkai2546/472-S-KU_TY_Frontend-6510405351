"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import AllEventItem from "../components/all-event-item";
import { fetchAllEvents } from "../apis/eventApi";
import { useUserContext } from "../UserContext";

export default function AllEvent() {
  const { user } = useUserContext();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "All",
    date: "All",
    type: "All",
    organizer: "All",
  });

  useEffect(() => {
    fetchAllEvents()
      .then((data) => {
        console.log(data);
        setEvents(data);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredEvents = events.filter((event) => {
    return (
      (filters.location === "All" || event.location === filters.location) &&
      (filters.date === "All" || event.startDate === filters.date) &&
      (filters.type === "All" || event.typeName === filters.type) &&
      (filters.organizer === "All" ||
        `${event.createdBy?.firstName} ${event.createdBy?.lastName}` === filters.organizer)
    );
  });

  if (error) {
    return <div>Error loading events: {error.message}</div>;
  }

  return (
    <div>
      <div className={styles["content-container"]}>
        <div>
          <Image
            src="/images/background-picture.png"
            layout="responsive"
            width={100}
            height={35}
            alt="Event picture"
          />
        </div>

        {/* ฟอร์มค้นหา */}
        <div className={styles["search-container"]}>
          <div className={styles["filter"]}>
            <label className={styles["search-label"]}>สถานที่</label>
            <select name="location" onChange={handleFilterChange}>
              <option value="All">All</option>
              {Array.from(new Set(events.map((event) => event.location))).map(
                (loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                )
              )}
            </select>
          </div>

          <div className={styles["divider"]}></div>
          <div className={styles["filter"]}>
            <label className={styles["search-label"]}>วันที่</label>
            <select name="date" onChange={handleFilterChange}>
              <option value="All">All</option>
              {Array.from(new Set(events.map((event) => event.startDate))).map(
                (date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                )
              )}
            </select>
          </div>

          <div className={styles["divider"]}></div>
          <div className={styles["filter"]}>
            <label className={styles["search-label"]}>ประเภท</label>
            <select name="type" onChange={handleFilterChange}>
              <option value="All">All</option>
              {Array.from(new Set(events.map((event) => event.typeName))).map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>
          </div>

          <div className={styles["divider"]}></div>
          <div className={styles["filter"]}>
            <label className={styles["search-label"]}>ผู้จัดทำ</label>
            <select name="organizer" onChange={handleFilterChange}>
              <option value="All">All</option>
              {Array.from(
                new Set(
                  events.map(
                    (event) =>
                      `${event.createdBy?.firstName} ${event.createdBy?.lastName}`
                  )
                )
              ).map((organizer) => (
                <option key={organizer} value={organizer}>
                  {organizer}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* แสดงอีเวนต์หรือตัวกรองไม่พบข้อมูล */}
        {filteredEvents.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "50vh",
              fontWeight: "bold",
              fontSize: 40,
            }}
          >
            ไม่มีอีเวนต์ที่ตรงกับการค้นหา
          </div>
        ) : (
          <div className={styles["events-container"]}>
            {filteredEvents.map((event) => (
              <AllEventItem key={event.eventId} event={event} userId={user?.userId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
