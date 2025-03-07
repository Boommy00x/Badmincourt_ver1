import axios from "axios"
import type { Court } from "../types/court"
import Cookies from "js-cookie"

const API_URL = "https://mylife-api.online/backend"

export const fetchCourtService = {
  async fetchCourts(): Promise<Court[]> {
    try {
      const token = Cookies.get("token")
      // console.log("Fetching courts with token:", token)

      const response = await axios.post(
        `${API_URL}/fetchCourts.php`,
        { token },
        {
          headers: { "Content-Type": "application/json" },
        },
      )

      // console.log("API Response:", response.data)
      const statusTime = response.data.status_time ? JSON.parse(response.data.status_time) : []
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data.map((court: any) => ({
          id: court.id,
          name: `Court ${court.id}`,
          status: court.status,
          pricing: Number.parseInt(court.pricing),
          schedule: court.schedule || {},
          status_time: statusTime,
        }))
      } else {
        console.error("Invalid response format:", response.data)
        throw new Error("Invalid response format")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message)
        throw new Error(`Failed to fetch courts: ${error.response?.data?.message || error.message}`)
      } else {
        console.error("Unknown error:", error)
        throw new Error("An unknown error occurred while fetching courts")
      }
    }
  }
}


// import axios from "axios";
// import type { Court } from "../types/court";
// import Cookies from "js-cookie";
// import { fetchCourtData } from '@/hooks/logonameAPI';

// const API_URL = "http://103.208.27.58/badmincourt/backend";

// export const fetchCourtService = {
//   async fetchCourts(): Promise<Court[]> {
//     try {
//       const token = Cookies.get("token");
//       const response = await axios.post(
//         `${API_URL}/fetchCourts.php`,
//         { token },
//         {
//           headers: { "Content-Type": "application/json" },
//         },
//       );

//       // Log the response data for debugging
//       console.log("API Response:", response.data);

      
//     if (response.data && response.data.data && Array.isArray(response.data.data)) {
//       const courtData = await fetchCourtData() // ดึงข้อมูลสนามรวมถึงโลโก้
//       const statusTime = response.data.status_time ? JSON.parse(response.data.status_time) : [] // แยกการแปลง status_time ออกมา// Fetch court data including logo
//         return response.data.data.map((court: any) => {
//           // Check if status_time is defined and parse it
//           return {
//             id: court.id,
//             name: `Court ${court.id}`,
//             status: court.status,
//             pricing: Number.parseInt(court.pricing),
//             image: courtData.logo, // Use the logo from the fetched court data
//             schedule: court.schedule || {},
//             status_time: statusTime, // Add the parsed status_time
//           };
//         });
//       } else {
//         console.error("Invalid response format:", response.data);
//         throw new Error("Invalid response format");
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("Axios error:", error.response?.data || error.message);
//         throw new Error(`Failed to fetch courts: ${error.response?.data?.message || error.message}`);
//       } else {
//         console.error("Unknown error:", error);
//         throw new Error("An unknown error occurred while fetching courts");
//       }
//     }
//   }
// };
