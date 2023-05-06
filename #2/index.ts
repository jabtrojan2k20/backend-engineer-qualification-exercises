import jsonData from './data.json';


interface StatusLogEntry {
  status: string;
  timestamp: string;
}

/**
 * Calculates the ratio between the amount of time when status is AVAILABLE and
 * the amount of time between startDateTime inclusive and endDateTime exclusive.
 * @param startDateTime 
 * @param endDateTime 
 */
export function availability(startDateTime: Date, endDateTime: Date): number {

  const statusLog: StatusLogEntry[] = jsonData;

  const filteredLog = statusLog.filter((entry) => {
    const timestamp = new Date(entry.timestamp);
    return timestamp >= startDateTime && timestamp < endDateTime;
  });

  const totalTime = endDateTime.getTime() - startDateTime.getTime();

  const availableTime = filteredLog.reduce((acc, entry, index) => {
    if (entry.status === "AVAILABLE") {
      const nextEntry = filteredLog[index + 1];
      const entryTime = new Date(entry.timestamp).getTime();
      const nextEntryTime = nextEntry ? new Date(nextEntry.timestamp).getTime() : endDateTime.getTime();
      const duration = nextEntryTime - entryTime;

      return acc + duration;
    } else {
      return acc;
    }
  }, 0);

  const ratio = availableTime / totalTime;

  return ratio;
}

/**
 * Generates the outages between startDateTime inclusive and endDateTime exclusive.
 * An outage is PARTIAL if the status within the period is PARTIALLY_AVAILABLE.
 * Similarly, an outage is MAJOR if the status within the period is MAJOR.
 * @param startDateTime 
 * @param endDateTime 
 */
export function outages(startDateTime: Date, endDateTime: Date): { type: 'PARTIAL' | 'MAJOR', timestamp: Date, duration: number }[] {
  // do something
  return [];
}
