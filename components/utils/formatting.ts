export const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(dateString));
  };
  
  export const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  export const formatUSD = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };
  

  export const formatIDRHuman = (value: number) => {
    const absValue = Math.abs(value);
    let formatted = "";
  
    if (absValue >= 1_000_000_000_000) {
      formatted = (value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
    } else if (absValue >= 1_000_000_000) {
      formatted = (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (absValue >= 1_000_000) {
      formatted = (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (absValue >= 1_000) {
      formatted = (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
      formatted = value.toString();
    }
  
    return `IDR ${formatted}`;
  };
  

  
  export const formatUSDHuman = (value: number) => {
    const absValue = Math.abs(value);
    let formatted = "";
  
    if (absValue >= 1_000_000_000_000) {
      formatted = (value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
    } else if (absValue >= 1_000_000_000) {
      formatted = (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (absValue >= 1_000_000) {
      formatted = (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (absValue >= 1_000) {
      formatted = (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
      formatted = value.toString();
    }
  
    return `${formatted}`;
  };
  