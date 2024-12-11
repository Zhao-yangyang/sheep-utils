import EXIF from 'exifr';
import type { ExifData } from '@/types/exif';

interface LocationResponse {
    display_name: string;
}

interface ExifRawData {
    ImageWidth?: number;
    ImageHeight?: number;
    Make?: string;
    Model?: string;
    Software?: string;
    DateTime?: string;
    ExposureTime?: number;
    FNumber?: number;
    ISO?: number;
    FocalLength?: number;
    ExifImageWidth?: number;
    ExifImageHeight?: number;
    Orientation?: number;
    latitude?: number;
    longitude?: number;
    Copyright?: string;
    Artist?: string;
}

const NOMINATIM_CACHE = new Map<string, string>()
const RATE_LIMIT_MS = 1000 // 1秒限制

export async function getExifData(file: File): Promise<ExifData> {
    const exifData: ExifData = {};
    try {
        // 使用 exifr 的 parse 方法获取所有 EXIF 数据
        const data = await EXIF.parse(file, {
            // 启用所有可能的选项
            tiff: true,
            exif: true,
            gps: true,
            ifd1: true,
            interop: true,
            // 转换值为可读格式
            translateKeys: true,
            translateValues: true,
            reviveValues: true,
        }) as ExifRawData;

        if (!data) {
            return exifData;
        }
        
        // 图像信息 - 从原始数据中获取
        if (data.ImageWidth) exifData.ExifImageWidth = data.ImageWidth;
        if (data.ImageHeight) exifData.ExifImageHeight = data.ImageHeight;
        
        // 基本信息
        if (data.Make) exifData.Make = data.Make;
        if (data.Model) exifData.Model = data.Model;
        if (data.Software) exifData.Software = data.Software;
        if (data.DateTime) exifData.DateTime = formatExifDateTime(data.DateTime);
        
        // 拍摄参数
        if (data.ExposureTime) exifData.ExposureTime = formatExposureTime(data.ExposureTime);
        if (data.FNumber) exifData.FNumber = data.FNumber;
        if (data.ISO) exifData.ISO = data.ISO;
        if (data.FocalLength) exifData.FocalLength = formatFocalLength(data.FocalLength);
        
        // 图像信息
        if (data.ExifImageWidth) exifData.ExifImageWidth = data.ExifImageWidth;
        if (data.ExifImageHeight) exifData.ExifImageHeight = data.ExifImageHeight;
        if (data.Orientation) exifData.Orientation = data.Orientation;
        
        // GPS信息
        if (data.latitude && data.longitude) {
            exifData.latitude = data.latitude;
            exifData.longitude = data.longitude;
            exifData.location = await getLocationName(data.latitude, data.longitude);
        }
        
        // 其他信息
        if (data.Copyright) exifData.Copyright = data.Copyright;
        if (data.Artist) exifData.Artist = data.Artist;
        
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error reading EXIF data:', error.message);
        }
    }
    return exifData;
}

// 辅助格式化函数
function formatExifDateTime(datetime: string | undefined): string {
    if (!datetime) return '';
    try {
        return new Date(datetime).toLocaleString();
    } catch {
        return '';
    }
}

function formatExposureTime(time: number | undefined): string {
    if (!time) return '';
    try {
        return time < 1 ? `1/${Math.round(1/time)}` : time.toString();
    } catch {
        return '';
    }
}

function formatFocalLength(length: number | undefined): string {
    if (!length) return '';
    try {
        return `${length}mm`;
    } catch {
        return '';
    }
}

async function getLocationName(lat: number, lng: number): Promise<string> {
    const cacheKey = `${lat},${lng}`
    if (NOMINATIM_CACHE.has(cacheKey)) {
        return NOMINATIM_CACHE.get(cacheKey)!
    }

    // 添加延时以符合使用政策
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS))

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        const data = await response.json() as LocationResponse
        const location = data.display_name || ''
        NOMINATIM_CACHE.set(cacheKey, location)
        return location
    } catch {
        return ''
    }
}
