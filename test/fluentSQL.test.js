import { expect, describe, test } from '@jest/globals';
import FluentSQLBuild from '../src/fluentSQL.js';

const data = [
  {
    id: 0,
    name: 'Francisco',
    category: 'Developer',
  },
  {
    id: 1,
    name: 'Maria',
    category: 'Developer',
  },
  {
    id: 2,
    name: 'Joao',
    category: 'Manager',
  },
];

describe('Test Suit for FluentSQL Builder', () => {
  test('#for should return a FluentSQLBuild instance', () => {
    const result = FluentSQLBuild.for(data);
    const expected = new FluentSQLBuild({ database: data });
    expect(result).toStrictEqual(expected);
  });

  test('#build should return the empty object instance', () => {
    const result = FluentSQLBuild.for(data).build();
    const expected = data;
    expect(result).toStrictEqual(expected);
  });

  test('#limit given a collection is should limit results', () => {
    const result = FluentSQLBuild.for(data).limit(1).build();
    const expected = [data[0]];

    expect(result).toStrictEqual(expected);
  });

  test('#where given a collection it should filter data', () => {
    const result = FluentSQLBuild.for(data)
      .where({
        category: /^Dev/,
      })
      .build();

    const expected = data.filter(
      ({ category }) => category.slice(0, 3) === 'Dev'
    );

    expect(result).toStrictEqual(expected);
  });

  test('#select given a collection it should return only specific fields', () => {
    const result = FluentSQLBuild.for(data)
      .select(['name', 'category'])
      .build();

    const expected = data.map(({ name, category }) => ({ name, category }));

    expect(result).toStrictEqual(expected);
  });

  test('#orderBy given a collection in should order results by field', () => {
    const result = FluentSQLBuild.for(data).orderBy('name').build();

    const expected = [
      {
        id: 0,
        name: 'Francisco',
        category: 'Developer',
      },
      {
        id: 2,
        name: 'Joao',
        category: 'Manager',
      },
      {
        id: 1,
        name: 'Maria',
        category: 'Developer',
      },
    ];

    expect(result).toStrictEqual(expected);
  });

  test('pipeline', () => {
    const result = FluentSQLBuild.for(data)
      .where({ category: 'Developer' })
      .where({ name: /^M/ })
      .select(['name', 'category'])
      .orderBy('name')
      .build();

    const expected = data
      .filter(({ id }) => id === 1)
      .map(({ name, category }) => ({ name, category }));

    expect(result).toStrictEqual(expected);
  });
});
