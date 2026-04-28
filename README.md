# Card Validation API

A REST API that validates card numbers using the Luhn algorithm, built with Node.js, TypeScript, and Express.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [The Endpoint](#the-endpoint)
4. [Environment Variables](#environment-variables)
5. [Deployment](#deployment)
6. [Design Decisions](#design-decisions)
7. [Testing Approach](#testing-approach)
8. [Author](#author)

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### Installation

```bash
git clone https://github.com/Alaliman/card-validation-api
cd card-validation-api
npm install
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

### Running Tests

```bash
npm test
```

Server runs on `http://localhost:3000` by default.

---

## Project Structure

```
card-validation-api/
├── src/
│   ├── controllers/
│   │   └── card-validation.controller.ts     # Handles HTTP request and response only
│   ├── services/
│   │   └── card-validation.service.ts        # Luhn algorithm logic
│   ├── middlewares/
│   │   └── card-validation.middleware.ts      # Input sanitization and validation
│   ├── routes/
│   │   └── card-validation.route.ts         # Registers the endpoint and connects middleware to controller
│   ├── tests/
│   │   └── card-validation.service.test.ts   # Unit tests for the Luhn algorithm
│   ├── app.ts                     # Express app setup, CORS, and route mounting
│   └── main.ts                    # Entry point — loads env and starts the server
├── .env                           # Local environment variables (not committed to git)
├── tsconfig.json
├── package.json
└── README.md
```

| File / Folder | Responsibility |
|---|---|
| `controllers/card-validation.controller.ts` | Calls the service and sends the HTTP response. No logic. |
| `services/card-validation.service.ts` | Runs the Luhn algorithm. No HTTP knowledge. |
| `middlewares/card-validation.middleware.ts` | Validates and sanitizes the request body before it reaches the controller. |
| `routes/card-validation.route.ts` | Wires middleware and controller to the route path. |
| `tests/card-validation.service.test.ts` | Unit tests for the Luhn algorithm in isolation. |
| `app.ts` | Configures Express, CORS, and mounts routers. |
| `main.ts` | Loads environment variables and starts the HTTP server. |

---

## The Endpoint

### `POST /api/validate-card`

Validates whether a card number passes the Luhn algorithm check.

**Request body**

```json
{ "cardNumber": "4532015112830366" }
```

> **Note:** Spaces and dashes are accepted and stripped automatically.
> `"4532-0151-1283-0366"` is treated the same as `"4532015112830366"`.

---

### Responses

**Valid card — HTTP 200**

```json
{
  "valid": true,
  "message": "The card number is valid"
}
```

**Invalid card — HTTP 200**

```json
{
  "valid": false,
  "message": "The card number did not pass validation"
}
```

**Missing field — HTTP 400**

```json
{
  "error": "MISSING_FIELD",
  "message": "cardNumber is required"
}
```

**Empty string — HTTP 400**

```json
{
  "error": "INVALID_INPUT",
  "message": "cardNumber cannot be empty"
}
```

**Wrong type — HTTP 400**

```json
{
  "error": "INVALID_TYPE",
  "message": "card number must be a string"
}
```

**Non-digit characters — HTTP 400**

```json
{
  "error": "INVALID_FORMAT",
  "message": "card number must contain digits only"
}
```

**Wrong length — HTTP 400**

```json
{
  "error": "INVALID_LENGTH",
  "message": "card number must be between 13 and 19 digits"
}
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the server listens on |

Create a `.env` file in the project root:

```bash
PORT=3000
```

> **Note:** `.env` is gitignored and never pushed to GitHub. In production on Render, `PORT` is provided automatically by the platform — no `.env` file is needed.

---

## Deployment

This API can be deployed using platforms like render. This is optional

### Basic configuration

- Build Command: `npm run build`
- Start Command: `npm start`

Environment variables such as `PORT` are automatically managed by the platform.

---

## Design Decisions

### Why Express over NestJS

This project exposes a single endpoint. NestJS is a framework designed for large, multi-module applications — it brings dependency injection, decorators, and a module system that would add significant weight and abstraction to something this focused. Express was chosen because every layer in this project is visible and deliberate. There is no inherited structure, no magic, and no framework conventions to learn before understanding what the code does. The project is small enough that full structural visibility is a feature, not a limitation.

### Why the Luhn algorithm

The Luhn algorithm is the industry standard for card number structural validation. It is used by Visa, Mastercard, American Express, and Verve. It is lightweight, deterministic, and requires no external API calls or network access. It is worth being precise about what Luhn does and does not do: it confirms that a card number is structurally valid — it does not confirm that a card account exists or that a charge would succeed. Verifying that requires a payment processor. For the purpose of structural validation, Luhn is the correct and complete answer.

### Why a routes folder

The routes folder separates endpoint registration from application configuration. `app.ts` is responsible for global setup only — middleware, CORS, and mounting routers. The routes file owns the endpoint definitions: which path, which middleware runs first, and which controller handles the request. This means adding a new resource in the future is a matter of adding a new router and mounting it in `app.ts` without touching any existing routes. The separation keeps each file focused on a single concern.

### Why input validation is in middleware and not the controller

The controller has one job: call the service and return a response. The service has one job: run the Luhn algorithm. Neither layer should be responsible for parsing or rejecting raw input — that would mix concerns and make each layer harder to test independently. The middleware layer sits between the route and the controller and gates every request before business logic runs. If the input is invalid, the middleware rejects it with an appropriate error and the controller never executes. This keeps all three layers focused, independently testable, and free of cross-cutting concerns.

### Why strip spaces and dashes

Card numbers in the real world are commonly written with spaces or dashes between digit groups — on physical cards, in form fields, and in documentation. Rejecting that format would make the API unnecessarily strict without any correctness or security benefit. The number `4532-0151-1283-0366` and `4532015112830366` represent the same card. Stripping spaces and dashes before validation ensures the API handles the format developers and users actually encounter.

### Why 13–19 digit length validation

Different card networks issue numbers of different lengths. Visa issues 13 or 16 digits, Mastercard issues 16, American Express issues 15, and Verve issues 16 or 19. Any number outside the 13–19 digit range cannot be a valid card number by definition, regardless of what the Luhn algorithm would return. Rejecting it early avoids running unnecessary computation and produces a clear, specific error message for the caller.

### Why an invalid card returns HTTP 200 and not 400

An HTTP 400 status means the server could not understand the request. When a card number fails the Luhn check, the server understood the request exactly — the answer is simply no. Returning 400 for a failed validation conflates two distinct outcomes: a malformed request that the server cannot process, and a well-formed request that produced a negative result. HTTP 200 with `"valid": false` is the semantically correct response. The request succeeded; the card did not pass.

### Why there is no error field on 200 responses

The `error` field belongs on 4xx responses, where something went wrong at the request level. A 200 response means the request was received, understood, and processed successfully. Adding an `error` key to that response sends contradictory signals to any developer consuming the API — it implies both that the request succeeded and that something failed. The outcome of the validation is communicated clearly through `valid` and `message`, which is sufficient.

### Why dotenv

The server reads `PORT` from environment variables via `process.env`. In development, that value comes from a `.env` file in the project root. `dotenv` loads that file at startup and makes its contents available through `process.env` without any manual parsing. In production on Render, the platform injects environment variables directly into the process, so `dotenv` has nothing to load — `process.env.PORT` is already set. The same code works in both environments without modification.

### Why main.ts and app.ts are separate

`app.ts` configures the Express application — it registers middleware, sets up CORS, and mounts routers. `main.ts` reads environment variables and calls `app.listen` to start the server on a port. Keeping these two concerns in separate files means the test suite can import the Express app directly from `app.ts` without binding to a port. Tests run against the application in isolation, without starting a real server, which keeps them fast and free of port conflicts.

---

## Testing Approach

Tests are written with Jest and cover the Luhn algorithm in isolation. There is no HTTP layer, no middleware, and no server involved — just the pure algorithm function called directly. This is a unit test by design. If the algorithm is correct, the endpoint built on top of it is correct. Testing the algorithm directly also makes failures easier to diagnose: a failing test points to a problem in the logic, not in routing, middleware, or serialization.

### Test Cases

| Test | Input | Expected |
|---|---|---|
| Valid Visa number | `4532015112830366` | `true` |
| Valid Mastercard number | `5425233430109903` | `true` |
| Invalid number (fails Luhn) | `1234567890123456` | `false` |
| All same digits | `1111111111111111` | `false` |
| Valid number with last digit flipped | `4532015112830367` | `false` |

The last test case is particularly useful: it takes a known-valid number and flips its final digit by one, which is exactly the type of single-digit error the Luhn algorithm is designed to catch.

---

## Author

**Emmanuel Alali**
GitHub: [github.com/Alaliman](https://github.com/Alaliman)
