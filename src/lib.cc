#include <windows.h>
#include <napi.h>

#include <math.h>

#define NT_SUCCESS(Status) (((NTSTATUS)(Status)) >= 0)

typedef NTSTATUS (NTAPI *pNtSuspendProcess)(IN HANDLE ProcessHandle);

static pNtSuspendProcess NtSuspendProcess;
static pNtSuspendProcess NtResumeProcess;

static inline bool ntsuspend(const Napi::Value pid, pNtSuspendProcess suspend_or_resume) {
  if (!pid.IsNumber()) {
    return false;
  }
  const auto number_pid = pid.ToNumber();
  const auto double_pid = number_pid.DoubleValue();
  const DWORD dword_pid = number_pid.Uint32Value();
  if (isnan(double_pid) || !isfinite(double_pid) || (double) dword_pid != double_pid) {
    return false;
  }
  const HANDLE process_handle = OpenProcess(PROCESS_SUSPEND_RESUME, FALSE, dword_pid);
  if (process_handle == NULL) {
    return false;
  }
  const NTSTATUS status = suspend_or_resume(process_handle);
  CloseHandle(process_handle);
  return NT_SUCCESS(status);
}

static inline Napi::Boolean suspend(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), ntsuspend(info[0], NtSuspendProcess));
}

static inline Napi::Boolean resume(const Napi::CallbackInfo& info) {
  return Napi::Boolean::New(info.Env(), ntsuspend(info[0], NtResumeProcess));
}

static Napi::Object init(Napi::Env env, Napi::Object exports) {
  const HMODULE ntdll = GetModuleHandle("ntdll");
  NtSuspendProcess = (pNtSuspendProcess)GetProcAddress(ntdll, "NtSuspendProcess");
  NtResumeProcess = (pNtSuspendProcess)GetProcAddress(ntdll, "NtResumeProcess");

  exports.Set("suspend", Napi::Function::New(env, suspend));
  exports.Set("resume", Napi::Function::New(env, resume));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, init)
