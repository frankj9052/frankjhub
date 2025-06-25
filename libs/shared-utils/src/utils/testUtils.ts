/**
 * Simulates an asynchronous delay for testing purposes.
 *
 * @param ms - The number of milliseconds to wait. Defaults to 2000ms.
 * @param label - A label used for logging before and after the delay. Defaults to "Processing...".
 *
 * @example
 * await testDelay(1000, "Submitting Form");
 * // Logs: "Submitting Form (waiting 1000ms)"
 * // Waits 1 second...
 * // Logs: "Submitting Form done"
 */
export async function testDelay(ms = 2000, label = 'Processing...') {
  console.log(`${label} (waiting ${ms}ms)`);
  await new Promise(resolve => setTimeout(resolve, ms));
  console.log(`${label} done`);
}
