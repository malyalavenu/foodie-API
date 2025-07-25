# CodeQL Security Analysis for Foodie API

This directory contains custom CodeQL queries and configuration for security analysis of the foodie-API project.

## Overview

The CodeQL setup includes custom security queries specifically designed for the foodie-API project, focusing on:

- SQL injection vulnerabilities in raw queries
- JWT authentication security issues
- Input validation gaps
- Authentication bypass vulnerabilities
- Error handling that could leak sensitive information

## Custom Queries

### 1. SQL Injection Detection (`sql-injection.ql`)
Detects potential SQL injection vulnerabilities in raw SQL queries used in database operations.

**Targets:**
- Raw SQL queries in service files
- User input flowing into database operations
- Missing parameterization

### 2. JWT Security (`jwt-security.ql`)
Identifies JWT-related security vulnerabilities in authentication middleware.

**Targets:**
- JWT verification without proper error handling
- Token extraction without validation
- Missing or weak JWT secrets

### 3. Input Validation (`input-validation.ql`)
Detects missing input validation in API endpoints.

**Targets:**
- Request body access without validation
- Path parameter access without validation
- Query parameter access without validation
- Missing Joi validation in controllers

### 4. Authentication Bypass (`authentication-bypass.ql`)
Identifies potential authentication bypass vulnerabilities.

**Targets:**
- Routes without authentication middleware
- Missing authorization checks
- Hardcoded authentication bypasses

### 5. Error Handling (`error-handling.ql`)
Detects error handling that could leak sensitive information.

**Targets:**
- Error responses containing sensitive data
- Error logging with sensitive information
- Stack trace exposure

## Configuration

The CodeQL analysis is configured in:
- `.github/workflows/codeql.yml` - GitHub Actions workflow
- `.github/codeql/codeql-config.yml` - Analysis configuration
- `.github/codeql/custom-queries/` - Custom security queries

## Running CodeQL Analysis

### Local Development
1. Install CodeQL CLI
2. Create a database: `codeql database create foodie-api-db --language=javascript`
3. Run analysis: `codeql database analyze foodie-api-db custom-queries --format=sarif-latest`

### GitHub Actions
The analysis runs automatically on:
- Push to main/development branches
- Pull requests to main/development branches
- Weekly scheduled runs (Mondays at 00:00 UTC)

## Security Focus Areas

### Database Security
- Raw SQL query parameterization
- Input validation before database operations
- Error handling in database queries

### Authentication Security
- JWT token validation
- Password hashing with bcrypt
- Authorization checks

### API Security
- Input validation with Joi
- Request body validation
- Path and query parameter validation

### Error Handling
- Sensitive information leakage
- Proper error response formatting
- Secure logging practices

## Customization

To add new security queries:

1. Create a new `.ql` file in `custom-queries/`
2. Follow the existing query patterns
3. Add the query to `query-suite.qls`
4. Update the configuration if needed

## Best Practices

1. **Regular Analysis**: Run CodeQL analysis regularly to catch new vulnerabilities
2. **False Positive Management**: Review and refine queries based on findings
3. **Team Training**: Educate team members on security patterns
4. **Integration**: Integrate findings into the development workflow

## Security Standards

This CodeQL setup helps maintain security standards for:
- OWASP Top 10 vulnerabilities
- CWE (Common Weakness Enumeration) categories
- Industry best practices for Node.js/TypeScript applications

## Support

For questions about the CodeQL setup or custom queries, refer to:
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [GitHub Security Lab](https://securitylab.github.com/)
- Project security guidelines and best practices 