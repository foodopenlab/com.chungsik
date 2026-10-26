const NUMBER = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g;

// 문자열 속 숫자들을 progress(0~1)만큼만 키운 문자열. 쉼표·소수 자릿수 유지.
export function countUp(text: string, progress: number): string {
  return text.replace(NUMBER, (token) => {
    const decimals = token.split(".")[1]?.length ?? 0;
    const value = Number(token.replace(/,/g, "")) * progress;
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: token.includes(","),
    });
  });
}
