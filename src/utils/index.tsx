import * as Cheerio from 'cheerio';
import BackgroundTimer from 'react-native-background-timer';

export const randomIntFromInterval = (min: number, max: number) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export function delay(delay: number) {
    return new Promise((r) => {
        console.log('call timeout delay')
        BackgroundTimer.setTimeout(() => {
          r();
        }, delay);
        // setTimeout(r, delay);
    });
}

export function objToQueryString(obj: any) {
    const keyValuePairs = new Array();
    for (const key in obj) {
        keyValuePairs.push(
            encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
        );
    }
    return keyValuePairs.join("&");
}

export function truncate(str: string, arrStr: any[], n: number): any {
    str = str.trim();
    if (str.length <= n) {
      arrStr.push(str);
      return;
    }
    let subString = str.substring(0, n - 1); // the original check
    let indexDot = 0;
    let indexSpace = 0;
    if (subString.includes(".")) {
      indexDot = subString.lastIndexOf(".");
    }
    if (subString.includes(" ")) {
      indexSpace = subString.lastIndexOf(" ");
    }
    let indexLast = indexDot ? indexDot : indexSpace;
    if (indexLast > 0) {
      subString = subString.substring(0, indexLast);
    }
    arrStr.push(
      subString
        .trim()
        .replace(/^\./, "")
        .replace(/\.\s*$/, "")
    );
    return truncate(str.substring(subString.length, str.length - 1), arrStr, n);
  }

  export function getContentInHtml(html: string, selector: string): any {
    if(html && selector) {
      let str = "";
      const arr = selector.split(',');
      const $ = Cheerio.load(html);
      arr.forEach(x => {
        str += ($(x).text() + " ." || "").trim();
      })
      return str;
    }
    return "";
  }

  export function getNextLinkInHtml(html: string, selector: string): any {
    if(html) {
      const $ = Cheerio.load(html);
      return $(selector)?.attr('href') || "";
    }
  }