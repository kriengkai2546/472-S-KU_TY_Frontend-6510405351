import axios from "axios";
import { Feedback } from "../models/feedback";

const API_BASE_URL = "https://kuty-backend-1-0-0.onrender.com";

export const fetchAllFeedback = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/feedback/${eventId}`)
    if (response.data.code === 'OK') {
      return response.data.data.map(feedback => new Feedback(feedback));
    }
    return [];
  } catch (error) {
    console.error("Effor fetching feedback:", error);
    throw error;
  }
}

export const sendFeedback = async (feedback) => {
  console.log(feedback)
  try {
    const response = await axios.post(`${API_BASE_URL}/feedback`, feedback);

    if (response.data.code === "OK") {
      return response.data.data || {}; 
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error sending feedback:", error);
    throw error;
  }
};
