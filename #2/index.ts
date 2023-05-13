import jsonData from './data.json';
import fs from 'fs';
import './generate-data';

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
  var outages = fs.readFileSync(__dirname + '/data.json', 'utf8'); 
  const outagesData = JSON.parse(outages);
  
  const generatedOutages = [];

  for (let i = 0; i < outagesData.length; i++) {
    const outage = outagesData[i];
    var timestamp = new Date(outage.timestamp);

    if (timestamp >= startDateTime && timestamp < endDateTime) {
      if (outage.status === "PARTIALLY_AVAILABLE" || outage.status === "MAJOR") {
        let duration = 0;

        // Calculate the duration of the outage
        for (let j = i + 1; j < outagesData.length; j++) {
          const nextOutage = outagesData[j];
          const nextTimestamp = new Date(nextOutage.timestamp);

          if (nextTimestamp < endDateTime) {
            if (nextOutage.status === outage.status) {
              duration += Math.abs(nextTimestamp.getTime() - timestamp.getTime()) / (1000 * 60);
              timestamp = nextTimestamp;
              i = j; // Update the index to skip processed outages
            } else {
              break; // End of the current outage type
            }
          } else {
            break; // End of the specified time range
          }
        }
        
        generatedOutages.push({
          type: outage.status as 'PARTIAL' | 'MAJOR',
          timestamp,
          duration
        });
      }
    }
  }

  return generatedOutages;
}
