import { ExampleClass } from '../ExampleClass';

export class ExampleChildClass extends ExampleClass {
  printSomethingOther() {
    console.log('Hallo, ich bin die Example Child Klasse');
    return 'Hallo';
  }
}
