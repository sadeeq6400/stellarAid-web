import { InternalAxiosRequestConfig } from 'axios';

type RequestCallback = (token: string) => void;
type FailCallback = () => void;

interface PendingRequest {
  resolve: RequestCallback;
  reject: FailCallback;
}

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

export function addPendingRequest(resolve: RequestCallback, reject: FailCallback) {
  pendingRequests.push({ resolve, reject });
}

export function resolvePendingRequests(token: string) {
  pendingRequests.forEach((req) => req.resolve(token));
  pendingRequests = [];
}

export function rejectPendingRequests() {
  pendingRequests.forEach((req) => req.reject());
  pendingRequests = [];
}

export function getIsRefreshing() {
  return isRefreshing;
}

export function setIsRefreshing(value: boolean) {
  isRefreshing = value;
}

type SessionExpiredListener = (config: InternalAxiosRequestConfig) => void;

let sessionExpiredListener: SessionExpiredListener | null = null;

export function onSessionExpired(listener: SessionExpiredListener) {
  sessionExpiredListener = listener;
}

export function emitSessionExpired(config: InternalAxiosRequestConfig) {
  sessionExpiredListener?.(config);
}
