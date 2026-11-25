export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'MyApp Backend REST API',
    version: '1.0.0',
    description:
      'REST API for MyApp built with Node.js, Express, Prisma, and PostgreSQL. Supports user signup, login, refresh token rotation, and device registration.',
  },
  servers: [
    {
      url: '/',
      description: 'Current server',
    },
  ],
  tags: [
    { name: 'Health', description: 'Service and database health checks' },
    { name: 'Auth', description: 'User registration, login, and token refresh' },
    { name: 'Device', description: 'Device ID registration' },
    { name: 'Support', description: 'Issue reporting and user support tickets' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      SignupRequest: {
        type: 'object',
        required: ['firstname', 'lastname', 'email', 'password', 'deviceId'],
        properties: {
          firstname: { type: 'string', example: 'John' },
          lastname: { type: 'string', example: 'Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          password: { type: 'string', minLength: 6, example: 'Secret@123' },
          deviceId: { type: 'string', example: 'device-ios-9f8c2a1b' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['username', 'password', 'deviceId'],
        properties: {
          username: {
            type: 'string',
            description: 'Registered email or firstname',
            example: 'john.doe@example.com',
          },
          password: { type: 'string', example: 'Secret@123' },
          deviceId: { type: 'string', example: 'device-ios-9f8c2a1b' },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          userId: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
          accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          firstname: { type: 'string', example: 'John' },
          lastname: { type: 'string', example: 'Doe' },
        },
      },
      DeviceRequest: {
        type: 'object',
        required: ['deviceID'],
        properties: {
          deviceID: { type: 'string', example: 'device-ios-9f8c2a1b' },
        },
      },
      DeviceResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Successfully saved' },
          deviceID: { type: 'string', example: 'device-ios-9f8c2a1b' },
        },
      },
      ReportIssueRequest: {
        type: 'object',
        required: ['issueType', 'urgency', 'briefDescription', 'details'],
        properties: {
          issueType: { type: 'string', example: 'Ride Booking / Cancellation' },
          urgency: { type: 'string', example: 'High — Impacts an upcoming or recent ride' },
          briefDescription: {
            type: 'string',
            example: 'Driver cancelled ride 5 minutes before pickup',
          },
          details: {
            type: 'string',
            example:
              'Booked ride ride-101 for 08:45 AM from Gachibowli to HITEC City. Host cancelled last minute and I need a refund.',
          },
          deviceId: { type: 'string', example: '+919876543210' },
        },
      },
      IssueTicket: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'c4b1e8a2-7f3d-4c11-9b5a-2e8d910f3a12' },
          ticketCode: { type: 'string', example: 'RACE-482910' },
          userId: { type: 'string', format: 'uuid', example: '8a5ecf46-9466-4728-b837-ddc31ed7c4d6' },
          issueType: { type: 'string', example: 'Ride Booking / Cancellation' },
          urgency: { type: 'string', example: 'High — Impacts an upcoming or recent ride' },
          briefDescription: {
            type: 'string',
            example: 'Driver cancelled ride 5 minutes before pickup',
          },
          details: {
            type: 'string',
            example: 'Booked ride ride-101 for 08:45 AM from Gachibowli to HITEC City...',
          },
          status: { type: 'string', example: 'OPEN' },
          createdAt: { type: 'string', format: 'date-time', example: '2026-11-26T01:30:00.000Z' },
        },
      },
      ReportIssueResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Issue report submitted successfully' },
          ticket: { $ref: '#/components/schemas/IssueTicket' },
        },
      },
      TicketSummary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'c4b1e8a2-7f3d-4c11-9b5a-2e8d910f3a12' },
          ticketCode: { type: 'string', example: 'RACE-482910' },
          issueType: { type: 'string', example: 'Ride Booking / Cancellation' },
          urgency: { type: 'string', example: 'High — Impacts an upcoming or recent ride' },
          briefDescription: {
            type: 'string',
            example: 'Driver cancelled ride 5 minutes before pickup',
          },
          status: { type: 'string', example: 'OPEN' },
          createdAt: { type: 'string', format: 'date-time', example: '2026-11-26T01:30:00.000Z' },
        },
      },
      MyTicketsResponse: {
        type: 'object',
        properties: {
          tickets: {
            type: 'array',
            items: { $ref: '#/components/schemas/TicketSummary' },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Validation failed' },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Invalid email format' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API and PostgreSQL health',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    database: { type: 'string', example: 'connected' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignupRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '409': {
            description: 'Email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate an existing user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Authenticated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid username or password',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Rotate refresh token and issue a new access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Tokens rotated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '401': {
            description: 'Invalid or expired refresh token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/deviceId': {
      post: {
        tags: ['Device'],
        summary: 'Save or update deviceID',
        security: [{}, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DeviceRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Device saved',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DeviceResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/support/report-issue': {
      post: {
        tags: ['Support'],
        summary: 'Submit a new issue report',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReportIssueRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Issue report submitted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ReportIssueResponse' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized. Valid access token is required.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/support/my-tickets': {
      get: {
        tags: ['Support'],
        summary: "Fetch authenticated user's support tickets",
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of user support tickets',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MyTicketsResponse' },
              },
            },
          },
          '401': {
            description: 'Unauthorized. Valid access token is required.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
} as const;

