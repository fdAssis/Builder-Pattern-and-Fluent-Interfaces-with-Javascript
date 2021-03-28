export default class FluentSQLBuilder {
  #database = [];
  #limit = 0;
  #select = [];
  #where = [];
  #orberBy = '';

  constructor({ database }) {
    this.#database = database;
  }

  static for(database) {
    return new FluentSQLBuilder({ database });
  }

  limit(max) {
    this.#limit = max;

    return this;
  }

  select(props) {
    this.#select = props;

    return this;
  }

  where(query) {
    const [[props, selectedValue]] = Object.entries(query);
    const whereFilter =
      selectedValue instanceof RegExp
        ? selectedValue
        : new RegExp(selectedValue);

    this.#where.push({ props, filter: whereFilter });

    return this;
  }

  orderBy(field) {
    this.#orberBy = field;

    return this;
  }

  #performLimit(results) {
    return this.#limit && results.length === this.#limit;
  }

  #performWhere(item) {
    for (const { filter, props } of this.#where) {
      if (!filter.test(item[props])) return false;
    }

    return true;
  }

  #performSelect(item) {
    const currentItem = {};
    const entries = Object.entries(item);

    for (const [key, value] of entries) {
      if (this.#select.length && !this.#select.includes(key)) continue;

      currentItem[key] = value;
    }

    return currentItem;
  }

  #performOrderBy(results) {
    if (!this.#orberBy) return results;

    return results.sort((prev, next) => {
      return prev[this.#orberBy].localeCompare(next[this.#orberBy]);
    });
  }

  build() {
    const results = [];

    for (const item of this.#database) {
      if (!this.#performWhere(item)) continue;

      const currentItem = this.#performSelect(item);

      results.push(currentItem);

      if (this.#performLimit(results)) break;
    }

    const finalResult = this.#performOrderBy(results);

    return finalResult;
  }
}
