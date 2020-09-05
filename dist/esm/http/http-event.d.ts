export declare enum HttpEventType {
    Sent = 0,
    UploadProgress = 1,
    ResponseHeader = 2,
    DownloadProgress = 3,
    Response = 4,
    User = 5,
    ResponseError = 6
}
export interface HttpProgressEvent {
    type: HttpEventType.DownloadProgress | HttpEventType.UploadProgress;
    loaded: number;
    total?: number;
}
export interface HttpDownloadProgressEvent extends HttpProgressEvent {
    type: HttpEventType.DownloadProgress;
    partialText?: string;
}
export interface HttpUploadProgressEvent extends HttpProgressEvent {
    type: HttpEventType.UploadProgress;
}
export interface HttpSentEvent {
    type: HttpEventType.Sent;
}
export interface HttpUserEvent<T> {
    type: HttpEventType.User;
}
