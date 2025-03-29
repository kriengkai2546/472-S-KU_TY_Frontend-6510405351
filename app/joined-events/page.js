"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import JoinedEventItem from "../components/joined-event-item";
import { fetchAllJoinedEvents } from "../apis/userApi";
import { useUserContext } from "../UserContext";

export default function CreatedEvents() {
  const { user } = useUserContext();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = user?.userId;

   useEffect(() => {
    if (!user?.userId) return;

    fetchAllJoinedEvents(user.userId)
      .then((data) => {
        const joinedEvents = data.filter(event => event.createdBy.userId !== user.userId);
        console.log(joinedEvents);
        setEvents(joinedEvents);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const handleQuit = (eventId) => {
    setEvents(events.filter((event) => event.eventId !== eventId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading events: {error.message}</div>;
  }
  return (
    <div>
      
      <div className={styles.profileHeaderContent}>
   
            <h1 className={styles["title-page"]}>กิจกรรมที่เข้าร่วม</h1>


          </div>
          <hr className={styles.profileDivider} />
      <div className={styles["content-container"]}>
        
        <div className={styles["events-container"]}>
        {events.length === 0 ? (<div>No events available.</div>) : (events.map((event) => (
            <JoinedEventItem
            key={event.eventId}
            userId={user?.userId}
            event={event}
            onQuit={handleQuit}
          />
          )))}
        </div>
      </div>
    </div>
  );
}
