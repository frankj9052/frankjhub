export const AMENITIES = {
  PARKING: 'parking', // 停车
  WHEELCHAIR_ACCESS: 'wheelchair_access', // 无障碍通道
  WASHROOM: 'washroom', // 洗手间
  WIFI: 'wifi', // 无线网络
  PHARMACY_ONSITE: 'pharmacy_onsite', // 附设药房
  LAB_ONSITE: 'lab_onsite', // 附设化验室
  ELEVATOR: 'elevator', // 电梯
  WAITING_AREA: 'waiting_area', // 候诊区
  CHILD_FRIENDLY: 'child_friendly', // 儿童友好（玩具区、换尿布台等）
  PUBLIC_TRANSIT_ACCESS: 'public_transit_access', // 靠近公共交通
  BIKE_RACK: 'bike_rack', // 自行车架
  INTERPRETER_SERVICES: 'interpreter_services', // 翻译服务
} as const;

export type Amenity = (typeof AMENITIES)[keyof typeof AMENITIES];
