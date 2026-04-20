/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param dateStr ISO 日期字符串或可被 Date 构造的字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
