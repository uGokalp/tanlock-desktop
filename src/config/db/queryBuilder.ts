import { QueryData } from "rado/index"
import { SqliteFormatter } from "rado/sqlite"

type Param = {
  type: string
  value: string
}

interface Model {
  toJSON: () => QueryData
}

/* 
  Query builder is used to convert a rado query to a sql statement and an array of parameters.
*/

const queryBuilder = (model: Model) => {
  const formatter = new SqliteFormatter()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
  const statement = formatter.compile(model.toJSON())
  const params = statement.paramData.map((p) => (p as Param).value)
  return { statement, params }
}

export default queryBuilder
