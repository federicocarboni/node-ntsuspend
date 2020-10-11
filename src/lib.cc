#include <windows.h>
#include <napi.h>

// check if the given status is success, see ntdef.h
#define NT_SUCCESS(Status) (((NTSTATUS)(Status)) >= 0)

// define the signature for NtSuspendProcess and NtResumeProcess
typedef NTSTATUS (NTAPI *pNtSuspendProcess)(IN HANDLE ProcessHandle);

static pNtSuspendProcess NtSuspendProcess;
static pNtSuspendProcess NtResumeProcess;

// suspends or resumes the given process
static inline Napi::Boolean SuspendResumeProcess(const Napi::CallbackInfo& info, pNtSuspendProcess suspendOrResume) {
  if (!info[0].IsNumber()) {
    return Napi::Boolean::New(info.Env(), false);
  }
  const DWORD pid = info[0].ToNumber().Int64Value();
  // get a handle to the process with access for suspending and resuming
  const HANDLE hProcess = OpenProcess(PROCESS_SUSPEND_RESUME, FALSE, pid);
  // if `OpenProcess()` failed, return false
  if (hProcess == NULL) {
    return Napi::Boolean::New(info.Env(), false);
  }
  const NTSTATUS status = suspendOrResume(hProcess);
  CloseHandle(hProcess);
  return Napi::Boolean::New(info.Env(), NT_SUCCESS(status));
}

static Napi::Boolean Suspend(const Napi::CallbackInfo& info) {
  return SuspendResumeProcess(info, NtSuspendProcess);
}

static Napi::Boolean Resume(const Napi::CallbackInfo& info) {
  return SuspendResumeProcess(info, NtResumeProcess);
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  // get a handle to NTDLL
  const HMODULE ntdll = GetModuleHandle("ntdll");
  // get the functions `NtSuspendProcess()` and `NtResumeProcess()`
  NtSuspendProcess = (pNtSuspendProcess)GetProcAddress(ntdll, "NtSuspendProcess");
  NtResumeProcess = (pNtSuspendProcess)GetProcAddress(ntdll, "NtResumeProcess");
  // export `Suspend()` and `Resume()` as JavaScript functions
  exports.Set("suspend", Napi::Function::New(env, Suspend));
  exports.Set("resume", Napi::Function::New(env, Resume));
  return exports;
}

// initialize Node.js addon
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
