import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  private exceptions = ['de', 'la', 'y', 'en', 'con', 'a', 'el', 'los', 'las'];
  private romanNumbers = [
    'i',
    'ii',
    'iii',
    'iv',
    'v',
    'vi',
    'vii',
    'viii',
    'ix',
    'x',
  ];

  transform(value: string): string {
    if (!value) return value;
    return value
      .split(' ')
      .map((word, index) => {
        // Always capitalize the first word
        if (index === 0 || !this.exceptions.includes(word.toLowerCase())) {
          if (this.romanNumbers.includes(word.toLowerCase())) {
            return word.toUpperCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
          return word.toLowerCase();
        }
      })
      .join(' ');
  }
}
