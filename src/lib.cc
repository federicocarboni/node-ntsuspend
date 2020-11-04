#include <windows.h>
#include <napi.h>

#define NT_SUCCESS(Status) (((NTSTATUS)(Status)) >= 0)

typedef NTSTATUS (NTAPI *pNtSuspendProcess)(IN HANDLE ProcessHandle);

static pNtSuspendProcess nt_suspend_process;
static pNtSuspendProcess nt_resume_process;

static inline bool ntsuspend(const Napi::CallbackInfo& info, pNtSuspendProcess nt_fn) {
  if (!info[0].IsNumber()) {
    return false;
  }
  const long process_id = info[0].ToNumber().Int64Value();
  if (process_id < 0) {
    return false;
  }
  const HANDLE process_handle = OpenProcess(PROCESS_SUSPEND_RESUME, FALSE, (DWORD)process_id);
  if (process_handle == NULL) {
    return false;
  }
  const NTSTATUS status = nt_fn(process_handle);
  CloseHandle(process_handle);
  return NT_SUCCESS(status);
}

#define JS_BOOL(info, value) (Napi::Boolean::New(info.Env(), ((bool)(value))))

static inline Napi::Boolean suspend(const Napi::CallbackInfo& info) {
  return JS_BOOL(info, ntsuspend(info, nt_suspend_process));
}

static inline Napi::Boolean resume(const Napi::CallbackInfo& info) {
  return JS_BOOL(info, ntsuspend(info, nt_resume_process));
}

static Napi::Object init(Napi::Env env, Napi::Object exports) {
  const HMODULE ntdll = GetModuleHandle("ntdll");
  nt_suspend_process = (pNtSuspendProcess)GetProcAddress(ntdll, "NtSuspendProcess");
  nt_resume_process = (pNtSuspendProcess)GetProcAddress(ntdll, "NtResumeProcess");

  exports.Set("suspend", Napi::Function::New(env, suspend));
  exports.Set("resume", Napi::Function::New(env, resume));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, init)
