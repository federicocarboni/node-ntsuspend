#include <windows.h>
#include <napi.h>

// From ntdef.h
#define NT_SUCCESS(Status) (((NTSTATUS)(Status)) >= 0)

typedef NTSTATUS (NTAPI *pNtSuspendProcess)(IN HANDLE ProcessHandle);

static pNtSuspendProcess NtSuspendProcess;
static pNtSuspendProcess NtResumeProcess;

static inline Napi::Boolean NtSuspendResumeProcess(const Napi::CallbackInfo& info, pNtSuspendProcess suspendOrResume) {
  if (!info[0].IsNumber()) {
    return Napi::Boolean::New(info.Env(), false);
  }
  const DWORD pid = info[0].ToNumber().Int64Value();
  const HANDLE hProcess = OpenProcess(PROCESS_SUSPEND_RESUME, FALSE, pid);
  if (hProcess == NULL) {
    return Napi::Boolean::New(info.Env(), false);
  }
  const NTSTATUS status = suspendOrResume(hProcess);
  CloseHandle(hProcess);
  return Napi::Boolean::New(info.Env(), NT_SUCCESS(status));
}

static Napi::Boolean Suspend(const Napi::CallbackInfo& info) {
  return NtSuspendResumeProcess(info, NtSuspendProcess);
}

static Napi::Boolean Resume(const Napi::CallbackInfo& info) {
  return NtSuspendResumeProcess(info, NtResumeProcess);
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  const HMODULE ntdll = GetModuleHandle("ntdll");
  NtSuspendProcess = (pNtSuspendProcess)GetProcAddress(ntdll, "NtSuspendProcess");
  NtResumeProcess = (pNtSuspendProcess)GetProcAddress(ntdll, "NtResumeProcess");
  exports.Set("suspend", Napi::Function::New(env, Suspend));
  exports.Set("resume", Napi::Function::New(env, Resume));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
