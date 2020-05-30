import { Constants } from './../constants/constants';

export class DateBuilder {
    public static getDates(): Array<string>{
        return Array(31).fill(0).map((x, i) => ("0" + (i + 1)).slice(-2));
    }
    public static getMonths(): Array<string>{
        return Object.values(Constants.months);
    }
    public static getYears(): Array<string>{
        let years = [];
        for (var n = new Date().getFullYear() - 150; n <= new Date().getFullYear(); n++) {
            years.unshift(n);
        }
        return years;
    }
    public static getDateSelector(){
        return { dates: DateBuilder.getDates(), months: DateBuilder.getMonths(), years: DateBuilder.getYears() }
    }
}