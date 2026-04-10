import { message } from "antd";
import "./notify.css";

export const notifySuccess = (msg: string) => {
  message.success(msg);
};

export const notifyError = (msg: string) => {
  message.error(msg);
};

export const notifyWarning = (msg: string) => {
  message.warning(msg);
};

export const notifyInfo = (msg: string) => {
  message.info(msg);
};