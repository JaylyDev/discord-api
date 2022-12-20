/** @internal */
export class Debug {
  /** @internal */
  private readonly category: string;
  private get date (): string {
    return DateParse(new Date());
  };

  log (...arg: any) {  
    console.log(`[${this.date}][${this.category}]`, ...arg);
  };

  warn (...arg: any) {  
    console.warn(`[${this.date}][${this.category}]`, ...arg);
  };

  error (...arg: any) {  
    console.error(`[${this.date}][${this.category}]`, ...arg);
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