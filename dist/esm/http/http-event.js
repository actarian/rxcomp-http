export var HttpEventType;
(function (HttpEventType) {
    HttpEventType[HttpEventType["Sent"] = 0] = "Sent";
    HttpEventType[HttpEventType["UploadProgress"] = 1] = "UploadProgress";
    HttpEventType[HttpEventType["ResponseHeader"] = 2] = "ResponseHeader";
    HttpEventType[HttpEventType["DownloadProgress"] = 3] = "DownloadProgress";
    HttpEventType[HttpEventType["Response"] = 4] = "Response";
    HttpEventType[HttpEventType["User"] = 5] = "User";
    HttpEventType[HttpEventType["ResponseError"] = 6] = "ResponseError";
})(HttpEventType || (HttpEventType = {}));
