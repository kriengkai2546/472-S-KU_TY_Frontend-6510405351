import axios from "axios";
import { Event } from "../models/event";
import { User } from "../models/user";
import { Feedback, feedback } from "../models/feedback";

const API_BASE_URL = "https://kuty-backend-1-0-0.onrender.com";


export const fetchAllEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/event`);
      if (response.data.code === "OK") {
        return response.data.data.map(eventData => {
          const createdBy = new User(eventData.createdBy);
          return new Event({ ...eventData, createdBy });
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  };

export const fetchEventData = async (eventId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/event/eventId/${eventId}`
    );
    if (response.data.code === "OK") {
      const eventData = response.data.data;
      const createdBy = new User(eventData.createdBy);
      return new Event({ ...eventData, createdBy });
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching event data:", error);
    throw error;
  }
};

export const fetchAllJoinedUsers = async (eventId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/event/${eventId}/joined/user`);
      if (response.data.code === "OK") {
        return response.data.data.map(userData => new User(userData));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching joined users:", error);
      throw error;
    }
  };

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/event`, eventData);
    if (response.data.code === "OK") {
      return new Event(response.data.data);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const editEvent = async (eventData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/event`, eventData);
    if (response.data.code === "OK") {
      return new Event(response.data.data);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error editing event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/event/${eventId}`);
      if (response.data.code === 'OK') {
        return response.data.message;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };
  export const updateEventImage = async (eventId, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/event/${eventId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.code === 'OK') {
        return response.data.data.imageUrl; // Return the new imageUrl
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating event image:', error);
      throw error;
    }
  };

  export const deleteParticipant = async (participantId, eventId, ownerId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/user/kick`, {
        data: {
          ownerId,
          eventId,
          participantId
        }
      });

      if (response.data.code === 'OK') {
        return response.data.message;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error){
      console.error("Error deleting participant:", error);
      throw error;
    }
  };