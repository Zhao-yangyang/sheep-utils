export interface ExifData {
  // 基本信息
  Make?: string               // 相机制造商
  Model?: string             // 相机型号
  Software?: string          // 软件
  DateTime?: string          // 拍摄时间
  
  // 拍摄参数
  ExposureTime?: number      // 曝光时间
  FNumber?: number           // 光圈值
  ISO?: number               // ISO 感光度
  FocalLength?: number       // 焦距
  
  // 图像信息
  ExifImageWidth?: number    // 原始宽度
  ExifImageHeight?: number   // 原始高度
  Orientation?: number       // 方向
  
  // GPS信息
  latitude?: number          // 纬度
  longitude?: number         // 经度
  
  // 其他
  Copyright?: string         // 版权信息
  Artist?: string           // 作者
}
