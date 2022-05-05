import { ExampleClass } from './app/ExampleClass';
import { ExampleChildClass } from './app/ExampleChildClass';

console.log('Hello WORLD');
console.log('asdf');

const exampleClass = new ExampleClass();
const exampleChildClass = new ExampleChildClass();

exampleClass.printSomething();
exampleChildClass.printSomething();
exampleChildClass.printSomethingOther();
