export {};

declare global {
  interface Window {
    BMapGL: any;
    BMAP_NORMAL_MAP: any;
    BMAP_EARTH_MAP: any;
    __baiduMapSdkInit__?: () => void;
  }
}
