/**
 * @name Authentication Bypass Detection
 * @description Detects potential authentication bypass vulnerabilities
 * @id js/authentication-bypass
 * @kind problem
 * @problem.severity warning
 * @precision medium
 * @tags security
 *       external/cwe/cwe-287
 */

import javascript

/**
 * Detects authentication bypass vulnerabilities in foodie-API
 */
class AuthenticationBypassQuery {
  AuthenticationBypassQuery() {
    this = "AuthenticationBypassQuery"
  }

  /**
   * Detects routes without authentication middleware
   */
  predicate isRouteWithoutAuth(Function func) {
    func.getName() matches "%Controller%" and
    not exists(CallExpr call |
      call.getCalleeName() = "authenticateToken" and
      call.getEnclosingFunction() = func
    )
  }

  /**
   * Detects missing authorization checks
   */
  predicate isMissingAuthorizationCheck(Expr expr) {
    exists(CallExpr call |
      call.getCalleeName() = "params" and
      call.getAnArgument(0).getStringValue() = "userId" and
      not exists(CallExpr authCall |
        authCall.getCalleeName() = "verify" and
        authCall.getEnclosingFunction() = expr.getEnclosingFunction()
      )
    )
  }

  /**
   * Detects hardcoded authentication bypass
   */
  predicate isHardcodedAuthBypass(Expr expr) {
    exists(StringLiteral str |
      str.getValue() = "skip" or
      str.getValue() = "bypass" or
      str.getValue() = "admin" and
      expr = str
    )
  }
}

from AuthenticationBypassQuery query, Function func
where query.isRouteWithoutAuth(func)
select func, "Route function missing authentication middleware", func

from AuthenticationBypassQuery query, Expr expr
where query.isMissingAuthorizationCheck(expr)
select expr, "Missing authorization check for user access", expr

from AuthenticationBypassQuery query, Expr expr
where query.isHardcodedAuthBypass(expr)
select expr, "Potential hardcoded authentication bypass", expr 