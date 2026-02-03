import Stripe from 'stripe';
import {z} from 'zod';
import type {Context} from '@/shared/configuration';
import type {StripeToolDefinition} from '@/shared/tools';

export const searchPaymentIntentsPrompt = (context: Context = {}) => {
  return `
This tool will search payment intents in Stripe using a query string.

It takes three arguments:
- query (str, required): The search query string using Stripe's search query language.
- limit (int, optional): The maximum number of payment intents to return (1-100).
- page (str, optional): A cursor for pagination across multiple pages of results.

## Query Syntax

The query string supports the following fields:

| Field | Type | Example |
|-------|------|---------|
| amount | numeric | \`amount>1000\` |
| created | numeric | \`created>1620310503\` |
| currency | token | \`currency:"usd"\` |
| customer | token | \`customer:"cus_123"\` |
| metadata | token | \`metadata["key"]:"value"\` |
| status | token | \`status:"succeeded"\` |

## Operators

- Numeric fields support: \`>\`, \`<\`, \`>=\`, \`<=\`, \`=\`
- Token fields use exact match with quotes: \`field:"value"\`
- Combine conditions with \`AND\` or \`OR\`
- Negate with \`-\` prefix: \`-status:"canceled"\`

## Examples

- Find succeeded payments over $10: \`status:"succeeded" AND amount>1000\`
- Find payments for a customer: \`customer:"cus_123"\`
- Find USD payments: \`currency:"usd"\`
`;
};

export const searchPaymentIntents = async (
  stripe: Stripe,
  context: Context,
  params: z.infer<ReturnType<typeof searchPaymentIntentsParameters>>
) => {
  try {
    const searchParams: Stripe.PaymentIntentSearchParams = {
      query: params.query,
      ...(params.limit !== undefined && {limit: params.limit}),
      ...(params.page !== undefined && {page: params.page}),
    };

    const paymentIntents = await stripe.paymentIntents.search(
      searchParams,
      context.account ? {stripeAccount: context.account} : undefined
    );

    return paymentIntents.data;
  } catch (error) {
    return 'Failed to search payment intents';
  }
};

export const searchPaymentIntentsAnnotations = () => ({
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
  readOnlyHint: true,
  title: 'Search payment intents',
});

export const searchPaymentIntentsParameters = (
  context: Context = {}
): z.AnyZodObject => {
  return z.object({
    query: z
      .string()
      .describe(
        'The search query string using Stripe search query language. Example: status:"succeeded" AND amount>1000'
      ),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe(
        'A limit on the number of objects to be returned. Limit can range between 1 and 100.'
      ),
    page: z
      .string()
      .optional()
      .describe('A cursor for pagination across multiple pages of results.'),
  });
};

const tool = (context: Context): StripeToolDefinition => ({
  method: 'search_payment_intents',
  name: 'Search Payment Intents',
  description: searchPaymentIntentsPrompt(context),
  inputSchema: searchPaymentIntentsParameters(context),
  annotations: searchPaymentIntentsAnnotations(),
  actions: {
    paymentIntents: {
      search: true,
    },
  },
  execute: searchPaymentIntents,
});

export default tool;
