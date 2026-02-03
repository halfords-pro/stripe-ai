import {listPaymentIntentsPrompt} from '@/shared/paymentIntents/listPaymentIntents';
import {searchPaymentIntentsPrompt} from '@/shared/paymentIntents/searchPaymentIntents';

describe('listPaymentIntentsPrompt', () => {
  it('should return the correct prompt', () => {
    const prompt = listPaymentIntentsPrompt();
    expect(prompt).toContain('customer');
  });

  it('should return the correct prompt when no customer is specified', () => {
    const prompt = listPaymentIntentsPrompt({});
    expect(prompt).toContain('- customer (str, optional)');
  });

  it('should return the correct prompt when a customer is specified', () => {
    const prompt = listPaymentIntentsPrompt({customer: 'cus_123'});
    expect(prompt).toContain('context: cus_123');
    expect(prompt).not.toContain('- customer (str, optional)');
  });
});

describe('searchPaymentIntentsPrompt', () => {
  it('should return the correct prompt', () => {
    const prompt = searchPaymentIntentsPrompt();
    expect(prompt).toContain('search payment intents');
    expect(prompt).toContain('query');
  });

  it('should document the query fields', () => {
    const prompt = searchPaymentIntentsPrompt({});
    expect(prompt).toContain('amount');
    expect(prompt).toContain('created');
    expect(prompt).toContain('currency');
    expect(prompt).toContain('customer');
    expect(prompt).toContain('metadata');
    expect(prompt).toContain('status');
  });

  it('should include query syntax examples', () => {
    const prompt = searchPaymentIntentsPrompt({});
    expect(prompt).toContain('status:"succeeded"');
    expect(prompt).toContain('amount>1000');
  });
});
