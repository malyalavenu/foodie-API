/**
 * @name JWT Security Vulnerabilities
 * @description Detects JWT security issues in authentication middleware
 * @id js/jwt-security
 * @kind problem
 * @problem.severity warning
 * @precision medium
 * @tags security
 *       external/cwe/cwe-287
 */

import javascript

/**
 * Detects JWT security vulnerabilities in foodie-API authentication
 */
class JWTSecurityQuery {
  JWTSecurityQuery() {
    this = "JWTSecurityQuery"
  }

  /**
   * Detects JWT verification without proper error handling
   */
  predicate isJWTVerificationWithoutErrorHandling(CallExpr call) {
    call.getCalleeName() = "verify" and
    exists(ImportDeclaration imp |
      imp.getModuleSpecifier().getValue() = "jsonwebtoken" and
      call.getCallee().getEnclosingScope().getEnclosingFunction().getEnclosingScope() = imp.getEnclosingScope()
    )
  }

  /**
   * Detects JWT token extraction without validation
   */
  predicate isJWTTokenExtractionWithoutValidation(Expr expr) {
    exists(CallExpr call |
      call.getCalleeName() = "replace" and
      call.getAnArgument(0).getStringValue() = "Bearer " and
      call.getAnArgument(1).getStringValue() = "" and
      expr = call
    )
  }

  /**
   * Detects missing JWT secret configuration
   */
  predicate isMissingJWTSecret(CallExpr call) {
    call.getCalleeName() = "verify" and
    not exists(call.getAnArgument(1) |
      call.getAnArgument(1).getStringValue() != ""
    )
  }
}

from JWTSecurityQuery query, CallExpr call
where query.isJWTVerificationWithoutErrorHandling(call)
select call, "JWT verification without proper error handling", call

from JWTSecurityQuery query, Expr expr
where query.isJWTTokenExtractionWithoutValidation(expr)
select expr, "JWT token extraction without proper validation", expr

from JWTSecurityQuery query, CallExpr call
where query.isMissingJWTSecret(call)
select call, "JWT verification with missing or empty secret", call 