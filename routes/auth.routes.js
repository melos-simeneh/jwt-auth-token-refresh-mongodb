const { Router } = require("express");
const {
  signup,
  login,
  refresh,
  logout,
  logoutWithToken,
  refreshWithToken,
} = require("../controllers/auth.controller.js");
const {
  validateSignup,
  validateLogin,
  validateRefreshToken,
} = require("../middlewares/validation.middleware.js");
const { auth } = require("../middlewares/auth.middleware.js");

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: ^[a-zA-Z0-9_]+$
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 26
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Username already exists
 *       422:
 *         description: Validation Error
 */
router.post("/signup", validateSignup, signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation Error
 */
router.post("/login", validateLogin, login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using a refresh token (cookie-based)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Generates a new access token if the refresh token is valid.
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Access token refreshed successfully"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: No refresh token provided (cookie missing)
 *       403:
 *         description: Invalid or expired refresh token
 *
 */

router.post("/refresh-token", auth, refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and invalidate refresh token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Clears the HTTP-only refresh token cookie and removes it from the database.
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       401:
 *         description: No refresh token found (nothing to logout)
 *
 */
router.post("/logout", auth, logout);

/**
 * @swagger
 * /api/auth/refresh-token-with-body:
 *   post:
 *     summary: Refresh access token using a refresh token (from request body)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Generates a new access token if the refresh token provided in the request body is valid.
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Access token refreshed successfully"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: No refresh token provided in the body
 *       403:
 *         description: Invalid or expired refresh token
 *
 */
router.post("/refresh-token-with-body", auth, refreshWithToken);

/**
 * @swagger
 * /api/auth/logout-with-body:
 *   post:
 *     summary: Logout user and invalidate refresh token (from request body)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     description: Clears the refresh token from the database and logs out the user based on the refresh token provided in the request body.
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       400:
 *         description: No refresh token provided in the body
 *
 */
router.post("/logout-with-body", auth, logoutWithToken);

module.exports = router;
