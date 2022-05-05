import { ExampleClass } from './ExampleClass';

describe('ExampleClass', () => {
  it('should contain abc', () => {
    const cool = new ExampleClass();
    expect(cool.printSomething()).toContain('Hallo');
  });

  it('should return xyz', () => {
    const cool = new ExampleClass();
    expect(cool.printSomething()).toContain('Hallo');
  });
});
