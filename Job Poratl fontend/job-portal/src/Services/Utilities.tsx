// =========================
// 1. Format tháng / năm
// =========================
export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch (error) {
    console.error("formatDate error:", error);
    return "N/A";
  }
};

// =========================
// 2. Time ago 
// =========================
export const timeAgo = (time: string | number | Date | null | undefined) => {
  try {
    // Check null/undefined
    if (!time) {
      return "recently";
    }

    let inputDate: Date;

    // Parse input
    if (typeof time === "number") {
      // Xử lý timestamp (seconds hoặc milliseconds)
      inputDate = new Date(time < 10000000000 ? time * 1000 : time);
    } else if (time instanceof Date) {
      inputDate = time;
    } else {
      inputDate = new Date(time);
    }
    
    // Validate parse
    if (isNaN(inputDate.getTime())) {
      return "recently";
    }
    
    // Validate year (reasonable range) - MỞ RỘNG HƠN NỮA
    const year = inputDate.getFullYear();
    if (year < 2000 || year > 2030) { // ✅ Thay đổi từ 2100 xuống 2030
      console.warn("Year out of expected range:", year);
      return "recently";
    }

    const now = Date.now();
    const inputTime = inputDate.getTime();
    const diff = Math.floor((now - inputTime) / 1000); // diff tính bằng giây

    // ✅ XỬ LÝ NGÀY TƯƠNG LAI (future dates)
    if (diff < 0) {
      const absDiff = Math.abs(diff);
      
      // Nếu chênh lệch < 5 phút, coi như "just now"
      if (absDiff < 300) return "just now";
      
      // Ngược lại, format ngày tháng năm
      const currentYear = new Date().getFullYear();
      if (year === currentYear) {
        return inputDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        });
      } else {
        return inputDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      }
    }

    // ✅ XỬ LÝ NGÀY QUÁ KHỨ (past dates)
    if (diff < 60) return "just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;

    // >= 1 tháng → show date
    const currentYear = new Date().getFullYear();

    if (year === currentYear) {
      return inputDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    } else {
      return inputDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
  } catch (error) {
    console.error("timeAgo error:", error);
    return "recently";
  }
};

// =========================
// 3. File -> base64
// =========================
export const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

// =========================
// 4. HIỂN THỊ GIỜ PHỎNG VẤN (UTC -> JST)
// =========================
export const formatInterviewTime = (dateStr: string | null | undefined) => {
  if (!dateStr) return "Not scheduled";
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    
    return date.toLocaleString("en-US", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting interview time:", error);
    return "Invalid date";
  }
};

// =========================
// 5. CHUYỂN GIỜ USER CHỌN (JST -> UTC) TRƯỚC KHI GỬI BACKEND
// =========================
export const convertJSTtoUTCISOString = (dateStr: string) => {
  try {
    if (!dateStr) return new Date().toISOString();
    
    // Nếu đã có timezone, parse trực tiếp
    if (dateStr.includes('+') || dateStr.includes('Z')) {
      return new Date(dateStr).toISOString();
    }
    
    // Nếu không có timezone, thêm +09:00 cho JST
    return new Date(dateStr + '+09:00').toISOString();
  } catch (error) {
    console.error("Error converting JST to UTC:", error);
    return new Date().toISOString();
  }
};

// =========================
// 6. HELPER: Format salary
// =========================
export const formatSalary = (amount: number | null | undefined) => {
  if (!amount || amount === 0) return "Negotiable";
  
  // Xử lý số quá lớn (có thể là lỗi nhập liệu)
  if (amount > 1000000000) {
    return `$${(amount / 1000000).toFixed(1)}M+`;
  }
  
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  
  return `$${amount.toLocaleString()}`;
};

// =========================
// 7. HELPER: Validate date range
// =========================
export const isDateInRange = (
  date: string | Date | null | undefined,
  startDate?: string | Date,
  endDate?: string | Date
): boolean => {
  try {
    if (!date) return false;
    
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) return false;
    
    if (startDate) {
      const start = new Date(startDate);
      if (targetDate < start) return false;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      if (targetDate > end) return false;
    }
    
    return true;
  } catch (error) {
    console.error("isDateInRange error:", error);
    return false;
  }
};