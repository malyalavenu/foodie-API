/**
 * @name Error Handling Vulnerabilities
 * @description Detects error handling issues that could leak sensitive information
 * @id js/error-handling
 * @kind problem
 * @problem.severity warning
 * @precision medium
 * @tags security
 *       external/cwe/cwe-209
 */

import javascript

/**
 * Detects error handling vulnerabilities in foodie-API
 */
class ErrorHandlingQuery {
  ErrorHandlingQuery() {
    this = "ErrorHandlingQuery"
  }

  /**
   * Detects error responses with sensitive information
   */
  predicate isErrorWithSensitiveInfo(CallExpr call) {
    call.getCalleeName() = "json" and
    exists(call.getAnArgument(0) |
      call.getAnArgument(0).getStringValue() matches "%password%" or
      call.getAnArgument(0).getStringValue() matches "%token%" or
      call.getAnArgument(0).getStringValue() matches "%secret%"
    )
  }

  /**
   * Detects error logging with sensitive data
   */
  predicate isErrorLoggingWithSensitiveData(CallExpr call) {
    call.getCalleeName() = "error" and
    exists(ImportDeclaration imp |
      imp.getModuleSpecifier().getValue() = "winston" and
      call.getEnclosingScope() = imp.getEnclosingScope()
    ) and
    exists(call.getAnArgument(0) |
      call.getAnArgument(0).getStringValue() matches "%password%" or
      call.getAnArgument(0).getStringValue() matches "%token%"
    )
  }

  /**
   * Detects stack trace exposure
   */
  predicate isStackTraceExposure(CallExpr call) {
    call.getCalleeName() = "json" and
    exists(call.getAnArgument(0) |
      call.getAnArgument(0).getStringValue() matches "%stack%" or
      call.getAnArgument(0).getStringValue() matches "%error.stack%"
    )
  }
}

from ErrorHandlingQuery query, CallExpr call
where query.isErrorWithSensitiveInfo(call)
select call, "Error response contains sensitive information", call

from ErrorHandlingQuery query, CallExpr call
where query.isErrorLoggingWithSensitiveData(call)
select call, "Error logging contains sensitive data", call

from ErrorHandlingQuery query, CallExpr call
where query.isStackTraceExposure(call)
select call, "Stack trace exposed in error response", call 