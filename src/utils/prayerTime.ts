import axios from 'axios';

interface PrayerTimes {
  Maghrib: string;
}

export const isMaghrebTime = async (): Promise<boolean> => {
  try {
    // Using Aladhan API for Amman, Jordan
    const response = await axios.get(
      'http://api.aladhan.com/v1/timingsByCity',
      {
        params: {
          city: 'Cairo',
          country: 'Egypt',
          method: 4
        }
      }
    );

    const data = response.data as { data: { timings: PrayerTimes } };
    const maghribTime = data.data.timings.Maghrib;
    const now = new Date();
    const [hours, minutes] = maghribTime.split(':');
    const maghribDate = new Date();
    maghribDate.setHours(parseInt(hours), parseInt(minutes), 0);

    return now >= maghribDate;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return false;
  }
};
