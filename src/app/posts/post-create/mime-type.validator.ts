import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

/*export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
        let header="";
const arr=new Uint8Array(fileReader.result).subarray(0,4);
for(let i=0;i<arr.length;i++){
header+=arr[i].toString;
}
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
};*/
