using System;
using System.Globalization;

namespace ReactApi.Application.Dto.Gregorian
{
    public static class DateHelper
    {
        public static string? ToPersianDate(DateOnly? date)
        {
            if (date == null) return null;

            var dt = date.Value.ToDateTime(TimeOnly.MinValue);
            var persianCalendar = new PersianCalendar();

            int year = persianCalendar.GetYear(dt);
            int month = persianCalendar.GetMonth(dt);
            int day = persianCalendar.GetDayOfMonth(dt);

            return $"{year:0000}-{month:00}-{day:00}";
        }

        public static int GetPersianYear(DateOnly date)
        {
            var dt = date.ToDateTime(TimeOnly.MinValue);
            var persianCalendar = new PersianCalendar();

            return persianCalendar.GetYear(dt);
        }

    }
}
