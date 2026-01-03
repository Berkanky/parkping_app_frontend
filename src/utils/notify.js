import { Notify } from "quasar";

function norm(msg) {
  if (!msg) return "";
  return String(msg).trim();
}

function base(message, opts) {
  var m = norm(message);
  if (!m) return;

  Notify.create({
    position: "top",
    timeout: 2500,
    ...opts,
    message: m
  });
}

export default {
  success(message, opts) {
    base(message, { type: "positive", ...opts });
  },
  error(message, opts) {
    base(message, { type: "negative", timeout: 3500, ...opts });
  },
  info(message, opts) {
    base(message, { type: "info", ...opts });
  }
};
