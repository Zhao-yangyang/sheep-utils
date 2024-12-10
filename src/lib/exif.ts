import EXIF from 'exifr';
import { ExifData } from '@/types/exif';

export async function getExifData(file: File): Promise<ExifData> {
    const exifData: ExifData = {};
    try {
        const data = await EXIF.parseGeotagged(file);
        if (data) {
            // 读取基本信息
            exifData.Make = data.Make;
            exifData.Model = data.Model;
            exifData.Software = data.Software;
            exifData.DateTime = data.DateTime;
            
            // 读取拍摄参数
            exifData.ExposureTime = data.ExposureTime;
            exifData.FNumber = data.FNumber;
            exifData.ISO = data.ISO;
            exifData.FocalLength = data.FocalLength;
            
            // 读取图像信息
            exifData.ExifImageWidth = data.ExifImageWidth;
            exifData.ExifImageHeight = data.ExifImageHeight;
            exifData.Orientation = data.Orientation;
            
            // 读取GPS信息
            exifData.latitude = data.latitude;
            exifData.longitude = data.longitude;
            
            // 读取其他信息
            exifData.Copyright = data.Copyright;
            exifData.Artist = data.Artist;
        }
    } catch (error) {
        console.error('Error reading EXIF data:', error);
        return exifData; // 返回空的 EXIF 数据对象
    }
    return exifData;
}
