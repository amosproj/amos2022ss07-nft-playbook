import { ExampleChildClass } from './ExampleChildClass';

describe('ExampleChildClass', () => {
  it('should contain abc', () => {
    const cool = new ExampleChildClass();
    expect(cool.printSomething()).toContain('Hallo');
  });

  it('should return xyz', () => {
    const cool = new ExampleChildClass();
    expect(cool.printSomething()).toContain('Hallo');
  });
});
