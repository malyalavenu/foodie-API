/**
 * @name Missing Input Validation
 * @description Detects missing input validation in API endpoints
 * @id js/missing-input-validation
 * @kind problem
 * @problem.severity warning
 * @precision medium
 * @tags security
 *       external/cwe/cwe-20
 */

import javascript

/**
 * Detects missing input validation in foodie-API endpoints
 */
class InputValidationQuery {
  InputValidationQuery() {
    this = "InputValidationQuery"
  }

  /**
   * Detects request body access without validation
   */
  predicate isRequestBodyWithoutValidation(Expr expr) {
    exists(CallExpr call |
      call.getCalleeName() = "body" and
      call.getEnclosingFunction().getName() matches "%Controller%" and
      expr = call
    )
  }

  /**
   * Detects path parameter access without validation
   */
  predicate isPathParamWithoutValidation(Expr expr) {
    exists(CallExpr call |
      call.getCalleeName() = "params" and
      call.getEnclosingFunction().getName() matches "%Controller%" and
      expr = call
    )
  }

  /**
   * Detects query parameter access without validation
   */
  predicate isQueryParamWithoutValidation(Expr expr) {
    exists(CallExpr call |
      call.getCalleeName() = "query" and
      call.getEnclosingFunction().getName() matches "%Controller%" and
      expr = call
    )
  }

  /**
   * Detects missing Joi validation
   */
  predicate isMissingJoiValidation(Function func) {
    func.getName() matches "%Controller%" and
    not exists(ImportDeclaration imp |
      imp.getModuleSpecifier().getValue() = "joi" and
      func.getEnclosingScope() = imp.getEnclosingScope()
    )
  }
}

from InputValidationQuery query, Expr expr
where query.isRequestBodyWithoutValidation(expr)
select expr, "Request body accessed without validation", expr

from InputValidationQuery query, Expr expr
where query.isPathParamWithoutValidation(expr)
select expr, "Path parameter accessed without validation", expr

from InputValidationQuery query, Expr expr
where query.isQueryParamWithoutValidation(expr)
select expr, "Query parameter accessed without validation", expr

from InputValidationQuery query, Function func
where query.isMissingJoiValidation(func)
select func, "Controller function missing Joi validation", func 