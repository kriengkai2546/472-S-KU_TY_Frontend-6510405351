import axios from 'axios';
import { User } from '../models/user';
import { Event } from '../models/event';

const API_BASE_URL = "https://kuty-backend-1-0-0.onrender.com";

export const fetchUserData = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/userId/${userId}`);
    if (response.data.code === 'OK') {
      return new User(response.data.data);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user`);
    if (response.data.code === 'OK') {
      return response.data.data.map(userData => new User(userData));
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const fetchUserByUsername = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/username/${username}`);
    if (response.data.code === 'OK') {
      return new User(response.data.data);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
};

export const fetchAllJoinedEvents = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/userId/${userId}/joined/event`);
    if (response.data.code === 'OK') {
      return response.data.data.map(eventData => new Event(eventData));
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error fetching joined events:', error);
    throw error;
  }
};

export const fetchAllCreatedEvents = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/userId/${userId}/created/event`);
    if (response.data.code === 'OK') {
      return response.data.data.map(eventData => new Event(eventData));
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error fetching created events:', error);
    throw error;
  }
};

export const updateUserDescription = async (descriptionData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/update/description`, descriptionData);
    if (response.data.code === 'OK') {
      return new User(response.data.data);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error updating user description:', error);
    throw error;
  }
};

export const updateUserEmail = async (emailData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/update/email`, emailData);
    if (response.data.code === 'OK') {
      return new User(response.data.data);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error updating user email:', error);
    throw error;
  }
};

export const updateUserName = async (nameData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/update/name`, nameData);
    if (response.data.code === 'OK') {
      return new User(response.data.data);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error updating user name:', error);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user`, userData);
    if (response.data.code === 'OK') {
      return new User(response.data.data);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const joinEvent = async (joinEventData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/join/event`, joinEventData);
    if (response.data.code === 'OK') {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error joining event:', error);
    throw error;
  }
  
};

export const quitEvent = async (eventId, userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/user/quit/event`, { data: {eventId, userId} });
      if (response.data.code === 'OK') {
        return response.data.message;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error quitting event:', error);
      throw error;
    }
  };

  export const updateUserImage = async (userId, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/${userId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.code === 'OK') {
        return response.data.data['imageUrl'];
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating user image:', error);
      throw error;
    }
  };