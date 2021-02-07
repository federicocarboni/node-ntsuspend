/**
 * **Windows ONLY**
 *
 * Suspends a process given its ID. Uses `NtSuspendProcess()` from NTDLL.
 *
 * @param pid - ID of the process to suspend.
 * @returns `true` if it succeeds or `false` if it fails.
 */
export declare function suspend(pid: number): boolean;
/**
 * **Windows ONLY**
 *
 * Resume a process given its ID. Uses `NtResumeProcess()` from NTDLL.
 *
 * @param pid - ID of the process to resume.
 * @returns `true` if it succeeds or `false` if it fails.
 */
export declare function resume(pid: number): boolean;
