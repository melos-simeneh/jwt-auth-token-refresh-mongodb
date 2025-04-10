const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JWT Authentication API",
      version: "1.0.0",
      description:
        "API for handling JWT authentication with access and refresh tokens",
      contact: {
        name: "API Support",
        url: "https://yourdomain.com/support",
        email: "support@yourdomain.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/auth.routes.js"],
};

/**
 * This function initializes Swagger and returns the setup for Swagger UI.
 */
const setupSwagger = () => {
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  return [swaggerUi.serve, swaggerUi.setup(swaggerDocs)];
};

module.exports = setupSwagger;
