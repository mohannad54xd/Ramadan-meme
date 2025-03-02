import axios from 'axios';
import { AxiosError } from 'axios';

interface PrayerTimes {
  Maghrib: string;
  Fajr: string;
}

const TEST_MODE = false; // Set to true to bypass actual prayer time check

export const canEatTime = async (): Promise<boolean> => {
  if (TEST_MODE) {
    return true;
  }

  try {
    console.log('Fetching prayer times...');
    // Using HTTPS and adding date parameter
    const response = await axios.get<{ data: { timings: PrayerTimes } }>(
      'https://api.aladhan.com/v1/timingsByCity',
      {
        params: {
          city: 'Giza',
          country: 'Egypt',
          method: 4,
          date: new Date().toISOString().split('T')[0], // Add current date
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data || !response.data.data || !response.data.data.timings) {
      console.error('Invalid API response format:', response.data);
      return false;
    }

    console.log('Prayer times response:', response.data);
    const data = response.data as { data: { timings: PrayerTimes } };
    const maghribTime = data.data.timings.Maghrib;
    const fajrTime = data.data.timings.Fajr;
    const now = new Date();
    
    // Convert prayer times to Date objects
    const [maghribHours, maghribMinutes] = maghribTime.split(':');
    const [fajrHours, fajrMinutes] = fajrTime.split(':');
    
    const maghribDate = new Date();
    const fajrDate = new Date();
    
    maghribDate.setHours(parseInt(maghribHours), parseInt(maghribMinutes), 0);
    fajrDate.setHours(parseInt(fajrHours), parseInt(fajrMinutes), 0);

    // If current time is before Fajr, we need to check against previous day's Maghrib
    if (now < fajrDate) {
      maghribDate.setDate(maghribDate.getDate() - 1);
    }
    // If current time is after Maghrib, we need to check against next day's Fajr
    if (now > maghribDate) {
      fajrDate.setDate(fajrDate.getDate() + 1);
    }

    // Can eat if time is between Maghrib and Fajr
    return now >= maghribDate && now < fajrDate;
  } catch (error: unknown) {
    // More detailed error logging
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;
      console.error('Prayer times API error:', {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
        url: axiosError.config?.url
      });
    } else {
      console.error('Unexpected error:', error);
    }
    return false;
  }
};
