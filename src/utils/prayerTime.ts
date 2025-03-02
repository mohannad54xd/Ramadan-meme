import axios from 'axios';

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
    // Using Aladhan API for Amman, Jordan
    const response = await axios.get(
      'http://api.aladhan.com/v1/timingsByCity',
      {
        params: {
          city: 'Giza',
          country: 'Egypt',
          method: 4
        }
      }
    );

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
  } catch (error) {
    const err = error as any;
    console.error('Prayer times API error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    return false;
  }
};
