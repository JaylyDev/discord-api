export class Debug {
  private readonly category: string;
  private get date (): string {
    return DateParse(new Date());
  };

  log (...arg: any) {  
    console.log(`[${this.date} INFO] ${this.category}`, ...arg);
  };

  warn (...arg: any) {  
    console.warn(`[${this.date} WARN] ${this.category}`, ...arg);
  };

  error (...arg: any) {  
    console.error(`[${this.date} ERROR] ${this.category}`, ...arg);
  };
  
  constructor (category: string) {
    this.category = category;
  };
};

function DateParse (date: Date) {
  let isoString = date.toISOString();
  
  isoString = isoString.replace('T', ' ');
  isoString = isoString.replace('Z', '');

  return isoString;
};