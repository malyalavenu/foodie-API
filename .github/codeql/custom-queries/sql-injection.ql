/**
 * @name Potential SQL Injection in Raw Queries
 * @description Detects potential SQL injection vulnerabilities in raw SQL queries
 * @id js/sql-injection
 * @kind problem
 * @problem.severity warning
 * @precision medium
 * @tags security
 *       external/cwe/cwe-089
 */

import javascript
import semmle.javascript.security.SQLInjectionQuery

/**
 * Detects potential SQL injection in raw SQL queries used in the foodie-API
 */
class FoodieAPISQLInjectionQuery extends SQLInjectionQuery {
  FoodieAPISQLInjectionQuery() {
    this = "FoodieAPISQLInjectionQuery"
  }

  override predicate isSource(DataFlow::Node source) {
    // Sources specific to foodie-API
    exists(Parameter p |
      p.getAnnotatedType().getBaseType().toString() = "string" and
      (
        p.getName() = "userId" or
        p.getName() = "restaurantId" or
        p.getName() = "email" or
        p.getName() = "name" or
        p.getName() = "address" or
        p.getName() = "cuisine" or
        p.getName() = "location"
      ) and
      source.asParameter() = p
    )
  }

  override predicate isSink(DataFlow::Node sink) {
    // Sinks specific to foodie-API database operations
    exists(CallExpr call |
      call.getCalleeName() = "query" and
      sink.asExpr() = call.getAnArgument(1)
    )
  }
}

from FoodieAPISQLInjectionQuery query, DataFlow::PathNode source, DataFlow::PathNode sink
where query.hasFlow(source, sink)
select sink, "Potential SQL injection vulnerability in raw query", source, sink 