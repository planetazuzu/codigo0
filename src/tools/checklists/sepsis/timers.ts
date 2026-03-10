export const formatDuration = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getElapsedSeconds = (startedAt: number | null) => {
  if (!startedAt) return 0;
  return Math.floor((Date.now() - startedAt) / 1000);
};

export const getRemainingSeconds = (startedAt: number | null, totalSeconds: number) => {
  if (!startedAt) return totalSeconds;
  const elapsed = getElapsedSeconds(startedAt);
  return Math.max(0, totalSeconds - elapsed);
};
