import { middleware } from './middleware';

describe('middleware', () => {
  it('should work', () => {
    expect(middleware()).toEqual('middleware');
  });
});
