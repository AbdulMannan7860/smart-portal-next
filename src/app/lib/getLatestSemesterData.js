export default function getLatestSemesterData(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  const parsed = data.map((item) => {
    const [season, year] = item.FKSems_Name.split(" ");
    return {
      ...item,
      year: parseInt(year, 10),
      season,
      seasonRank: season.toUpperCase() === "SPRING" ? 1 : 2,
    };
  });

  const latestYear = Math.max(...parsed.map((item) => item.year));

  const latestYearData = parsed.filter((item) => item.year === latestYear);

  const latestSeasonRank = Math.max(
    ...latestYearData.map((item) => item.seasonRank)
  );

  const latestData = latestYearData.filter(
    (item) => item.seasonRank === latestSeasonRank
  );
  const returnData = latestData.map((item) => ({
    code: item.CourseCode,
    name: item.course_name,
  }));

  return returnData;
}
