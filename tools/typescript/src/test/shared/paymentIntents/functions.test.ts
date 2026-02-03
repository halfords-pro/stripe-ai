import {listPaymentIntents} from '@/shared/paymentIntents/listPaymentIntents';
import {searchPaymentIntents} from '@/shared/paymentIntents/searchPaymentIntents';

const Stripe = jest.fn().mockImplementation(() => ({
  paymentIntents: {
    list: jest.fn(),
    search: jest.fn(),
  },
}));

let stripe: ReturnType<typeof Stripe>;

beforeEach(() => {
  stripe = new Stripe('fake-api-key');
});

describe('listPaymentIntents', () => {
  it('should list payment intents and return them', async () => {
    const mockPaymentIntents = [
      {
        id: 'pi_123456',
        customer: 'cus_123456',
        amount: 1000,
        status: 'succeeded',
        description: 'Test Payment Intent',
      },
    ];

    const context = {};

    stripe.paymentIntents.list.mockResolvedValue({data: mockPaymentIntents});

    const result = await listPaymentIntents(stripe, context, {});

    expect(stripe.paymentIntents.list).toHaveBeenCalledWith({}, undefined);
    expect(result).toEqual(mockPaymentIntents);
  });

  it('should list payment intents for a specific customer', async () => {
    const mockPaymentIntents = [
      {
        id: 'pi_123456',
        customer: 'cus_123456',
        amount: 1000,
        status: 'succeeded',
        description: 'Test Payment Intent',
      },
    ];

    const context = {};

    stripe.paymentIntents.list.mockResolvedValue({data: mockPaymentIntents});

    const result = await listPaymentIntents(stripe, context, {
      customer: 'cus_123456',
    });

    expect(stripe.paymentIntents.list).toHaveBeenCalledWith(
      {
        customer: 'cus_123456',
      },
      undefined
    );
    expect(result).toEqual(mockPaymentIntents);
  });

  it('should specify the connected account if included in context', async () => {
    const mockPaymentIntents = [
      {
        id: 'pi_123456',
        customer: 'cus_123456',
        amount: 1000,
        status: 'succeeded',
        description: 'Test Payment Intent',
      },
    ];

    const context = {
      account: 'acct_123456',
    };

    stripe.paymentIntents.list.mockResolvedValue({data: mockPaymentIntents});

    const result = await listPaymentIntents(stripe, context, {});

    expect(stripe.paymentIntents.list).toHaveBeenCalledWith(
      {},
      {
        stripeAccount: context.account,
      }
    );
    expect(result).toEqual(mockPaymentIntents);
  });

  it('should list payment intents for a specific customer if included in context', async () => {
    const mockPaymentIntents = [
      {
        id: 'pi_123456',
        customer: 'cus_123456',
        amount: 1000,
        status: 'succeeded',
        description: 'Test Payment Intent',
      },
    ];

    const context = {
      customer: 'cus_123456',
    };

    stripe.paymentIntents.list.mockResolvedValue({data: mockPaymentIntents});

    const result = await listPaymentIntents(stripe, context, {});

    expect(stripe.paymentIntents.list).toHaveBeenCalledWith(
      {customer: context.customer},
      undefined
    );
    expect(result).toEqual(mockPaymentIntents);
  });
});

describe('searchPaymentIntents', () => {
  it('should search payment intents and return them', async () => {
    const mockPaymentIntents = [
      {
        id: 'pi_123456',
        customer: 'cus_123456',
        amount: 1000,
        status: 'succeeded',
        description: 'Test Payment Intent',
      },
    ];

    const context = {};

    stripe.paymentIntents.search.mockResolvedValue({data: mockPaymentIntents});

    const result = await searchPaymentIntents(stripe, context, {
      query: 'status:"succeeded"',
    });

    expect(stripe.paymentIntents.search).toHaveBeenCalledWith(
      {query: 'status:"succeeded"'},
      undefined
    );
    expect(result).toEqual(mockPaymentIntents);
  });

  it('should search payment intents with limit and page', async () => {
    const mockPaymentIntents = [
      {
        id: 'pi_123456',
        customer: 'cus_123456',
        amount: 1000,
        status: 'succeeded',
        description: 'Test Payment Intent',
      },
    ];

    const context = {};

    stripe.paymentIntents.search.mockResolvedValue({data: mockPaymentIntents});

    const result = await searchPaymentIntents(stripe, context, {
      query: 'amount>1000',
      limit: 10,
      page: 'page_cursor',
    });

    expect(stripe.paymentIntents.search).toHaveBeenCalledWith(
      {query: 'amount>1000', limit: 10, page: 'page_cursor'},
      undefined
    );
    expect(result).toEqual(mockPaymentIntents);
  });

  it('should specify the connected account if included in context', async () => {
    const mockPaymentIntents = [
      {
        id: 'pi_123456',
        customer: 'cus_123456',
        amount: 1000,
        status: 'succeeded',
        description: 'Test Payment Intent',
      },
    ];

    const context = {
      account: 'acct_123456',
    };

    stripe.paymentIntents.search.mockResolvedValue({data: mockPaymentIntents});

    const result = await searchPaymentIntents(stripe, context, {
      query: 'status:"succeeded"',
    });

    expect(stripe.paymentIntents.search).toHaveBeenCalledWith(
      {query: 'status:"succeeded"'},
      {
        stripeAccount: context.account,
      }
    );
    expect(result).toEqual(mockPaymentIntents);
  });

  it('should return error message on failure', async () => {
    const context = {};

    stripe.paymentIntents.search.mockRejectedValue(new Error('API Error'));

    const result = await searchPaymentIntents(stripe, context, {
      query: 'status:"succeeded"',
    });

    expect(result).toBe('Failed to search payment intents');
  });
});
