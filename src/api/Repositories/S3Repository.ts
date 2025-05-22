
import AWS from "aws-sdk";
import { myApi } from "../apiBase";

let REGION = import.meta.env.VITE_AWS_REGION;
let BUCKET_NAME = import.meta.env.VITE_AWS_BUCKET_NAME;
let KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
let AWS_SECRET_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
let s3 = new AWS.S3({
    region: REGION,
    accessKeyId: KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
});

export const S3Repository = {
    getImageUrl(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: BUCKET_NAME,
                Key: key,
                Expires: 60, // URL expires in 60 seconds
            };

            s3.getSignedUrl("getObject", params, (err, url) => {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                } else {
                    resolve(url); // Resolve the promise with the signed URL
                }
            });
        });
    },
    changeImage(movieId: string, file: File) {
        const formData = new FormData();
        formData.append("file", file);

        return myApi.post<string>(`/movie/uploadImage/${movieId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }


}