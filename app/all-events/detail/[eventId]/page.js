"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { fetchEventData, fetchAllJoinedUsers, deleteParticipant } from "../../../apis/eventApi";
import { fetchAllFeedback,sendFeedback } from "@/app/apis/feedbackApi";
import { joinEvent, fetchAllUsers } from "../../../apis/userApi";
import { useRouter } from 'next/navigation';
import { useUserContext } from "../../../UserContext";

export default function Event({ params }) {
  const { user } = useUserContext();
  const router = useRouter();
  const userId = user?.userId;
  const [eventId, setEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [error, setError] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [participants, setParticipants] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [allUsers, setAllUsers] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setEventId(resolvedParams.eventId);
    });
  }, [params]);
  
  useEffect(() => {
    if (userId && eventId) {
      console.log("Event ID:", eventId);
      console.log("User ID:", userId);

      fetchAllUsers().then((allUser) => {
        console.log('All Users:', allUser);
        setAllUsers(allUser);
      }).catch((error) => {
        console.error("Error fetching all users:", error);
        setError(error);
      })

      fetchAllJoinedUsers(eventId)
        .then((joinedUsers) => {
          console.log("Joined Users:", joinedUsers);
          setParticipants(joinedUsers)
          const userHasJoined = joinedUsers.some(user => user.userId === userId);
          setHasJoined(userHasJoined);
          console.log("User has joined:", userHasJoined);
        })
        .catch((error) => {
          console.error("Error fetching joined users:", error);
          setError(error);
        });

      fetchEventData(eventId)
        .then((data) => {
          console.log("Event Data:", data);
          setEventDetails(data);
          if (data.createdBy.userId === userId) {
            setIsCreator(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching event data:", error);
          setError(error);
        });
      
      fetchAllFeedback(eventId)
        .then((data) => {
          console.log("Feedback Data:",data)
          setFeedback(data);
        }).catch((error) => {
          console.error("Error fetching feedback data:", error);
          setError(error);
        });
    }
  }, [userId, eventId,feedbackText]);

  const handleNavigateToParticipants = () => {
    router.push(`/all-events/participants/${eventId}`);
  };

  const handleBackToAllEventsPage = () => {
    router.push(`/all-events`);
  };

  const handleJoinEvent = async () => {
    try {
      const message = await joinEvent({eventId, userId});
      setHasJoined(true); 
    } catch (error) {
      setError(error.message);
    }
  };

  const handleKickUser = async (participantId) => {
    const isConfirmed = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการเตะผู้ใช้นี้?");
    if (!isConfirmed) return;

    try {
      const message = await deleteParticipant(participantId, eventId, userId);
      console.log("Success:", message);
      setParticipants(prev => prev.filter(user => user.userId !== participantId)); 
    } catch (error) {
      console.error("Error kicking user:", error);
    }
  }

  const handleFeedbackChange = (e) => {
    setFeedbackText(e.target.value);
  };

  const handleSubmit = async () => {
    const newFeedback = { userId, eventId, feedback: feedbackText };
    console.log("newFeedback:", newFeedback);

    const isConfirmed = window.confirm("คุณต้องการส่งความคิดเห็นนี้ใช่หรือไม่?");
    if (!isConfirmed) return;

    try {
      await sendFeedback(newFeedback);
      setFeedbackText("");
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  const handleAnonymousSubmit = async () => {
    const newFeedback = {userId: null, eventId, feedback: feedbackText};

    const isConfirmed = window.confirm("คุณต้องการส่งความคิดเห็นนี้ใช่หรือไม่?");
    if (!isConfirmed) return;
    try {
      await sendFeedback(newFeedback);
      setFeedbackText("");
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  }



  const findUserById = (userId) => {
    const user = allUsers.find(user => user.userId === userId);
    return user ? user.firstName : 'ไม่ระบุตัวตน';
  };

  if (error) {
    return <div>Error loading event details: {error.message}</div>;
  }

  if (!eventDetails) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <div className={styles["event-detail-container"]}>
        <button onClick={handleBackToAllEventsPage} className={styles.backButton}>
          <Image
            src="/images/back-icon.png"
            alt="Back"
            width={24}
            height={32}
          />
        </button>
        <div className={styles["event-detail-picture"]}>
          {eventDetails && eventDetails["imageUrl"] ? (
            <Image
              src={eventDetails["imageUrl"]}
              layout="responsive"
              width={100}
              height={100}
              alt="Event picture"
            />
          ) : (
            <Image
              src="/images/default-event-picture.png"
              layout="responsive"
              width={100}
              height={100}
              alt="Event picture"
            />
          )}
        </div>

        <div className={styles["event-detail"]}>
          <div>
            {eventDetails && eventDetails["name"] ? (
              <p className={styles["event-name-text"]}>
                {eventDetails["name"]}
              </p>
            ) : (
              <p>Event name not available</p>
            )}
          </div>
          <div>
            <p style={{ fontSize: 24, marginBottom: 30 }}>
              โดย{" "}
              <span style={{ fontWeight: "bold" }}>
                {eventDetails &&
                eventDetails["createdBy"] &&
                eventDetails["createdBy"]["firstName"]
                  ? `${eventDetails["createdBy"]["firstName"]} ${eventDetails["createdBy"]["lastName"]}`
                  : "Anonymous"}
              </span>
            </p>
          </div>
          <div>
            <div className={styles["event-detail-date-location"]}>
              <div className={styles["event-detail-date"]}>
                <Image
                  src="/images/calendar-icon.png"
                  width={18}
                  height={20}
                  alt="Calendar icon"
                />
                <p className={styles["event-detail-text"]}>
                  {eventDetails && eventDetails["startDate"]
                    ? `${eventDetails["startDate"]}`
                    : "ไม่กำหนดวันที่"}
                </p>
              </div>
              <div className={styles["event-detail-location"]}>
                <Image
                  src="/images/location-icon.png"
                  width={14}
                  height={20}
                  alt="Location icon"
                />
                <p className={styles["event-detail-text"]}>
                  {eventDetails && eventDetails["location"]
                    ? `${eventDetails["location"]}`
                    : "ไม่กำหนดสถานที่"}
                </p>
              </div>
            </div>
            <div className={styles["event-detail-time"]}>
              <Image
                src="/images/clock-icon.png"
                width={20}
                height={20}
                alt="Clock icon"
              />
              <p className={styles["event-detail-text"]}>
                {eventDetails && eventDetails["startDate"]
                  ? `${eventDetails["startDate"]}`
                  : "ไม่กำหนดเวลา"}
              </p>
            </div>
          </div>
          <div className={styles["eventTagRow"]}>
            <div className={styles["event-tag"]}>Board Game</div>
            <div className={styles["event-participants"]} onClick={handleNavigateToParticipants} style={{ cursor: 'pointer' }}>
              <div className={styles["number-of-participants-container"]}>
                <div>
                  <Image
                    src="/images/participants-icon.png"
                    width={26}
                    height={23}
                    alt="Participants icon"
                  />
                </div>
                <div>
                  <p style={{ fontSize: 22 }}>
                    {eventDetails && eventDetails["attendeeCount"]
                      ? `${eventDetails["attendeeCount"]}`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <button onClick={handleJoinEvent} 
            className={styles["join-event-button"]}
            style={{ 
              backgroundColor: hasJoined || isCreator ? 'gray' : '#008f46',
              cursor: hasJoined || isCreator ? 'not-allowed' : 'pointer' 
            }}
              disabled={hasJoined || isCreator}
            >
              {hasJoined || isCreator ? 'เข้าร่วมแล้ว' : 'เข้าร่วม'}
              </button>
          </div>
        </div>
      </div>

      <div className={styles["event-description"]}>
        <p style={{ fontWeight: "bold", fontSize: 40 }}>รายละเอียด</p>
        <p style={{ fontSize: 22 }}>
          {eventDetails && eventDetails["description"]
            ? `${eventDetails["description"]}`
            : "ไม่มีรายละเอียด"}
        </p>
      </div>

      <div className={styles["event-participants"]}>
        <p style={{ fontWeight: "bold", fontSize: 24 }}>ผู้เข้าร่วมอีเวนต์</p>
        <ul className={styles["participants-list"]}>
          {participants.length > 0 ? (
            participants.map((participant) => (
              <li key={participant.userId} className={styles["participant-item"]}>
                <span>{participant.firstName} {participant.lastName}</span>
                {isCreator && (
                  <button
                    className={styles["kick-button"]}
                    onClick={() => handleKickUser(participant.userId)}
                  >
                    Kick
                  </button>
                )}
              </li>
            ))
          ) : (
            <p>ยังไม่มีผู้เข้าร่วม</p>
          )}
        </ul>
      </div>

      <div className={styles["event-feedback"]}>
        <p style={{ fontWeight: "bold", fontSize: 24 }}>ความคิดเห็นจากผู้เข้าร่วม</p>
        <ul className={styles["feedback-list"]}>
          {feedback && feedback.length > 0 ? (
            feedback.map((item, index) => (
              <li key={index} className={styles["feedback-item"]}>
                <p className={styles["feedback-user"]}>{findUserById(item.userId)}</p>
                <p className={styles["feedback-text"]}>{item.feedback}</p>
              </li>
            ))
          ) : (
            <p>ยังไม่มีความคิดเห็น</p>
          )}
        </ul>
      </div>

      <div className={styles["feedback-section"]}>
        <textarea
          className={styles["feedback-input"]}
          placeholder="เขียน Feedback เกี่ยวกับอีเวนต์..."
          value={feedbackText}
          onChange={handleFeedbackChange}
        />
        <div className={styles["feedback-button-group"]}>
          <button className={styles["feedback-button"]} onClick={handleSubmit}>
            ส่ง Feedback
          </button>
          <button
            className={styles["feedback-button-anonymous"]}
            onClick={handleAnonymousSubmit}
          >
            ส่ง Feedback แบบไม่ระบุตัวตน
          </button>
        </div>
      </div>




    </div>
  );
}
