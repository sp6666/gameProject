export class ResItem {
  url: string = "";
  type: any = null;
  //使用次数
  useCount: number = 0;
  res: any = null;

  constructor(url: string, res: any) {
    this.url = url;
    this.res = res;
    this.useCount = 1;
  }
}
