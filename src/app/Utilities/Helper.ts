import * as moment from "jalali-moment";

export class helper{
    static getPersianDate(date: Date): string {
        if (!date)
            return '';
        
        return moment.from(date.toString(), 'en', 'YYYY-MM-DD HH:mm').locale('fa').format('YYYY-MM-DD HH:mm');        
    }

    static numberToLocale(number:number): string {
        return number.toLocaleString('fa',{useGrouping:true});
    }
}