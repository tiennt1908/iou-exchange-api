export const parseSQL = {
  where: (input: any) => {
    let conditions = ""
    const keys = Object.keys(input);
    const length = keys.length
    for (let i = 0; i < length; i++) {
      const key = keys[i];
      const value = input[key];
      if (value) {
        if (conditions === "") {
          conditions = `${key} = '${value}'`;
        }
        else {
          conditions += ` AND ${key} = '${value}'`;
        }
      }
    }
    return (conditions.length > 0 ? "WHERE " : "") + conditions;
  },
  limit: ({ index, limit }: { index: number, limit: number }) => {
    if (index >= 0 && limit > 0) {
      return `LIMIT ${index}, ${limit}`;
    }
    return "";
  },
  orderBy: ({ column, sort, columnAllowed }: { column: string, sort: string, columnAllowed: { [key: string]: boolean } }) => {
    if (columnAllowed[column]) {
      return `ORDER BY ${column} ${sort || "DESC"}`
    }
    return "";
  }
}