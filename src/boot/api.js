import { boot } from "quasar/wrappers";
import axios from "axios";
import notify from "../utils/notify";

var api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 30000
});

function getMeta(config) {
  return (config && config.meta) ? config.meta : {};
}

function normalizeErrors(payload) {
  if (!payload) return "";

  var errs = payload.errors;

  if (Array.isArray(errs) && errs.length) {
    var take = errs.slice(0, 3).map((x) => String(x).trim()).filter(Boolean);

    if (!take.length) return "";

    var msg = take.join("\n");
    if (errs.length > take.length) msg += `\n(+${errs.length - take.length} more)`;

    return msg;
  }

  return "";
}

function normalizeMessage(payload, fallback) {
  var errMsg = normalizeErrors(payload);
  if (errMsg) return errMsg;

  if (payload && typeof payload.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }

  return fallback || "Unexpected error";
}

api.interceptors.response.use(
  (res) => {
    var data = res.data || {};
    console.log("axios_interceptor -> " + JSON.stringify(data));
    var meta = getMeta(res.config);

    if (meta.notify === false) return res;

    var forcedNotify = data.notify === true;
    var isSuccess = data.success === true;
    var isLogicalError = data.success === false;

    // success notify
    if (isSuccess && (forcedNotify || meta.notifySuccess === true)) {
      notify.success(normalizeMessage(data, "Success"));
    }

    // 200 içinde logical error notify (Joi dahil)
    if (isLogicalError && (forcedNotify || meta.notifyLogicalError === true)) {
      notify.error(normalizeMessage(data, "Request failed"));
    }

    return res;
  },
  (err) => {
    var cfg = err.config || {};
    var meta = getMeta(cfg);

    if (meta.notify === false) return Promise.reject(err);

    if (meta.notifyError !== false) {
      var payload = err.response && err.response.data ? err.response.data : null;
      var forcedNotify = payload && payload.notify === true;

      if (forcedNotify || meta.notifyError !== false) {
        var msg = normalizeMessage(payload, err.message || "Request failed");
        notify.error(msg);
      }
    }

    return Promise.reject(err);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;
});

export { api };