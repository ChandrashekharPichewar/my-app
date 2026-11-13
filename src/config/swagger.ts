export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'MyApp Backend REST API',
    version: '1.0.0',
    description:
      'REST API for MyApp built with Node.js, Express, Prisma, and PostgreSQL. Supports user signup, login, refresh token rotation, and Expo push notification device registration.',
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
    { name: 'Device', description: 'Device ID and Expo push token registration' },
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
        required: ['deviceID', 'expoToken'],
        properties: {
          deviceID: { type: 'string', example: 'device-ios-9f8c2a1b' },
          expoToken: { type: 'string', example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' },
        },
      },
      DeviceResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Successfully saved' },
          deviceID: { type: 'string', example: 'device-ios-9f8c2a1b' },
          expoToken: { type: 'string', example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' },
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
        summary: 'Save or update deviceID and Expo push notification token',
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
            description: 'Device token saved',
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
  },
} as const;

