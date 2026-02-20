import { GRAPHQL_ENDPOINT } from './config';

export class GraphQLRequestError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'GraphQLRequestError';
    this.status = details.status ?? null;
    this.errors = details.errors ?? null;
  }
}

const buildHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const graphqlRequest = async ({ query, variables = {}, token, signal }) => {
  if (!query) {
    throw new GraphQLRequestError('GraphQL query is required.');
  }

  let response;
  try {
    response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify({ query, variables }),
      signal,
    });
  } catch (error) {
    throw new GraphQLRequestError('Unable to reach API server.', {
      errors: [{ message: error.message }],
    });
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    throw new GraphQLRequestError('API returned an invalid JSON response.', {
      status: response.status,
      errors: [{ message: error.message }],
    });
  }

  if (!response.ok) {
    const message =
      payload?.errors?.[0]?.message || `GraphQL request failed with status ${response.status}.`;

    throw new GraphQLRequestError(message, {
      status: response.status,
      errors: payload?.errors,
    });
  }

  if (payload?.errors?.length) {
    throw new GraphQLRequestError(payload.errors[0].message, {
      status: response.status,
      errors: payload.errors,
    });
  }

  if (!payload?.data) {
    throw new GraphQLRequestError('GraphQL response did not include data.', {
      status: response.status,
    });
  }

  return payload.data;
};

