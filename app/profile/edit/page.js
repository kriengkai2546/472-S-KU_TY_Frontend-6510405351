"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchUserData,
  updateUserEmail,
  updateUserDescription,
} from "../../apis/userApi";
import { useUserContext } from "../../UserContext";
import styles from "./page.module.css";

export default function EditProfile() {
  const { user } = useUserContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const userId = user?.userId;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserData(userId)
        .then((data) => {
          setEmail(data.email);
          setDescription(data.description);
          console.log("User Data:", data);
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setError(error);
        });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserEmail(email);
      await updateUserDescription(description);
      router.push("/profile");
    } catch (error) {
      console.error("Error updating user data:", error);
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error loading user data: {error.message}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        {/* Profile Avatar */}
        <div className={styles.profileAvatar}>
          <Image
            src={"/images/default-profile.png"}
            alt="Profile Avatar"
            width={100}
            height={100}
            className={styles.avatarImage}
          />
        </div>

        {/* Profile Info */}
        <div className={styles.profileInfo}>
          <div className={styles.profileHeaderContent}>
            <div className={styles.profileNameRow}>
              <h1 className={styles.profileName}>
                {userData?.firstName} {userData?.lastName}
              </h1>
            </div>
            <div className={styles.profileButtonRow}>
              <button className={styles.profileGreyButton}>แก้ไขโปรไฟล์</button>
              <button
                className={styles.profileGreyButton}
                onClick={handleSubmit}
              >
                แก้ไขรายละเอียด
              </button>
            </div>
          </div>
          <p className={styles.profileFaculty}>
            {userData?.departmentNameTh} {userData?.majorName}
          </p>
          <h2>อีเมล์</h2>
          <p>{userData?.email}</p>
          <p className={styles.profileEmail}>{userData?.email}</p>
          <h2>รายละเอียด</h2>
          <p>{userData?.description}</p>
        </div>
      </div>
      <hr className={styles.profileDivider} />
    </div>
  );
}
