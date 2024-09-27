// mainfolder / components / UserTimesheetData;

import connectMongo from '@/db/connectMongo';
import Timesheet from '@/models/Timesheet';
import {
  calculateTotalMinutes,
  convertMinutesToHours,
} from '@/utils/dateUtils';

const UserTimesheetData = async ({ username }) => {
  try {
    // Establish MongoDB connection
    await connectMongo();

    // Define the time range (start and end of the week)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (today.getDay() || 7) + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Fetch timesheets for the current week, sorted by date
    const timesheets = await Timesheet.find({
      username,
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    }).sort({ date: -1 });

    // Calculate total minutes worked this week
    const totalMinutes = calculateTotalMinutes(timesheets);
    const { hours: totalHours, minutes: remainingMinutes } =
      convertMinutesToHours(totalMinutes);

    // Helper function: Format date as "17 Aug 24"
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      }).format(date);
    };

    // Helper function: Format hours and minutes for display
    const formatTime = (hours, minutes) => {
      if (minutes === 0) {
        return `${hours} hrs`;
      } else {
        return `${hours} hrs ${minutes} mins`;
      }
    };

    // JSX rendering the table with timesheet data
    return (
      <div className='p-4 sm:p-5'>
        <h2 className='text-xl md:text-lg font-semibold mb-3 sm:mb-4 text-center sm:text-left text-slate-700'>
          {`${username}'s latest work`}
        </h2>
        <div className='overflow-x-auto rounded-md'>
          <table className='min-w-full bg-white border text-xs sm:text-sm'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border px-2 sm:px-4 py-2 text-left'>Date</th>
                <th className='border px-2 sm:px-4 py-2 text-left'>Start</th>
                <th className='border px-2 sm:px-4 py-2 text-left'>End</th>
                <th className='border px-2 sm:px-4 py-2 text-left'>
                  Hours Worked
                </th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map((ts) => {
                const { hours, minutes } = convertMinutesToHours(
                  calculateTotalMinutes([{ start: ts.start, end: ts.end }])
                );
                return (
                  <tr key={ts._id} className='hover:bg-gray-50'>
                    <td className='border px-2 sm:px-4 py-1 sm:py-2'>
                      {formatDate(ts.date)}
                    </td>
                    <td className='border px-2 sm:px-4 py-1 sm:py-2'>
                      {ts.start}
                    </td>
                    <td className='border px-2 sm:px-4 py-1 sm:py-2'>
                      {ts.end}
                    </td>
                    <td className='border px-2 sm:px-4 py-1 sm:py-2 font-medium'>
                      {formatTime(Math.floor(hours), Math.round(minutes))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className='bg-gray-100'>
                <td
                  colSpan='3'
                  className='border px-2 sm:px-4 py-2 font-bold text-left'
                >
                  Total Hours
                </td>
                <td className='border px-2 sm:px-4 py-2 font-bold'>
                  {formatTime(totalHours, remainingMinutes)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch timesheets:', error);
    // Return error message inside the JSX
    return (
      <div className='text-red-500'>
        Error loading timesheets. Please try again later.
      </div>
    );
  }
};

export default UserTimesheetData;
