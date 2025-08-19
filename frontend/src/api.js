import axios from "axios";

const BASE_URL = "http:/localhost:3026/api/matches"; // change port if needed

export const fetchLiveMatches = () => axios.get(`${BASE_URL}/?category=live`);
export const fetchUpcomingMatches = () => axios.get(`${BASE_URL}/?category=upcoming`);
export const fetchCompletedMatches = () => axios.get(`${BASE_URL}/?category=completed`);
