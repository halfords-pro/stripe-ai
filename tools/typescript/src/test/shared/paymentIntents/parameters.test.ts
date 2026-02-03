import {listPaymentIntentsParameters} from '@/shared/paymentIntents/listPaymentIntents';
import {searchPaymentIntentsParameters} from '@/shared/paymentIntents/searchPaymentIntents';

describe('listPaymentIntentsParameters', () => {
  it('should return the correct parameters if no context', () => {
    const parameters = listPaymentIntentsParameters({});

    const fields = Object.keys(parameters.shape);
    expect(fields).toEqual(['customer', 'limit']);
    expect(fields.length).toBe(2);
  });

  it('should return the correct parameters if customer is specified', () => {
    const parameters = listPaymentIntentsParameters({customer: 'cus_123'});

    const fields = Object.keys(parameters.shape);
    expect(fields).toEqual(['limit']);
    expect(fields.length).toBe(1);
  });
});

describe('searchPaymentIntentsParameters', () => {
  it('should return the correct parameters', () => {
    const parameters = searchPaymentIntentsParameters({});

    const fields = Object.keys(parameters.shape);
    expect(fields).toEqual(['query', 'limit', 'page']);
    expect(fields.length).toBe(3);
  });

  it('should have query as a required field', () => {
    const parameters = searchPaymentIntentsParameters({});

    const result = parameters.safeParse({});
    expect(result.success).toBe(false);

    const validResult = parameters.safeParse({query: 'status:"succeeded"'});
    expect(validResult.success).toBe(true);
  });

  it('should validate limit range', () => {
    const parameters = searchPaymentIntentsParameters({});

    const tooLow = parameters.safeParse({query: 'test', limit: 0});
    expect(tooLow.success).toBe(false);

    const tooHigh = parameters.safeParse({query: 'test', limit: 101});
    expect(tooHigh.success).toBe(false);

    const valid = parameters.safeParse({query: 'test', limit: 50});
    expect(valid.success).toBe(true);
  });
});
