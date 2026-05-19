import type { ChatCompletionTool } from 'openai/resources/chat/completions'

// Tool definitions fed to Claude via OpenRouter
// Claude will decide which tools to call and in what order

export const TRAVEL_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_flights',
      description: 'Search for available flights between two airports. Use IATA codes (e.g. KWI for Kuwait, DXB for Dubai, LHR for London). Returns top offers with prices in USD.',
      parameters: {
        type: 'object',
        required: ['origin', 'destination', 'departureDate', 'adults'],
        properties: {
          origin:        { type: 'string', description: 'Departure airport IATA code (e.g. "KWI")' },
          destination:   { type: 'string', description: 'Arrival airport IATA code (e.g. "LHR")' },
          departureDate: { type: 'string', description: 'Departure date YYYY-MM-DD' },
          returnDate:    { type: 'string', description: 'Return date YYYY-MM-DD for round trips' },
          adults:        { type: 'number', description: 'Number of adult passengers' },
          cabinClass:    { type: 'string', enum: ['economy','premium_economy','business','first'], description: 'Cabin class preference' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_hotels',
      description: 'Search for hotels in a destination city. Returns properties with prices, ratings, and amenities.',
      parameters: {
        type: 'object',
        required: ['cityName', 'checkin', 'checkout', 'adults'],
        properties: {
          cityName:      { type: 'string', description: 'City name (e.g. "Dubai", "Paris", "London")' },
          checkin:       { type: 'string', description: 'Check-in date YYYY-MM-DD' },
          checkout:      { type: 'string', description: 'Check-out date YYYY-MM-DD' },
          adults:        { type: 'number', description: 'Number of guests' },
          rooms:         { type: 'number', description: 'Number of rooms (default 1)' },
          starRating:    { type: 'number', enum: [3, 4, 5], description: 'Minimum star rating' },
          maxBudgetUsd:  { type: 'number', description: 'Maximum total budget in USD' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_experiences',
      description: 'Find tours, activities, and experiences at a destination. Returns top-rated options with prices.',
      parameters: {
        type: 'object',
        required: ['destination'],
        properties: {
          destination: { type: 'string', description: 'City or destination name' },
          category:    { type: 'string', description: 'Activity category (e.g. "food", "adventure", "cultural", "beach")' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'confirm_flight_price',
      description: 'Confirm the final price of a selected flight offer before booking. Always call this before creating an order.',
      parameters: {
        type: 'object',
        required: ['offerId'],
        properties: {
          offerId: { type: 'string', description: 'The Duffel offer ID from a previous search_flights call' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_flight_booking',
      description: 'Create a confirmed flight booking after the customer has agreed to the price and provided their details.',
      parameters: {
        type: 'object',
        required: ['offerId', 'passenger'],
        properties: {
          offerId: { type: 'string', description: 'The Duffel offer ID' },
          passenger: {
            type: 'object',
            required: ['givenName', 'familyName', 'dateOfBirth', 'gender', 'email', 'phoneNumber'],
            properties: {
              givenName:      { type: 'string' },
              familyName:     { type: 'string' },
              dateOfBirth:    { type: 'string', description: 'YYYY-MM-DD' },
              gender:         { type: 'string', enum: ['m', 'f'] },
              email:          { type: 'string' },
              phoneNumber:    { type: 'string', description: 'E.164 format e.g. +96512345678' },
              passportNumber: { type: 'string' },
            },
          },
        },
      },
    },
  },
]
